/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Star } from 'lucide-react';
import { Essence } from '../types';
import { normalizeText } from '../utils/search';

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearch: (term: string) => void;
  essences: Essence[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function SearchBox({
  searchTerm,
  setSearchTerm,
  onSearch,
  essences,
  favorites,
  toggleFavorite
}: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<{ label: string; essence: Essence; isSynonym: boolean }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate suggestions based on text input
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const normQuery = normalizeText(searchTerm, true);
    if (!normQuery) {
      setSuggestions([]);
      return;
    }

    const matches: { label: string; essence: Essence; isSynonym: boolean }[] = [];
    const seenLabels = new Set<string>();

    for (const essence of essences) {
      // Check canonical
      const normCanonical = normalizeText(essence.canonicalName, true);
      const cleanCanonical = essence.canonicalName;
      
      if (normCanonical.includes(normQuery)) {
        if (!seenLabels.has(cleanCanonical.toLowerCase())) {
          matches.push({ label: cleanCanonical, essence, isSynonym: false });
          seenLabels.add(cleanCanonical.toLowerCase());
        }
      }

      // Check synonyms
      for (const syn of essence.synonyms) {
        const normSyn = normalizeText(syn, true);
        if (normSyn.includes(normQuery)) {
          const label = `${syn} (Insp: ${essence.canonicalName})`;
          if (!seenLabels.has(syn.toLowerCase())) {
            matches.push({ label, essence, isSynonym: true });
            seenLabels.add(syn.toLowerCase());
          }
        }
      }
    }

    // Sort: exact starts-with matches first, then contains matches
    matches.sort((a, b) => {
      const aNorm = normalizeText(a.label, true);
      const bNorm = normalizeText(b.label, true);
      const aStarts = aNorm.startsWith(normQuery);
      const bStarts = bNorm.startsWith(normQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.label.localeCompare(b.label);
    });

    setSuggestions(matches.slice(0, 6));
  }, [searchTerm, essences]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const selected = suggestions[activeIndex];
        const searchVal = selected.isSynonym 
          ? selected.label.split(' (Insp:')[0].trim() 
          : selected.essence.canonicalName;
        setSearchTerm(searchVal);
        onSearch(searchVal);
        setIsOpen(false);
      } else {
        onSearch(searchTerm);
        setIsOpen(false);
      }
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (label: string) => {
    // strip the "(Insp: ...)" text if present
    const cleanLabel = label.includes(' (Insp:') ? label.split(' (Insp:')[0].trim() : label;
    setSearchTerm(cleanLabel);
    onSearch(cleanLabel);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div id="search-box-container" ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      <div 
        className="flex items-center bg-[#121212] border-2 border-[#d4af37]/40 focus-within:border-[#d4af37] rounded-full py-4 px-6 md:px-8 shadow-[0_0_20px_rgba(212,175,55,0.10)] focus-within:shadow-[0_0_25px_rgba(212,175,55,0.22)] transition-all duration-300"
      >
        <Search className="w-5 h-5 text-[#d4af37] mr-4 shrink-0 animate-pulse" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Busque por essência (ex: Bleu de Chanel, Sauvage, 221...)"
          className="w-full bg-transparent border-none text-white placeholder-coal-400 focus:outline-none text-lg"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-coal-800 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-coal-400 hover:text-gold-400" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          id="search-suggestions-dropdown" 
          className="absolute left-0 right-0 mt-2 bg-coal-900/95 backdrop-blur-md border border-gold-800/40 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="py-2 border-b border-gold-800/10 px-4 text-xs font-serif text-gold-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Sugestões de Essências Encontradas
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {suggestions.map((item, index) => {
              const isFav = favorites.includes(item.essence.id);
              const cleanSyn = item.isSynonym ? item.label.split(' (Insp:')[0].trim() : item.essence.canonicalName;
              return (
                <li
                  key={`${item.essence.id}-${index}`}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200 ${
                    index === activeIndex ? 'bg-gold-950/40 text-gold-300 font-medium border-l-2 border-gold-500' : 'hover:bg-coal-800/80 text-coal-200'
                  }`}
                  onClick={() => handleSelectSuggestion(item.label)}
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-gold-600 shrink-0" />
                    <span className="truncate text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.essence.brandHouse && (
                      <span className="text-[10px] bg-coal-800 text-gold-400 px-2 py-0.5 rounded border border-gold-800/10 font-serif uppercase tracking-wider">
                        {item.essence.brandHouse}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.essence.id);
                      }}
                      className="p-1 rounded-full hover:bg-coal-800 text-coal-400 hover:text-gold-500 transition-all"
                    >
                      <Star 
                        className={`w-4 h-4 ${isFav ? 'fill-gold-500 text-gold-500' : 'text-coal-400'}`} 
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
