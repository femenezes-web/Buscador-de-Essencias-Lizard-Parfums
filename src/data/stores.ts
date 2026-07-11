/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Store, ECommercePlatform, StoreRegion } from '../types';

export const INITIAL_STORES: Store[] = [
  {
    id: 'by-new-york',
    name: 'By New York Perfumes',
    url: 'https://www.bynewyorkperfumes.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511982345671',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'julia-essencias',
    name: 'Julia Essências',
    url: 'https://juliaessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511976543210',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'studio-olfativo',
    name: 'Studio Olfativo',
    url: 'https://loja.studioolfativo.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511912345678',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'inter-essencias',
    name: 'Inter Essências',
    url: 'https://interessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511933334444',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'cantinho-das-essencias',
    name: 'Cantinho das Essências',
    url: 'https://www.cantinhodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5531988887777',
    region: StoreRegion.MG,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'adeptos-essencias',
    name: 'Adeptos Essências',
    url: 'https://www.instagram.com/adeptos_essencias/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5521999998888',
    region: StoreRegion.RJ,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'nova-essencia',
    name: 'Nova Essência',
    url: 'https://novaessencia.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.RJ,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'palacio-das-essencias',
    name: 'Palácio das Essências',
    url: 'https://palaciodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5531977775555',
    region: StoreRegion.MG,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'essencial-essencias',
    name: 'Essencial Essências',
    url: 'https://www.essencialessencias.com/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511944442222',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'arte-feita',
    name: 'Artefeita',
    url: 'https://www.artefeita.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.RS,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'atr-essencias',
    name: 'ATR Essências',
    url: 'https://www.atressencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511955556666',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'fasina-aroma',
    name: 'Fasina Aroma',
    url: 'https://fasinaaroma.com/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'emporio-das-essencias',
    name: 'Empório das Essências',
    url: 'https://www.emporiodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'casa-das-essencias',
    name: 'Casa das Essências',
    url: 'https://www.casadasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511922221111',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'paris-essencias',
    name: 'Paris Essências',
    url: 'https://www.lojaparisessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511933335555',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias', 'embalagens']
  },
  {
    id: 'casa-do-saboeiro',
    name: 'Casa do Saboeiro',
    url: 'https://www.casadosaboeiro.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SC,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'jacy-fragrancias',
    name: 'Jacy Fragrâncias',
    url: 'https://www.jacyfragrancias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'la-casa-de-cheiros-jp',
    name: 'La Casa de Cheiros JP',
    url: 'https://lacasadecheirosjp.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.NE,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'big-essencias',
    name: 'Big Essências',
    url: 'https://www.bigessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511944445555',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias']
  },
  {
    id: 'imperio-do-banho',
    name: 'Império do Banho',
    url: 'https://www.imperiodobanho.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    whatsapp: '5511977771111',
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['grandes_fornecedores', 'essencias', 'embalagens']
  },
  {
    id: 'victoire-essencias',
    name: 'Victoire Essências',
    url: 'https://www.victoireessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'essencia-e-cia',
    name: 'Essência & Cia',
    url: 'https://essenciaecia.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'super-essencias',
    name: 'Super Essências',
    url: 'https://www.superessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'perfumaria-reduto',
    name: 'Perfumaria Reduto',
    url: 'https://www.perfumariareduto.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'toda-essencia',
    name: 'Toda Essência',
    url: 'https://www.lojatodaessencia.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'prime-essencias',
    name: 'Prime Essências',
    url: 'https://primeessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'big-fonte-essencias',
    name: 'Big Fonte das Essências',
    url: 'https://bigfontedasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'flower-produtos',
    name: 'Flower Produtos',
    url: 'https://www.flowerprodutos.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias', 'embalagens']
  },
  {
    id: 'casa-de-essencias',
    name: 'Casa de Essências',
    url: 'https://www.casadeessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-das-essencias-original',
    name: 'Casa das Essências Original',
    url: 'https://www.casadasessenciasoriginal.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['essencias']
  },
  {
    id: 'aroma-e-amor',
    name: 'Aroma & Amor',
    url: 'https://www.aromaeamor.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'rainha-das-essencias',
    name: 'Rainha das Essências',
    url: 'https://loja.rainhadasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'paraiso-das-essencias',
    name: 'Paraíso das Essências',
    url: 'http://www.paraisodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'irmaos-haluli',
    name: 'Irmãos Haluli',
    url: 'https://www.irmaoshaluli.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.NE,
    isVerified: true,
    tags: ['embalagens', 'vidros']
  },
  {
    id: 'dna-perfumes',
    name: 'DNA Perfumes',
    url: 'https://www.dnaperfumes.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['embalagens', 'essencias']
  },
  {
    id: 'reali-plasticos',
    name: 'Reali Plásticos',
    url: 'https://www.realiplasticos.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: true,
    tags: ['embalagens']
  },
  {
    id: 'essencias-curitiba',
    name: 'Essências Curitiba',
    url: 'https://www.essenciascuritiba.com.br/loja',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.PR,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'harmoni-aromas',
    name: 'Harmoni Aromas',
    url: 'https://www.harmoniaromas.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'atenas-essencias',
    name: 'Atenas Essências',
    url: 'https://siteatenasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'eu-perfumista',
    name: 'Eu Perfumista',
    url: 'https://www.euperfumista.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'wanny-essencias',
    name: 'Wanny Essências',
    url: 'https://wannyessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'principal-essencias',
    name: 'Principal Essências',
    url: 'https://principalessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-essencias-uberlandia',
    name: 'Casa das Essências Uberlândia',
    url: 'https://casadasessenciasuberlandia.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.MG,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'deposito-das-essencias',
    name: 'Depósito das Essências',
    url: 'https://www.depositodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'la-casa-de-cheiro',
    name: 'La Casa de Cheiro',
    url: 'https://lacasadecheiro.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.NE,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'essencias-e-aroma',
    name: 'Essências e Aroma',
    url: 'https://www.essenciasearoma.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-essencias-bh',
    name: 'Casa das Essências BH',
    url: 'http://www.casadasessenciasbh.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.MG,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'mix-das-essencias',
    name: 'Mix das Essências',
    url: 'https://www.mixdasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-do-perfumista',
    name: 'Casa do Perfumista',
    url: 'https://www.casadoperfumista.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-dos-quimicos',
    name: 'Casa dos Químicos',
    url: 'https://www.casadosquimicos.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'vaporo',
    name: 'Vaporo',
    url: 'https://www.vaporo.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'essencias-e-cia-b',
    name: 'Essências & Cia (Nacional)',
    url: 'https://www.essenciasecia.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'essencias-boreal',
    name: 'Essências Boreal',
    url: 'https://www.essenciasboreal.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-das-fragrancias',
    name: 'Casa das Fragrâncias',
    url: 'https://casadasfragrancias.com/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.RJ,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casinha-das-essencias',
    name: 'Casinha das Essências',
    url: 'https://www.casinhadasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'mundo-das-essencias',
    name: 'Mundo das Essências',
    url: 'https://www.mundodasessencias.com/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'essencias-cia-real',
    name: 'Essências Cia',
    url: 'https://essenciascia.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'espaco-das-essencias',
    name: 'Espaço das Essências',
    url: 'https://www.espacodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'central-das-essencias-loja',
    name: 'Central das Essências Loja',
    url: 'https://www.lojacentraldasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'casa-do-sabonete',
    name: 'Casa do Sabonete',
    url: 'https://www.casadosabonete.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'central-das-essencias',
    name: 'Central das Essências',
    url: 'https://www.centraldasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'mercadao-das-essencias',
    name: 'Mercadão das Essências',
    url: 'https://mercadaodasessencias.com/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'neuro-aroma',
    name: 'Neuro Aroma',
    url: 'https://neuroaroma.com/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'pano-artes',
    name: 'Pano Artes',
    url: 'https://www.panoartes.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['embalagens']
  },
  {
    id: 'az-fragrancias',
    name: 'AZ Fragrâncias',
    url: 'https://www.azfragrancias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'dairin-essencias',
    name: 'Dairin Essências e Arte',
    url: 'https://www.dairinessenciasearte.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'aromas-do-rei',
    name: 'Aromas do Rei',
    url: 'https://aromasdorei.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'fabrica-de-aromas',
    name: 'Fábrica de Aromas',
    url: 'https://www.fabricadearomas.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'web-das-essencias',
    name: 'Web das Essências',
    url: 'https://www.webdasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'parissima',
    name: 'Paríssima',
    url: 'https://www.parissima.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'perfumistta',
    name: 'Perfumistta',
    url: 'https://perfumistta.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'recanto-das-essencias',
    name: 'Recanto das Essências',
    url: 'https://www.recantodasessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'so-essencias',
    name: 'Só Essências',
    url: 'https://www.soessencias.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'emporio-essenza',
    name: 'Empório Essenza',
    url: 'https://www.lojaemporioessenza.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SC,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'bellaria',
    name: 'Bellaria',
    url: 'https://www.lojabellaria.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  },
  {
    id: 'aroma-incrivel',
    name: 'Aroma Incrível',
    url: 'https://aromaincrivel.com.br/',
    platform: ECommercePlatform.GOOGLE_FALLBACK,
    region: StoreRegion.SP,
    isVerified: false,
    tags: ['essencias']
  }
];

export function cleanUrlDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace('www.', '');
  } catch {
    return urlStr.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  }
}

export function buildSearchUrl(store: Store, term: string): string {
  const domain = store.url.endsWith('/') ? store.url.slice(0, -1) : store.url;
  const encodedTerm = encodeURIComponent(term);
  
  switch (store.platform) {
    case ECommercePlatform.NUVEMSHOP:
      return `${domain}/busca?q=${encodedTerm}`;
    case ECommercePlatform.SHOPIFY:
      return `${domain}/search?q=${encodedTerm}`;
    case ECommercePlatform.WOOCOMMERCE:
      return `${domain}/?s=${encodedTerm}&post_type=product`;
    case ECommercePlatform.LOJA_INTEGRADA:
      return `${domain}/busca?q=${encodedTerm}`;
    case ECommercePlatform.TRAY:
      return `${domain}/busca?palavra_busca=${encodedTerm}`;
    case ECommercePlatform.OPENCART:
      return `${domain}/index.php?route=product/search&search=${encodedTerm}`;
    case ECommercePlatform.GOOGLE_FALLBACK:
    default: {
      const cleanDomain = cleanUrlDomain(store.url);
      return `https://www.google.com/search?q=site:${cleanDomain}+${encodedTerm}`;
    }
  }
}
