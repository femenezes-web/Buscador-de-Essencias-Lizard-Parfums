/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock, Star, Trash2 } from 'lucide-react';
import { Essence, SearchHistoryItem } from '../types';

interface RecentSearchesProps {
  history: SearchHistoryItem[];
  favorites: string[];
  essences: Essence[];
  onSelectTerm: (term: string) => void;
  onClearHistory: () => void;
  onRemoveFavorite: (id: string) => void;
}

export default function RecentSearches({
  history,
  favorites,
  essences,
  onSelectTerm,
  onClearHistory,
  onRemoveFavorite
}: RecentSearchesProps) {
  // Map favorite IDs to full essence objects
  const favoriteEssences = essences.filter(e => favorites.includes(e.id));

  return (
    <div id="recent-searches-container" className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      
      {/* Search History Card */}
      <div className="bg-[#121212] border border-[#d4af37]/20 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3.5 border-b border-coal-800 pb-2">
          <h4 className="font-serif text-sm text-[#d4af37] font-medium tracking-tight flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Buscas Recentes
          </h4>
          {history.length > 0 && (
            <button
              id="clear-history-btn"
              type="button"
              onClick={onClearHistory}
              className="text-[10px] text-coal-400 hover:text-red-400 flex items-center gap-1 hover:underline transition-all"
              title="Limpar histórico de buscas"
            >
              <Trash2 className="w-3 h-3" /> Limpar
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-coal-500 italic py-2">Nenhuma busca recente realizada ainda.</p>
        ) : (
          <div className="flex flex-wrap gap-2 py-1 max-h-24 overflow-y-auto">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTerm(item.term)}
                className="text-xs bg-coal-950 hover:bg-gold-950/20 text-coal-300 hover:text-[#d4af37] border border-[#d4af37]/10 hover:border-[#d4af37]/40 px-3 py-1.5 rounded transition-all duration-200 truncate max-w-[180px]"
              >
                {item.term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarks/Favorites Card */}
      <div className="bg-[#121212] border border-[#d4af37]/20 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3.5 border-b border-coal-800 pb-2">
          <h4 className="font-serif text-sm text-[#d4af37] font-medium tracking-tight flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" /> Essências Favoritas
          </h4>
        </div>

        {favoriteEssences.length === 0 ? (
          <p className="text-xs text-coal-500 italic py-2">
            Clique na estrela ao lado de uma essência para favoritá-la.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 py-1 max-h-24 overflow-y-auto">
            {favoriteEssences.map((essence) => (
              <div 
                key={essence.id}
                className="inline-flex items-center bg-gold-950/20 border border-[#d4af37]/30 rounded pl-3 pr-1 py-1 text-xs text-gold-300 gap-1 hover:border-[#d4af37]/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onSelectTerm(essence.canonicalName)}
                  className="hover:underline font-medium truncate max-w-[140px]"
                  title={`Pesquisar "${essence.canonicalName}"`}
                >
                  {essence.canonicalName}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFavorite(essence.id)}
                  className="p-1 hover:bg-coal-800 rounded text-gold-500 hover:text-red-400 transition-colors"
                  title="Remover dos favoritos"
                >
                  <Star className="w-3 h-3 fill-gold-500 text-gold-500 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
