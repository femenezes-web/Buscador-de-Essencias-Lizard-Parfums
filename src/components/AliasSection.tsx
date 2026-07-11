/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Plus, Link as LinkIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Essence } from '../types';

interface AliasSectionProps {
  searchTerm: string;
  matchedEssence: Essence | null;
  essences: Essence[];
  onAddAlias: (essenceId: string, newAlias: string) => void;
  onAddNewEssence: (canonicalName: string, category: 'masculino' | 'feminino' | 'compartilhada' | 'outros', initialAlias: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function AliasSection({
  searchTerm,
  matchedEssence,
  essences,
  onAddAlias,
  onAddNewEssence,
  favorites,
  toggleFavorite
}: AliasSectionProps) {
  const [newAlias, setNewAlias] = useState('');
  const [isAddingAlias, setIsAddingAlias] = useState(false);
  const [selectedEssenceId, setSelectedEssenceId] = useState('');
  const [newCanonicalName, setNewCanonicalName] = useState('');
  const [newCategory, setNewCategory] = useState<'masculino' | 'feminino' | 'compartilhada' | 'outros'>('masculino');
  const [activeTab, setActiveTab] = useState<'link' | 'create' | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddAliasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedEssence || !newAlias.trim()) return;
    
    onAddAlias(matchedEssence.id, newAlias.trim());
    setSuccessMsg(`Apelido "${newAlias.trim()}" adicionado com sucesso!`);
    setNewAlias('');
    setIsAddingAlias(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEssenceId || !searchTerm.trim()) return;
    
    onAddAlias(selectedEssenceId, searchTerm.trim());
    const matched = essences.find(esc => esc.id === selectedEssenceId);
    setSuccessMsg(`"${searchTerm}" agora é sinônimo de "${matched?.canonicalName}"!`);
    setSelectedEssenceId('');
    setActiveTab(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCanonicalName.trim() || !searchTerm.trim()) return;
    
    onAddNewEssence(newCanonicalName.trim(), newCategory, searchTerm.trim());
    setSuccessMsg(`Nova essência "${newCanonicalName.trim()}" cadastrada com sucesso!`);
    setNewCanonicalName('');
    setActiveTab(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (!searchTerm) return null;

  const isFav = matchedEssence ? favorites.includes(matchedEssence.id) : false;

  return (
    <div id="alias-section-container" className="w-full max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {successMsg && (
        <div id="alias-success-alert" className="mb-4 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {matchedEssence ? (
        /* State 1: Fragrance is recognized */
        <div className="bg-gradient-to-r from-[#121212] via-[#121212] to-gold-950/20 border border-[#d4af37]/20 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs bg-[#d4af37]/10 text-[#d4af37] px-2.5 py-0.5 rounded border border-[#d4af37]/20 uppercase tracking-wider font-mono font-bold">
                  Fragrância Catalogada
                </span>
                {matchedEssence.brandHouse && (
                  <span className="text-xs text-coal-400 font-serif italic">
                    Grife: {matchedEssence.brandHouse}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-serif text-white font-medium tracking-tight flex items-center gap-2">
                {matchedEssence.canonicalName}
                <button
                  type="button"
                  onClick={() => toggleFavorite(matchedEssence.id)}
                  className="p-1.5 rounded-full hover:bg-coal-800 text-coal-400 hover:text-gold-500 transition-colors"
                  title={isFav ? "Remover dos favoritos" : "Salvar nos favoritos"}
                >
                  <Star className={`w-5 h-5 ${isFav ? 'fill-gold-500 text-gold-500' : 'text-coal-400'}`} />
                </button>
              </h2>
              
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-coal-400">Sinônimos ativos:</span>
                {matchedEssence.synonyms.map((syn, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-coal-950 text-coal-200 border border-coal-800 px-2 py-1 rounded"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>

            {/* Inline add alias trigger */}
            <div className="shrink-0">
              {!isAddingAlias ? (
                <button
                  type="button"
                  onClick={() => setIsAddingAlias(true)}
                  className="flex items-center gap-1.5 text-xs bg-coal-850 hover:bg-coal-800 border border-[#d4af37]/30 hover:border-[#d4af37] text-gold-400 hover:text-gold-300 px-3.5 py-2 rounded transition-all font-serif"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Mapear novo apelido
                </button>
              ) : (
                <form onSubmit={handleAddAliasSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ex: BC Black"
                    className="bg-coal-950 border border-[#d4af37]/40 focus:border-[#d4af37] focus:outline-none rounded text-xs px-3 py-2 text-white placeholder-coal-500 w-44"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] text-xs font-bold px-3 py-2 rounded transition-colors uppercase tracking-wider"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingAlias(false);
                      setNewAlias('');
                    }}
                    className="text-xs text-coal-400 hover:text-white px-2"
                  >
                    Cancelar
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* State 2: Fragrance NOT recognized */
        <div className="bg-[#121212] border border-[#d4af37]/20 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-coal-800 pb-5 mb-5">
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-serif font-medium text-lg leading-tight">
                  Variação não mapeada: "{searchTerm}"
                </h3>
                <p className="text-xs text-coal-400 mt-1">
                  A pesquisa foi realizada normalmente nas lojas usando o termo bruto. Mas você pode ensinar o site para as próximas buscas!
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'link' ? null : 'link')}
                className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded transition-all border ${
                  activeTab === 'link' 
                    ? 'bg-[#d4af37] border-[#d4af37] text-[#0a0a0a] font-bold uppercase tracking-wider' 
                    : 'bg-coal-850 hover:bg-coal-800 border-coal-700 text-coal-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Vincular à essência existente
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'create' ? null : 'create')}
                className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded transition-all border ${
                  activeTab === 'create' 
                    ? 'bg-[#d4af37] border-[#d4af37] text-[#0a0a0a] font-bold uppercase tracking-wider' 
                    : 'bg-coal-850 hover:bg-coal-800 border-coal-700 text-coal-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Cadastrar nova
              </button>
            </div>
          </div>

          {/* Form: Link with existing */}
          {activeTab === 'link' && (
            <form onSubmit={handleLinkSubmit} className="bg-coal-950 p-4 rounded border border-[#d4af37]/20 animate-in slide-in-from-top-2 duration-200">
              <p className="text-xs text-gold-500 font-medium mb-3">
                Vincular "{searchTerm}" a uma fragrância do nosso dicionário:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  required
                  className="bg-[#121212] text-white border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none rounded text-sm px-3 py-2 flex-1"
                  value={selectedEssenceId}
                  onChange={(e) => setSelectedEssenceId(e.target.value)}
                >
                  <option value="">Selecione a essência correspondente...</option>
                  {essences
                    .map(esc => (
                      <option key={esc.id} value={esc.id}>
                        {esc.canonicalName} {esc.brandHouse ? `(${esc.brandHouse})` : ''}
                      </option>
                    ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] font-bold uppercase tracking-wider px-4 py-2 rounded text-xs transition-colors"
                  >
                    Vincular
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(null);
                      setSelectedEssenceId('');
                    }}
                    className="text-xs text-coal-400 hover:text-white px-2"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Form: Create new essence */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateSubmit} className="bg-coal-950 p-4 rounded border border-[#d4af37]/20 animate-in slide-in-from-top-2 duration-200">
              <p className="text-xs text-[#d4af37] font-medium mb-3 font-serif">
                Cadastrar "{searchTerm}" como uma nova fragrância de referência:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] text-coal-400 uppercase tracking-wider mb-1 font-mono">
                    Nome de referência (Canônico)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bleu de Chanel, Sauvage, Aventus"
                    className="w-full bg-[#121212] text-white border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none rounded text-xs px-3 py-2"
                    value={newCanonicalName}
                    onChange={(e) => setNewCanonicalName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-coal-400 uppercase tracking-wider mb-1 font-mono">
                    Família/Categoria olfativa
                  </label>
                  <select
                    className="w-full bg-[#121212] text-white border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none rounded text-xs px-3 py-2"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="compartilhada">Compartilhada (Unissex)</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] font-bold uppercase tracking-wider px-4 py-2 rounded text-xs transition-colors"
                >
                  Salvar Nova Essência
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(null);
                    setNewCanonicalName('');
                  }}
                  className="text-xs text-coal-400 hover:text-white px-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
