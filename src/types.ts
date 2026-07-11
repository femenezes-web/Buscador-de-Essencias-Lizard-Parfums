/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ECommercePlatform {
  NUVEMSHOP = 'nuvemshop',
  SHOPIFY = 'shopify',
  WOOCOMMERCE = 'woocommerce',
  LOJA_INTEGRADA = 'lojaintegrada',
  TRAY = 'tray',
  OPENCART = 'opencart',
  GOOGLE_FALLBACK = 'google'
}

export enum StoreRegion {
  SP = 'São Paulo (SP)',
  RJ = 'Rio de Janeiro (RJ)',
  MG = 'Minas Gerais (MG)',
  PR = 'Paraná (PR)',
  SC = 'Santa Catarina (SC)',
  RS = 'Rio Grande do Sul (RS)',
  NE = 'Nordeste',
  CO = 'Centro-Oeste',
  OUTROS = 'Outras Regiões'
}

export interface Store {
  id: string;
  name: string;
  url: string;
  platform: ECommercePlatform;
  whatsapp?: string; // Formatted as 55...
  region: StoreRegion;
  isVerified: boolean;
  tags: string[]; // e.g. "grandes_fornecedores", "embalagens", "essencias", "vidros"
}

export interface Essence {
  id: string;
  canonicalName: string;
  synonyms: string[]; // List of names, including original and market names
  originalPerfume?: string;
  brandHouse?: string;
  category: 'masculino' | 'feminino' | 'compartilhada' | 'outros';
}

export interface SearchHistoryItem {
  id: string;
  term: string;
  timestamp: number;
}
