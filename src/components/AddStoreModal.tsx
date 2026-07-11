/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import { Store, ECommercePlatform, StoreRegion } from '../types';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStore: (store: Omit<Store, 'id' | 'isVerified'>) => void;
}

export default function AddStoreModal({ isOpen, onClose, onAddStore }: AddStoreModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [region, setRegion] = useState<StoreRegion>(StoreRegion.SP);
  const [platform, setPlatform] = useState<ECommercePlatform | ''>('');
  const [tags, setTags] = useState<string[]>(['essencias']);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    // Standardize URL protocol
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Standardize WhatsApp formatting (only numbers)
    let formattedWhatsapp = whatsapp.replace(/\D/g, '');
    if (formattedWhatsapp) {
      if (!formattedWhatsapp.startsWith('55') && formattedWhatsapp.length <= 11) {
        formattedWhatsapp = '55' + formattedWhatsapp;
      }
    }

    onAddStore({
      name: name.trim(),
      url: formattedUrl,
      whatsapp: formattedWhatsapp || undefined,
      platform: platform || ECommercePlatform.GOOGLE_FALLBACK,
      region,
      tags
    });

    setIsSuccess(true);
    setName('');
    setUrl('');
    setWhatsapp('');
    setPlatform('');
    setRegion(StoreRegion.SP);
  };

  const handleSendWhatsAppToAdmin = () => {
    const adminNumber = '5511999999999'; // Simulated admin number
    const message = encodeURIComponent(
      `Olá! Gostaria de sugerir um novo fornecedor de perfumaria:\n\n` +
      `• Nome: ${name || 'N/A'}\n` +
      `• Site: ${url || 'N/A'}\n` +
      `• WhatsApp: ${whatsapp || 'Não informado'}\n` +
      `• Região: ${region}\n` +
      `• Plataforma: ${platform || 'Não sei / Google Fallback'}`
    );
    window.open(`https://wa.me/${adminNumber}?text=${message}`, '_blank');
  };

  return (
    <div 
      id="add-store-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
    >
      <div 
        id="add-store-modal-container"
        className="relative bg-[#121212] border border-[#d4af37]/30 rounded-lg w-full max-w-lg p-6 md:p-8 overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.15)] animate-in zoom-in-95 duration-200"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

        <div className="flex items-center justify-between mb-6 border-b border-[#d4af37]/15 pb-4">
          <h3 className="font-serif text-2xl text-white font-medium tracking-tight flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#d4af37]" /> Adicionar Fornecedor
          </h3>
          <button 
            id="close-modal-btn"
            type="button"
            onClick={() => {
              onClose();
              setIsSuccess(false);
            }}
            className="p-1 hover:bg-coal-800 rounded text-coal-400 hover:text-gold-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          /* Success message state */
          <div id="add-store-success-view" className="text-center py-6 animate-in fade-in duration-300">
            <CheckCircle className="w-16 h-16 text-[#d4af37] mx-auto mb-4" />
            <h4 className="font-serif text-xl text-white font-medium mb-2">
              Fornecedor Cadastrado com Sucesso!
            </h4>
            <p className="text-sm text-coal-400 max-w-sm mx-auto mb-6">
              Ele já foi adicionado às suas buscas com a tag <strong>"Comunidade"</strong> e está disponível na lista de filtros.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleSendWhatsAppToAdmin}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3 px-4 rounded text-xs transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> Enviar ao Administrador pelo WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs text-[#d4af37] hover:text-white py-2 underline"
              >
                Cadastrar mais um fornecedor
              </button>
            </div>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-serif text-[#d4af37] uppercase tracking-wider mb-1.5 font-semibold">
                Nome da Loja/Fornecedor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Paris Essências, Julia Embalagens"
                className="w-full bg-coal-950 text-white border border-coal-700 focus:border-[#d4af37] focus:outline-none rounded text-sm px-4 py-3 transition-colors placeholder-coal-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-serif text-[#d4af37] uppercase tracking-wider mb-1.5 font-semibold">
                Link do Site (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: www.nomedaloja.com.br"
                className="w-full bg-coal-950 text-white border border-coal-700 focus:border-[#d4af37] focus:outline-none rounded text-sm px-4 py-3 transition-colors placeholder-coal-600"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif text-[#d4af37] uppercase tracking-wider mb-1.5 font-semibold">
                  WhatsApp de Contato
                </label>
                <input
                  type="text"
                  placeholder="Ex: 11999999999"
                  className="w-full bg-coal-950 text-white border border-coal-700 focus:border-[#d4af37] focus:outline-none rounded text-sm px-4 py-3 transition-colors placeholder-coal-600"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-[#d4af37] uppercase tracking-wider mb-1.5 font-semibold">
                  Estado / Região
                </label>
                <select
                  className="w-full bg-coal-950 text-white border border-coal-700 focus:border-[#d4af37] focus:outline-none rounded text-sm px-4 py-3 transition-colors"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as StoreRegion)}
                >
                  {Object.values(StoreRegion).map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif text-[#d4af37] uppercase tracking-wider mb-1.5 font-semibold">
                Plataforma de E-commerce
              </label>
              <select
                className="w-full bg-coal-950 text-white border border-coal-700 focus:border-[#d4af37] focus:outline-none rounded text-sm px-4 py-3 transition-colors"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as ECommercePlatform)}
              >
                <option value="">Não sei / Desconhecida (Usa busca Google)</option>
                <option value={ECommercePlatform.NUVEMSHOP}>Nuvemshop</option>
                <option value={ECommercePlatform.SHOPIFY}>Shopify</option>
                <option value={ECommercePlatform.WOOCOMMERCE}>WooCommerce (WordPress)</option>
                <option value={ECommercePlatform.LOJA_INTEGRADA}>Loja Integrada</option>
                <option value={ECommercePlatform.TRAY}>Tray</option>
                <option value={ECommercePlatform.OPENCART}>OpenCart</option>
              </select>
              <p className="text-[10px] text-coal-400 mt-1">
                Lojas sem plataforma cadastrada abrirão automaticamente em resultados filtrados do Google (site:link.com termo).
              </p>
            </div>

            <div className="pt-4 border-t border-[#d4af37]/15 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsSuccess(false);
                }}
                className="px-5 py-3 rounded text-sm text-coal-400 hover:text-white hover:bg-coal-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] font-serif font-bold uppercase tracking-wider px-6 py-3 rounded text-xs transition-all shadow-lg"
              >
                <Send className="w-3.5 h-3.5" /> Enviar Cadastro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
