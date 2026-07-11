/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  SlidersHorizontal, 
  Search, 
  Trash2, 
  Star, 
  Info, 
  ExternalLink, 
  ChevronDown, 
  Filter, 
  ListFilter,
  CheckSquare,
  Square,
  RotateCcw,
  Database,
  RefreshCw
} from 'lucide-react';

import { ECommercePlatform, StoreRegion, Store, Essence, SearchHistoryItem, Product } from './types';
import { INITIAL_STORES } from './data/stores';
import { INITIAL_ESSENCES } from './data/essences';
import { findBestEssenceMatch } from './utils/search';

import SearchBox from './components/SearchBox';
import StoreCard from './components/StoreCard';
import ProductCard from './components/ProductCard';
import AliasSection from './components/AliasSection';
import AddStoreModal from './components/AddStoreModal';
import RecentSearches from './components/RecentSearches';

export default function App() {
  // --- Persistent States from LocalStorage ---
  const [essences, setEssences] = useState<Essence[]>(() => {
    const saved = localStorage.getItem('aurum_custom_essences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading custom essences:", e);
      }
    }
    return INITIAL_ESSENCES;
  });

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('aurum_custom_stores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Combine initial stores with custom ones to avoid losing updates
        const customIds = new Set(parsed.map((s: any) => s.id));
        const filteredInitials = INITIAL_STORES.filter(s => !customIds.has(s.id));
        return [...filteredInitials, ...parsed];
      } catch (e) {
        console.error("Error reading custom stores:", e);
      }
    }
    return INITIAL_STORES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('aurum_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('aurum_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Firestore Connected States ---
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [searchMatchedEssence, setSearchMatchedEssence] = useState<any | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState<string | null>(null);

  // --- Active Search and Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  
  // Store Selection Filter (list of IDs that are checked)
  // If empty, it means "all"
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [storeSearchFilter, setStoreSearchFilter] = useState('');
  const [activePreset, setActivePreset] = useState<'all' | 'grandes' | 'sp' | 'mg' | 'embalagens'>('all');

  // --- Load live stores from database ---
  useEffect(() => {
    const loadStores = async () => {
      try {
        const res = await fetch('/api/stores');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setStores(data);
          }
        }
      } catch (err) {
        console.error("Failed to load stores from DB:", err);
      }
    };
    loadStores();
  }, []);

  // --- Sync storage changes ---
  useEffect(() => {
    localStorage.setItem('aurum_custom_essences', JSON.stringify(essences));
  }, [essences]);

  useEffect(() => {
    localStorage.setItem('aurum_custom_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('aurum_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('aurum_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // --- Search Committed handler ---
  const handleSearch = async (term: string) => {
    const cleanTerm = term.trim();
    setActiveSearch(cleanTerm);
    
    if (cleanTerm) {
      // Add to search history
      setSearchHistory(prev => {
        const filtered = prev.filter(h => h.term.toLowerCase() !== cleanTerm.toLowerCase());
        const newItem: SearchHistoryItem = {
          id: `hist-${Date.now()}`,
          term: cleanTerm,
          timestamp: Date.now()
        };
        return [newItem, ...filtered].slice(0, 10); // keep last 10
      });

      // Fetch matching products and canonical essence from Firestore search API
      setIsSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(cleanTerm)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchProducts(data.products || []);
          setSearchMatchedEssence(data.matchedEssence || null);
        }
      } catch (err) {
        console.error("Error searching in Firestore:", err);
      } finally {
        setIsSearchLoading(false);
      }
    } else {
      setSearchProducts([]);
      setSearchMatchedEssence(null);
    }
  };

  // --- Favorites handler ---
  const toggleFavorite = (essenceId: string) => {
    setFavorites(prev => {
      if (prev.includes(essenceId)) {
        return prev.filter(id => id !== essenceId);
      } else {
        return [...prev, essenceId];
      }
    });
  };

  // --- Adding a new alias to an essence ---
  const handleAddAlias = (essenceId: string, newAlias: string) => {
    setEssences(prev => prev.map(ess => {
      if (ess.id === essenceId) {
        // Avoid duplicates
        if (ess.synonyms.some(s => s.toLowerCase() === newAlias.toLowerCase())) {
          return ess;
        }
        return {
          ...ess,
          synonyms: [...ess.synonyms, newAlias]
        };
      }
      return ess;
    }));
  };

  // --- Creating a completely new canonical essence ---
  const handleAddNewEssence = (
    canonicalName: string, 
    category: 'masculino' | 'feminino' | 'compartilhada' | 'outros',
    initialAlias: string
  ) => {
    const newId = `ess-${Date.now()}`;
    const newEssence: Essence = {
      id: newId,
      canonicalName,
      synonyms: [canonicalName, initialAlias],
      category
    };
    setEssences(prev => [...prev, newEssence]);
    // Set this newly created canonical essence as the active matched term
    setSearchTerm(canonicalName);
    handleSearch(canonicalName);
  };

  // --- Adding a manually suggested store ---
  const handleAddStore = async (newStoreData: Omit<Store, 'id' | 'isVerified'>) => {
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStoreData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.store) {
          setStores(prev => [data.store, ...prev]);
        }
      } else {
        // Fallback local addition if API is unavailable
        const newStore: Store = {
          ...newStoreData,
          id: `store-${Date.now()}`,
          isVerified: false
        };
        setStores(prev => [newStore, ...prev]);
      }
    } catch (err) {
      console.error("Error saving suggested store:", err);
      const newStore: Store = {
        ...newStoreData,
        id: `store-${Date.now()}`,
        isVerified: false
      };
      setStores(prev => [newStore, ...prev]);
    }
  };

  // --- Run scraper endpoint ---
  const handleRunScraper = async () => {
    setIsScraping(true);
    setScrapingStatus("Sincronizando lojas via XML sitemaps...");
    try {
      const res = await fetch('/api/scraper/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setScrapingStatus(`Sucesso! Sincronizados ${data.totalProductsSynced || 0} produtos no banco!`);
        if (activeSearch) {
          // Re-search to load the newly scraped products
          handleSearch(activeSearch);
        }
      } else {
        setScrapingStatus("Erro na sincronização automática.");
      }
    } catch (err) {
      console.error(err);
      setScrapingStatus("Erro de conexão.");
    } finally {
      setIsScraping(false);
      setTimeout(() => setScrapingStatus(null), 4000);
    }
  };

  // --- Matching algorithm ---
  const matchedResult = useMemo(() => {
    return findBestEssenceMatch(activeSearch, essences);
  }, [activeSearch, essences]);

  // --- Filter and Preset application ---
  const handleApplyPreset = (preset: 'all' | 'grandes' | 'sp' | 'mg' | 'embalagens') => {
    setActivePreset(preset);
    
    if (preset === 'all') {
      setSelectedStoreIds([]); // empty means all
      return;
    }

    let filtered: Store[] = [];
    if (preset === 'grandes') {
      filtered = stores.filter(s => s.tags.includes('grandes_fornecedores'));
    } else if (preset === 'sp') {
      filtered = stores.filter(s => s.region === StoreRegion.SP);
    } else if (preset === 'mg') {
      filtered = stores.filter(s => s.region === StoreRegion.MG);
    } else if (preset === 'embalagens') {
      filtered = stores.filter(s => s.tags.includes('embalagens') || s.tags.includes('vidros'));
    }

    setSelectedStoreIds(filtered.map(s => s.id));
  };

  const handleToggleStoreCheckbox = (storeId: string) => {
    setActivePreset('all'); // Clear preset if manual editing starts
    setSelectedStoreIds(prev => {
      // If we are currently in "select all" state (selectedStoreIds is empty)
      if (prev.length === 0) {
        // Check everything except the clicked one
        return stores.filter(s => s.id !== storeId).map(s => s.id);
      }
      
      if (prev.includes(storeId)) {
        const next = prev.filter(id => id !== storeId);
        // If all are unchecked, that's equivalent to all checked
        return next;
      } else {
        return [...prev, storeId];
      }
    });
  };

  const handleSelectAllStores = () => {
    setSelectedStoreIds([]);
    setActivePreset('all');
  };

  const handleClearStoreSelection = () => {
    // Unchecking everything means selecting just the first one so it's not empty, 
    // or set state to a dummy value. Let's make it check only the first store to avoid displaying 0 results.
    if (stores.length > 0) {
      setSelectedStoreIds([stores[0].id]);
    }
    setActivePreset('all');
  };

  // --- Filtered Stores to display ---
  const displayedStores = useMemo(() => {
    let result = [...stores];

    // Filter by manual search within the checklist
    const query = storeSearchFilter.trim().toLowerCase();
    
    // Sort alphabetized
    result.sort((a, b) => a.name.localeCompare(b.name));

    // If specific stores are selected, narrow it down
    if (selectedStoreIds.length > 0) {
      result = result.filter(s => selectedStoreIds.includes(s.id));
    }

    return result;
  }, [stores, selectedStoreIds]);

  // List of stores for the sidebar filter (always shows all stores, filtered only by typing in the search filter)
  const sidebarChecklistStores = useMemo(() => {
    let list = [...stores];
    const query = storeSearchFilter.trim().toLowerCase();
    if (query) {
      list = list.filter(s => s.name.toLowerCase().includes(query) || s.url.toLowerCase().includes(query));
    }
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [stores, storeSearchFilter]);

  // Famous inspiration quick links for the home view
  const quickSearchSuggestions = [
    { name: 'Bleu de Chanel', sub: 'Elegante e Amadeirado' },
    { name: 'Sauvage (Dior)', sub: 'Fresco e Especiado' },
    { name: 'Good Girl', sub: 'Floral Adocicado' },
    { name: 'La Vie Est Belle', sub: 'Feminino Marcante' },
    { name: 'One Million', sub: 'Masculino Intenso' },
    { name: 'Invictus', sub: 'Refrescante e Esportivo' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-coal-100 flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* HEADER BAR */}
      <header className="border-b border-[#d4af37]/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded border border-[#d4af37]/30 bg-coal-950 flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-xl text-[#d4af37] tracking-tighter">L</span>
            </div>
            <div>
              <h1 className="font-serif font-semibold text-lg md:text-xl text-white tracking-tight flex items-center gap-1">
                Buscador Lizard <span className="text-[#d4af37] font-light">Parfums</span>
              </h1>
              <p className="text-[10px] text-coal-400 tracking-wider uppercase font-mono hidden sm:block">Busca Central de Insumos</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {scrapingStatus && (
              <span className="text-[10px] text-gold-400 font-mono bg-coal-950/90 px-3 py-1.5 rounded border border-[#d4af37]/20 animate-pulse hidden md:inline-block">
                {scrapingStatus}
              </span>
            )}
            
            <button
              id="sync-catalog-header"
              type="button"
              disabled={isScraping}
              onClick={handleRunScraper}
              className={`flex items-center gap-1.5 text-[11px] px-4 py-2 rounded transition-all duration-300 font-serif uppercase tracking-wider font-semibold border ${
                isScraping 
                  ? 'bg-coal-900 border-coal-800 text-coal-500 cursor-not-allowed'
                  : 'bg-coal-950 hover:bg-coal-900 border-[#d4af37]/30 hover:border-[#d4af37] text-gold-400 hover:text-[#d4af37]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isScraping ? 'animate-spin text-[#d4af37]' : ''}`} />
              {isScraping ? 'Sincronizando...' : 'Sincronizar Lojas'}
            </button>

            <button
              id="add-new-supplier-header"
              type="button"
              onClick={() => setIsAddStoreOpen(true)}
              className="flex items-center gap-1.5 text-[11px] bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] px-4 py-2 rounded transition-all duration-300 font-serif uppercase tracking-wider font-bold"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              Sugerir Loja
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {!activeSearch ? (
            
            /* ==================== LANDING/HOME VIEW ==================== */
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-8 md:py-16 text-center"
            >
              <div className="max-w-2xl mx-auto mb-10">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium tracking-tight mb-5 leading-[1.1]">
                  Compare dezenas de lojas <br />
                  <span className="text-[#d4af37]">
                    em uma única pesquisa
                  </span>
                </h2>
                <p className="text-coal-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                  Insira o nome de uma essência. Nós geramos os links de busca interna das melhores lojas de perfumaria artesanal simultaneamente. Evite abrir abas infinitas.
                </p>
              </div>

              {/* Central Large Search input */}
              <SearchBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
                essences={essences}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />

              {/* History and Favorites */}
              <RecentSearches
                history={searchHistory}
                favorites={favorites}
                essences={essences}
                onSelectTerm={(term) => {
                  setSearchTerm(term);
                  handleSearch(term);
                }}
                onClearHistory={() => setSearchHistory([])}
                onRemoveFavorite={toggleFavorite}
              />

              {/* Curated/Recommended Suggestions */}
              <div className="w-full max-w-4xl mt-8 border-t border-[#d4af37]/15 pt-10">
                <h3 className="font-serif text-xs text-[#d4af37] uppercase tracking-widest mb-6 font-semibold">
                  Inspirações de Perfumaria Fina mais Buscadas
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {quickSearchSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchTerm(sug.name);
                        handleSearch(sug.name);
                      }}
                      className="group bg-[#121212] border border-[#d4af37]/10 hover:border-[#d4af37] p-3.5 rounded text-center transition-all duration-300"
                    >
                      <p className="text-xs font-serif font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-200 truncate">
                        {sug.name}
                      </p>
                      <p className="text-[9px] text-coal-500 group-hover:text-coal-400 mt-0.5 truncate uppercase tracking-tight">
                        {sug.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanatory Features Bento */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 border-t border-[#d4af37]/15 pt-12 text-left">
                <div className="bg-[#121212] p-5 rounded border border-[#d4af37]/10">
                  <div className="h-8 w-8 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] rounded flex items-center justify-center mb-3">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-1">Mapeamento Inteligente</h4>
                  <p className="text-xs text-coal-400 leading-relaxed">
                    Pesquise por "Bleu" ou "221" e consulte todas as lojas, mesmo as que usam códigos ou apelidos diferentes para o perfume.
                  </p>
                </div>
                <div className="bg-[#121212] p-5 rounded border border-[#d4af37]/10">
                  <div className="h-8 w-8 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] rounded flex items-center justify-center mb-3">
                    <Info className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-1">Direcionamento Instantâneo</h4>
                  <p className="text-xs text-coal-400 leading-relaxed">
                    Sem scrapers instáveis ou cadastros de preço que expiram rápido. Você cai direto na página de busca oficial de cada loja.
                  </p>
                </div>
                <div className="bg-[#121212] p-5 rounded border border-[#d4af37]/10">
                  <div className="h-8 w-8 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] rounded flex items-center justify-center mb-3">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-1">Base Colaborativa</h4>
                  <p className="text-xs text-coal-400 leading-relaxed">
                    Adicione fornecedores regionais ou novos apelidos de fragrâncias diretamente da tela de busca. A base se adapta a você.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            
            /* ==================== RESULTS VIEW ==================== */
            <motion.div
              key="results-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Back to Home & Minimalist Top Search bar */}
              <div className="flex flex-col md:flex-row items-center gap-4 border-b border-[#d4af37]/15 pb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearch('');
                    setSearchTerm('');
                  }}
                  className="text-xs text-coal-400 hover:text-[#d4af37] flex items-center gap-1 transition-colors self-start md:self-auto shrink-0 py-2 font-serif font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Voltar para o início
                </button>
                <div className="w-full md:max-w-2xl">
                  <SearchBox
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={handleSearch}
                    essences={essences}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                </div>
              </div>

              {/* Synonym/Alias Helper Section */}
              <AliasSection
                searchTerm={activeSearch}
                matchedEssence={matchedResult?.essence || null}
                essences={essences}
                onAddAlias={handleAddAlias}
                onAddNewEssence={handleAddNewEssence}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />

              {/* BENTO LAYOUT: FILTERS (LEFT) + RESULTS GRID (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* 1. FILTER SIDEBAR PANEL */}
                <aside className="bg-[#121212] border border-[#d4af37]/20 rounded-lg p-5 lg:sticky lg:top-28 space-y-6">
                  
                  {/* Store presets (quick filters) */}
                  <div>
                    <h3 className="text-xs font-serif text-[#d4af37] uppercase tracking-widest mb-3 flex items-center gap-1.5 font-semibold">
                      <ListFilter className="w-3.5 h-3.5" /> Atalhos de Seleção
                    </h3>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('all')}
                        className={`text-xs text-left px-3 py-2 rounded border transition-all ${
                          activePreset === 'all' && selectedStoreIds.length === 0
                            ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37] font-bold font-serif'
                            : 'bg-coal-950 border-coal-800 text-coal-300 hover:border-coal-700 hover:text-white'
                        }`}
                      >
                        Todos Fornecedores ({stores.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('grandes')}
                        className={`text-xs text-left px-3 py-2 rounded border transition-all ${
                          activePreset === 'grandes'
                            ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37] font-bold font-serif'
                            : 'bg-coal-950 border-coal-800 text-coal-300 hover:border-coal-700 hover:text-white'
                        }`}
                      >
                        ★ Grandes Distribuidores
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('sp')}
                        className={`text-xs text-left px-3 py-2 rounded border transition-all ${
                          activePreset === 'sp'
                            ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37] font-bold font-serif'
                            : 'bg-coal-950 border-coal-800 text-coal-300 hover:border-coal-700 hover:text-white'
                        }`}
                      >
                        Lojas de São Paulo (SP)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('mg')}
                        className={`text-xs text-left px-3 py-2 rounded border transition-all ${
                          activePreset === 'mg'
                            ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37] font-bold font-serif'
                            : 'bg-coal-950 border-coal-800 text-coal-300 hover:border-coal-700 hover:text-white'
                        }`}
                      >
                        Lojas de Minas (MG)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('embalagens')}
                        className={`text-xs text-left px-3 py-2 rounded border transition-all ${
                          activePreset === 'embalagens'
                            ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37] font-bold font-serif'
                            : 'bg-coal-950 border-coal-800 text-coal-300 hover:border-coal-700 hover:text-white'
                        }`}
                      >
                        Vidros & Embalagens
                      </button>
                    </div>
                  </div>

                  {/* Manual checklist search and select */}
                  <div className="border-t border-coal-800 pt-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-xs font-serif text-[#d4af37] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" /> Lojas específicas
                      </h3>
                      {selectedStoreIds.length > 0 && (
                        <button
                          type="button"
                          onClick={handleSelectAllStores}
                          className="text-[10px] text-[#d4af37] hover:underline"
                        >
                          Limpar Filtro
                        </button>
                      )}
                    </div>
                    
                    {/* Tiny search inside stores checklist */}
                    <input
                      type="text"
                      placeholder="Filtrar lojas..."
                      className="w-full bg-coal-950 text-xs text-white border border-[#d4af37]/20 focus:border-[#d4af37] focus:outline-none rounded px-2.5 py-1.5 mb-3 placeholder-coal-600"
                      value={storeSearchFilter}
                      onChange={(e) => setStoreSearchFilter(e.target.value)}
                    />

                    {/* Stores Checklist */}
                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                      {sidebarChecklistStores.length === 0 ? (
                        <p className="text-[11px] text-coal-500 italic py-1">Nenhuma loja correspondente.</p>
                      ) : (
                        sidebarChecklistStores.map((store) => {
                          const isChecked = selectedStoreIds.length === 0 || selectedStoreIds.includes(store.id);
                          return (
                            <button
                              key={store.id}
                              type="button"
                              onClick={() => handleToggleStoreCheckbox(store.id)}
                              className="flex items-center gap-2 w-full text-left text-xs text-coal-300 hover:text-white py-1 cursor-pointer group transition-colors"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-coal-600 group-hover:text-[#d4af37]/50 shrink-0" />
                              )}
                              <span className="truncate flex-1">{store.name}</span>
                              {store.isVerified && (
                                <span className="text-[9px] text-[#d4af37] font-mono scale-90">★</span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-coal-850">
                      <button
                        type="button"
                        onClick={handleSelectAllStores}
                        className="text-[10px] bg-coal-950 text-coal-300 border border-coal-800 hover:border-[#d4af37]/30 px-2 py-1 rounded"
                      >
                        Todas
                      </button>
                      <button
                        type="button"
                        onClick={handleClearStoreSelection}
                        className="text-[10px] bg-coal-950 text-coal-300 border border-coal-800 hover:border-[#d4af37]/30 px-2 py-1 rounded"
                      >
                        Nenhuma
                      </button>
                    </div>
                  </div>

                  {/* Summary filter count info */}
                  <div className="bg-[#121212] p-3.5 rounded border border-[#d4af37]/10 text-center text-xs">
                    <p className="text-coal-400">
                      Exibindo <strong className="text-[#d4af37]">{displayedStores.length}</strong> de <strong className="text-white">{stores.length}</strong> fornecedores.
                    </p>
                  </div>

                </aside>

                {/* 2. MAIN GRID RESULTS PANEL */}
                <div className="lg:col-span-3 space-y-8">
                  
                  {/* DIRECT PRODUCTS FROM DATABASE SECTION */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
                      <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                        <Database className="w-5 h-5 text-[#d4af37] shrink-0" />
                        Produtos Encontrados na Base ({searchProducts.length})
                      </h3>
                      <span className="text-[10px] text-coal-400 uppercase tracking-widest bg-coal-950 px-2.5 py-1 rounded border border-coal-800">
                        Preços e Links Diretos
                      </span>
                    </div>

                    {isSearchLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="bg-[#121212] border border-[#d4af37]/5 rounded-lg p-5 animate-pulse space-y-4">
                            <div className="h-4 bg-coal-800 rounded w-1/3"></div>
                            <div className="h-6 bg-coal-800 rounded w-3/4"></div>
                            <div className="h-4 bg-coal-800 rounded w-1/2"></div>
                            <div className="pt-4 border-t border-coal-800/50 flex justify-between">
                              <div className="h-6 bg-coal-800 rounded w-1/4"></div>
                              <div className="h-6 bg-coal-800 rounded w-1/4"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchProducts.map((product) => {
                          const associatedStore = stores.find(s => s.id === product.storeId);
                          return (
                            <ProductCard 
                              key={product.id} 
                              product={product} 
                              store={associatedStore} 
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-[#121212]/40 border border-coal-800 p-6 rounded-lg text-center max-w-2xl mx-auto space-y-3">
                        <Info className="w-8 h-8 text-[#d4af37]/60 mx-auto" />
                        <h4 className="font-serif text-sm font-semibold text-white">Nenhum produto com link direto cadastrado para este termo ainda</h4>
                        <p className="text-xs text-coal-400">
                          Nossa base ainda não possui produtos indexados com preços exatos para "{activeSearch}". 
                          Porém, você pode usar nossa ferramenta inteligente abaixo para buscar diretamente nas lojas parceiras com apenas um clique!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* FALLBACK/LIVE SEARCH PARTNERS SECTION */}
                  <div className="space-y-4 pt-4 border-t border-coal-900">
                    <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-3">
                      <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-[#d4af37] shrink-0" />
                        Buscar Diretamente nos Parceiros ({displayedStores.length})
                      </h3>
                      <span className="text-xs text-coal-400 font-mono uppercase tracking-wider bg-[#121212] px-3 py-1 rounded border border-[#d4af37]/20">
                        Links de Busca On-demand
                      </span>
                    </div>

                    {displayedStores.length === 0 ? (
                      <div id="no-stores-matching-filter-view" className="text-center py-16 bg-[#121212] rounded border border-[#d4af37]/20 animate-in fade-in">
                        <Info className="w-12 h-12 text-[#d4af37]/80 mx-auto mb-3" />
                        <h4 className="font-serif text-lg text-white font-medium mb-1">Nenhuma loja selecionada</h4>
                        <p className="text-xs text-coal-400 max-w-xs mx-auto mb-4">
                          Ajuste os filtros na barra lateral ou clique no botão abaixo para restaurar todos os fornecedores.
                        </p>
                        <button
                          type="button"
                          onClick={handleSelectAllStores}
                          className="bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-all"
                        >
                          Restaurar todos os fornecedores
                        </button>
                      </div>
                    ) : (
                      /* Stores Grid */
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {displayedStores.map((store) => (
                          <StoreCard
                            key={store.id}
                            store={store}
                            searchTerm={activeSearch}
                            matchedSynonyms={matchedResult?.essence?.synonyms || []}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#d4af37]/10 bg-[#0a0a0a] py-8 text-center text-xs text-coal-400 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif">
            Buscador Lizard Parfums © 2026 — Plataforma colaborativa para acelerar a busca de insumos.
          </p>
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsAddStoreOpen(true)}
              className="hover:text-[#d4af37] underline transition-colors"
            >
              Adicionar Fornecedor
            </button>
            <span className="text-coal-800">|</span>
            <a 
              href="https://www.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#d4af37] transition-colors"
            >
              InsumoPerfumes
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL: ADD SUPPLIER FORM */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onAddStore={handleAddStore}
      />

    </div>
  );
}
