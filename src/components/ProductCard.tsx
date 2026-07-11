/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink, ShoppingBag, Clock, MessageSquare, Tag } from 'lucide-react';
import { Store, Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  store: Store | undefined;
}

export default function ProductCard({ product, store }: ProductCardProps) {
  // Format price to BRL
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format date of last confirmation
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Recentemente';
    }
  };

  const storeName = store ? store.name : 'Loja Parceira';
  const domain = store ? store.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';

  // WhatsApp link generator with pre-filled product query
  const getWhatsAppLink = () => {
    if (!store || !store.whatsapp) return '';
    const message = encodeURIComponent(
      `Olá! Vi o produto "${product.name}" de sua loja no Buscador Lizard Parfums e gostaria de confirmar a disponibilidade.`
    );
    return `https://wa.me/${store.whatsapp}?text=${message}`;
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-[#121212] border border-[#d4af37]/15 hover:border-[#d4af37]/60 rounded-lg p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.06)]"
    >
      <div>
        {/* Store Origin Badge & Region */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] text-gold-400 font-serif font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
            {storeName}
          </span>
          {store && (
            <span className="text-[9px] bg-coal-950 text-coal-400 px-2 py-0.5 rounded border border-coal-800 uppercase font-mono tracking-wider">
              {store.region.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Product Title */}
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-white hover:text-gold-400 font-serif font-semibold text-sm leading-snug tracking-tight mb-3 transition-colors duration-200 line-clamp-2"
          title={product.name}
        >
          {product.name}
        </a>

        {/* Domain Label */}
        {domain && (
          <p className="text-[10px] text-coal-500 font-mono tracking-wider mb-4 truncate">{domain}</p>
        )}
      </div>

      <div>
        {/* Price Tag Section */}
        <div className="flex items-baseline justify-between border-t border-coal-800/45 pt-4 mb-4">
          <div className="flex items-center gap-1 text-[#d4af37]">
            <Tag className="w-3.5 h-3.5 shrink-0" />
            <span className="font-serif font-bold text-lg md:text-xl">{formatPrice(product.price)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] text-coal-500 font-mono">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Ativo: {formatDate(product.lastConfirmedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#d4af37] hover:bg-[#b5942b] text-[#0a0a0a] font-serif font-bold py-2 px-3 rounded text-xs uppercase tracking-wider transition-all duration-300"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            Comprar
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>

          {store && store.whatsapp && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center border border-green-600/30 text-green-500 hover:bg-green-600/10 p-2 rounded transition-all duration-300"
              title="Perguntar no WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
