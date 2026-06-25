import React from 'react';
import { Star, ShoppingCart, Percent, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, onSelectProduct }: ProductCardProps) {
  // Format price in Indian style
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelectProduct(product.id)}
      className="group bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition-colors flex flex-col cursor-pointer relative shadow-lg"
    >
      
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="bg-yellow-500 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1 shadow-md">
            <Percent className="h-3 w-3" />
            {discount}% OFF
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-rose-950/40 text-rose-300 border border-rose-900/50 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <AlertCircle className="h-3 w-3" />
            ONLY {product.stock} LEFT
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-800 text-gray-400 border border-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* Frame of image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-900/50 border-b border-gray-800">
        <picture>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </picture>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      {/* product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#eab308] mb-1">
          {product.category}
        </span>
        
        <h3 className="font-serif text-sm sm:text-base font-semibold text-white group-hover:text-yellow-500 transition-colors line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'opacity-20'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-gray-400">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Pricing & Add call */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-gray-800">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-yellow-500">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[9px] text-yellow-500/80 font-bold tracking-wide uppercase mt-0.5">
              + No extra duties / Free review
            </p>
          </div>

          <button
            onClick={(e) => onAddToCart(product, e)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-full shadow-sm bg-white hover:bg-yellow-500 text-black transition-all duration-200 active:scale-95 flex-shrink-0 ${
              product.stock === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed hover:bg-gray-800 hover:text-gray-600' : ''
            }`}
            title="Quick add to basket"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
