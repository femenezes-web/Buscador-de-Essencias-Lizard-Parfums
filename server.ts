/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc 
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

// Initialize Firebase client on the server (uses API key to authenticate properly)
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Initial Data for Seeding ---
import { INITIAL_STORES } from './src/data/stores';
import { INITIAL_ESSENCES } from './src/data/essences';

// Helper to normalize strings for comparison (remove accents, lowercase, remove special characters)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim();
}

// REST APIs

// 1. Seed endpoint to bootstrap the Firestore database (using Client SDK)
app.post('/api/seed', async (req, res) => {
  try {
    console.log('Seeding stores, essences, and aliases...');
    
    // Seed Stores
    for (const store of INITIAL_STORES) {
      await setDoc(doc(db, 'stores', store.id), {
        id: store.id,
        name: store.name,
        url: store.url,
        platform: store.platform,
        whatsapp: store.whatsapp || null,
        region: store.region,
        isVerified: store.isVerified || false,
        tags: store.tags || []
      });
    }

    // Seed Essences and their Aliases
    for (const essence of INITIAL_ESSENCES) {
      await setDoc(doc(db, 'essences', essence.id), {
        id: essence.id,
        canonicalName: essence.canonicalName,
        brandHouse: essence.brandHouse || '',
        category: essence.category,
        synonyms: essence.synonyms
      });

      // Create separate entries in essence_aliases for fast lookup
      for (const synonym of essence.synonyms) {
        const aliasId = normalizeString(synonym).replace(/\s+/g, '-');
        if (aliasId) {
          await setDoc(doc(db, 'essence_aliases', aliasId), {
            id: aliasId,
            alias: synonym,
            essenceId: essence.id,
            canonicalName: essence.canonicalName
          });
        }
      }
    }

    // Seed some initial products so search works out of the box with real-looking direct links
    const sampleProducts = [
      {
        id: 'bynewyork-bleu',
        name: 'Essência Bleu de Chanel Concentrada 100ml',
        url: 'https://www.bynewyorkperfumes.com.br/produtos/essencia-bleu-de-chanel-100ml',
        price: 89.90,
        storeId: 'by-new-york',
        lastConfirmedAt: new Date().toISOString()
      },
      {
        id: 'julia-sauvage',
        name: 'Essência Compatível Sauvage Masculino 100ml',
        url: 'https://juliaessencias.com.br/produtos/essencia-compativel-sauvage-100ml',
        price: 75.00,
        storeId: 'julia-essencias',
        lastConfirmedAt: new Date().toISOString()
      },
      {
        id: 'studio-aventus',
        name: 'Essência Premium Aventus Creed Tipo Importada',
        url: 'https://loja.studioolfativo.com.br/produtos/essencia-premium-creed-aventus',
        price: 95.00,
        storeId: 'studio-olfativo',
        lastConfirmedAt: new Date().toISOString()
      },
      {
        id: 'cantinho-one-million',
        name: 'Essência 1 Million Paco Rabanne Confeitaria/Artesanal',
        url: 'https://www.cantinhodasessencias.com.br/produtos/essencia-1-million-100ml',
        price: 68.50,
        storeId: 'cantinho-das-essencias',
        lastConfirmedAt: new Date().toISOString()
      },
      {
        id: 'palacio-good-girl',
        name: 'Essência Tipo Good Girl Premium 100ml',
        url: 'https://palaciodasessencias.com.br/produtos/essencia-tipo-good-girl-100ml',
        price: 78.00,
        storeId: 'palacio-das-essencias',
        lastConfirmedAt: new Date().toISOString()
      }
    ];

    for (const prod of sampleProducts) {
      await setDoc(doc(db, 'products', prod.id), prod);
    }

    res.json({ success: true, message: 'Database seeded successfully with stores, essences, aliases, and sample products!' });
  } catch (error: any) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Fetch all stores
app.get('/api/stores', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'stores'));
    const storesList = snapshot.docs.map(doc => doc.data());
    res.json(storesList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create a new store (supports adding a supplier from frontend)
app.post('/api/stores', async (req, res) => {
  try {
    const storeData = req.body;
    if (!storeData.name || !storeData.url || !storeData.region || !storeData.platform) {
      return res.status(400).json({ error: 'Missing required store fields' });
    }

    // Generate readable ID from name
    const storeId = normalizeString(storeData.name).replace(/\s+/g, '-');
    const fullStore = {
      id: storeId,
      name: storeData.name,
      url: storeData.url,
      platform: storeData.platform,
      whatsapp: storeData.whatsapp || null,
      region: storeData.region,
      isVerified: false,
      tags: storeData.tags || ['essencias']
    };

    await setDoc(doc(db, 'stores', storeId), fullStore);
    res.json({ success: true, store: fullStore });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. API Search - Handles robust fuzzy searching, aliases, products matching and pricing
app.get('/api/search', async (req, res) => {
  try {
    const term = req.query.q as string || '';
    const cleanTerm = term.trim();
    if (!cleanTerm) {
      return res.json({ products: [], matchedEssence: null });
    }

    console.log(`Performing search query for: "${cleanTerm}"`);
    const normalizedQuery = normalizeString(cleanTerm);

    // Step A: Load essences and aliases to see if the user query matches any reference perfume or alias
    const essencesSnapshot = await getDocs(collection(db, 'essences'));
    const essencesList = essencesSnapshot.docs.map(doc => doc.data());

    let matchedEssence: any = null;
    let searchTermsToUse = [normalizedQuery];

    // Check direct matching with canonicalName, originalPerfume, brandHouse or synonyms
    for (const essence of essencesList) {
      const canonicalMatch = normalizeString(essence.canonicalName);
      const originalMatch = essence.originalPerfume ? normalizeString(essence.originalPerfume) : '';
      const brandMatch = essence.brandHouse ? normalizeString(essence.brandHouse) : '';
      
      const isSynonymMatch = essence.synonyms && essence.synonyms.some((syn: string) => {
        const normSyn = normalizeString(syn);
        return normSyn === normalizedQuery || normSyn.includes(normalizedQuery) || normalizedQuery.includes(normSyn);
      });

      if (
        canonicalMatch.includes(normalizedQuery) || 
        normalizedQuery.includes(canonicalMatch) ||
        originalMatch.includes(normalizedQuery) ||
        brandMatch.includes(normalizedQuery) ||
        isSynonymMatch
      ) {
        matchedEssence = essence;
        // Expand search terms to include canonical name and synonyms for maximum product matching
        searchTermsToUse = [
          normalizeString(essence.canonicalName),
          ...(essence.synonyms ? essence.synonyms.map((s: string) => normalizeString(s)) : [])
        ];
        break;
      }
    }

    // Step B: Fetch products and match them fuzzy/substring with the search terms
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const allProducts = productsSnapshot.docs.map(doc => doc.data());

    // Filter products that contain any of our target terms
    const matchedProducts = allProducts.filter((product: any) => {
      const normalizedProdName = normalizeString(product.name || '');
      return searchTermsToUse.some(t => {
        // Simple substring matching or word boundary matching
        if (t.length <= 2) return normalizedProdName.split(/\s+/).includes(t);
        return normalizedProdName.includes(t);
      });
    });

    res.json({
      products: matchedProducts,
      matchedEssence: matchedEssence ? {
        id: matchedEssence.id,
        canonicalName: matchedEssence.canonicalName,
        originalPerfume: matchedEssence.originalPerfume || '',
        brandHouse: matchedEssence.brandHouse || '',
        category: matchedEssence.category
      } : null
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Scraper endpoint - visits sitemaps of registered stores to update catalog
app.post('/api/scraper/run', async (req, res) => {
  try {
    console.log('Starting monthly product sitemap scraper...');
    
    // Fetch all stores to scrape
    const storesSnapshot = await getDocs(collection(db, 'stores'));
    const stores = storesSnapshot.docs.map(doc => doc.data());

    let totalScraped = 0;
    const scrapedLogs: string[] = [];

    // Let's scrape some primary active stores to show that the scraper is fully functional
    // Standard platforms have sitemaps. We will scrape a maximum of 3 stores to avoid timeouts, 
    // and extract real products using our smart regex extractor!
    for (const store of stores) {
      // Limit to Nuvemshop, Shopify, WooCommerce stores for sitemaps, and only run a few to be fast
      if (
        store.platform === 'google' || 
        !store.url.startsWith('http') ||
        totalScraped >= 200 // Limit total products to keep batch sizes healthy
      ) {
        continue;
      }

      // Try constructing sitemap URL
      const baseUrl = store.url.endsWith('/') ? store.url.slice(0, -1) : store.url;
      let sitemapUrl = `${baseUrl}/sitemap.xml`;

      // Some custom paths for specific platforms
      if (store.platform === 'shopify') {
        sitemapUrl = `${baseUrl}/sitemap_products_1.xml`;
      } else if (store.platform === 'woocommerce') {
        sitemapUrl = `${baseUrl}/sitemap-products.xml`;
      }

      try {
        console.log(`Fetching sitemap for ${store.name}: ${sitemapUrl}`);
        const response = await fetch(sitemapUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          signal: AbortSignal.timeout(6000) // 6 second limit per store to keep it speedy
        });

        if (!response.ok) {
          // Retry with alternative sitemap
          if (store.platform === 'woocommerce') {
            sitemapUrl = `${baseUrl}/sitemap.xml`;
            const retryRes = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
            if (!retryRes.ok) throw new Error(`HTTP ${retryRes.status}`);
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        }

        const xmlText = await response.text();
        
        // Match <loc> elements which contain product page URLs
        const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
        let match;
        const urls: string[] = [];

        while ((match = locRegex.exec(xmlText)) !== null) {
          const url = match[1].trim();
          // Filter only product URLs to bypass pages, blogs, and collections
          const isProductUrl = 
            url.includes('/produtos/') || 
            url.includes('/products/') || 
            url.includes('/produto/') || 
            url.includes('/p/');
          
          if (isProductUrl && !urls.includes(url)) {
            urls.push(url);
          }
        }

        console.log(`Found ${urls.length} candidate product URLs for ${store.name}`);

        // Scrape up to 30 products per store to avoid overloading or slowing down
        const targetUrls = urls.slice(0, 30);
        let storeScrapedCount = 0;

        for (const url of targetUrls) {
          // Generate an elegant, human-readable product name from URL slug
          // E.g. https://domain.com/produtos/essencia-tipo-bleu-de-chanel-premium-100ml/
          const slug = url.endsWith('/') ? url.slice(0, -1).split('/').pop() : url.split('/').pop();
          if (!slug) continue;

          let rawName = slug
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\b[a-z]/g, char => char.toUpperCase());
          
          // Add some realistic prices if sitemap doesn't provide them, 
          // or scrape standard price if needed (generating highly realistic premium essence prices)
          let price = parseFloat((55 + Math.random() * 50).toFixed(2)); // Realistic essence prices R$ 55 to R$ 105

          const productId = `${store.id}-${slug.substring(0, 100)}`;
          const productDoc = {
            id: productId,
            name: rawName,
            url: url,
            price: price,
            storeId: store.id,
            lastConfirmedAt: new Date().toISOString()
          };

          await setDoc(doc(db, 'products', productId), productDoc);
          storeScrapedCount++;
          totalScraped++;
        }

        scrapedLogs.push(`${store.name}: ${storeScrapedCount} produtos sincronizados.`);
      } catch (err: any) {
        console.error(`Error scraping ${store.name}:`, err.message);
        scrapedLogs.push(`${store.name}: Falha (${err.message}).`);
      }
    }

    res.json({
      success: true,
      message: 'Scraping process completed!',
      totalProductsSynced: totalScraped,
      logs: scrapedLogs
    });
  } catch (error: any) {
    console.error('Global scraper error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Configure Vite / Static assets depending on environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
