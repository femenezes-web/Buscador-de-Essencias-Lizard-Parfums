/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink, MessageSquare, Check, Tag, ArrowUpRight } from 'lucide-react';
import { Store, ECommercePlatform } from '../types';
import { buildSearchUrl, cleanUrlDomain } from '../data/stores';

interface StoreCardProps {
  key?: string;
  store: Store;
  searchTerm: string;
  matchedSynonyms: string[];
}

export default function StoreCard({ store, searchTerm, matchedSynonyms }: StoreCardProps) {
  const defaultSearchUrl = buildSearchUrl(store, searchTerm);
  const domain = cleanUrlDomain(store.url);

  // Platform label translations
  const platformNames: Record<ECommercePlatform, string> = {
    [ECommercePlatform.NUVEMSHOP]: 'Nuvemshop',
    [ECommercePlatform.SHOPIFY]: 'Shopify',
    [ECommercePlatform.WOOCOMMERCE]: 'WooCommerce',
    [ECommercePlatform.LOJA_INTEGRADA]: 'Loja Integrada',
    [ECommercePlatform.TRAY]: 'Tray',
    [ECommercePlatform.OPENCART]: 'OpenCart',
    [ECommercePlatform.GOOGLE_FALLBACK]: 'Fallback (Google)'
  };

  // WhatsApp link generator with pre-filled message
  const getWhatsAppLink = () => {
    if (!store.whatsapp) return '';
    const message = encodeURIComponent(
      `Olá, tudo bem? Vi sua loja no Busca de Insumos de Perfumaria e gostaria de tirar uma dúvida sobre a essência "${searchTerm || 'insumos'}"!`
    );
    return `https://wa.me/${store.whatsapp}?text=${message}`;
  };

  return (
    <div 
      id={`store-card-${store.id}`}
      className="group relative bg-[#121212] border border-[#d4af37]/20 hover:border-[#d4af37] rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.08)]"
    >
      <div>
        {/* Header section with badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <a 
              href={store.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-gold-400 font-serif text-lg font-medium tracking-tight transition-colors duration-200"
              title="Visitar página inicial deste fornecedor"
            >
              {store.name}
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gold-500 shrink-0" />
            </a>
            <p className="text-xs text-coal-400 mt-0.5 truncate">{domain}</p>
          </div>
          
          <div className="flex flex-col items-end gap-1 shrink-0">
            {store.isVerified ? (
              <span className="flex items-center gap-1 text-[9px] bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded border border-[#d4af37]/20 font-bold uppercase tracking-tighter">
                Verificado
              </span>
            ) : (
              <span className="text-[9px] bg-coal-800 text-coal-400 px-2 py-0.5 rounded border border-coal-700/50 font-bold uppercase tracking-tighter">
                Comunidade
              </span>
            )}
          </div>
        </div>

        {/* Info Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] bg-coal-950 text-[#d4af37] px-2 py-0.5 rounded border border-gold-850 uppercase tracking-wider font-mono">
            {store.region}
          </span>
          <span className="text-[10px] bg-coal-950 text-coal-400 px-2 py-0.5 rounded border border-coal-800/40 uppercase tracking-wider font-mono">
            {platformNames[store.platform]}
          </span>
          {store.tags.includes('grandes_fornecedores') && (
            <span className="text-[10px] bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded border border-[#d4af37]/20 uppercase tracking-wider font-mono font-bold">
              ★ Grande Fornecedor
            </span>
          )}
        </div>

        {/* Synonyms shortcuts */}
        {searchTerm && matchedSynonyms.length > 0 && (
          <div className="mb-5 bg-coal-950/60 p-3 rounded-lg border border-gold-800/10">
            <p className="text-[10px] text-gold-500 font-serif mb-2 flex items-center gap-1 font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" /> Variações:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {/* Add typed term first */}
              <a
                href={buildSearchUrl(store, searchTerm)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-coal-800 hover:bg-gold-950 hover:text-gold-300 text-coal-200 px-2 py-1 rounded transition-colors duration-200 font-medium truncate max-w-[150px] border border-coal-700/50 hover:border-[#d4af37]/50"
                title={`Buscar "${searchTerm}"`}
              >
                "{searchTerm}"
              </a>
              {/* Show other matched synonyms */}
              {matchedSynonyms
                .filter(syn => syn.toLowerCase() !== searchTerm.toLowerCase())
                .slice(0, 4) // Show top 4
                .map((syn, idx) => (
                  <a
                    key={`${store.id}-syn-${idx}`}
                    href={buildSearchUrl(store, syn)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-coal-950 hover:bg-gold-950 hover:text-gold-300 text-coal-400 hover:text-gold-200 px-2 py-1 rounded transition-colors duration-200 truncate max-w-[150px] border border-coal-800/50 hover:border-gold-800/30"
                    title={`Buscar variação "${syn}"`}
                  >
                    {syn}
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <a
          href={defaultSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] font-serif font-bold py-2.5 px-4 rounded text-xs uppercase tracking-wider transition-all duration-300"
        >
          Ver resultados na loja
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>

        {store.whatsapp && (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-green-600/30 text-green-500 hover:bg-green-600/10 py-2 px-4 rounded text-xs transition-all duration-300 font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Oficial
          </a>
        )}
      </div>
    </div>
  );
}
