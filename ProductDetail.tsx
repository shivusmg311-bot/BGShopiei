import React, { useState } from 'react';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onBack: () => void;
  onBuyNow: (product: Product, size?: string, color?: string) => void;
}

const CONST_COLORS = ['Luxe Sand', 'Deep Emerald', 'Sleek Obsidian', 'Soft Amber'];
const CONST_SIZES = ['Regular Fit', 'Large Accent', 'Atelier Tailored'];

export default function ProductDetail({ product, onAddToCart, onBack, onBuyNow }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(CONST_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(CONST_SIZES[0]);
  const [addedNote, setAddedNote] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const discountValue = product.originalPrice ? product.originalPrice - product.price : 0;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAddedNote(true);
    setTimeout(() => setAddedNote(false), 2500);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, selectedSize, selectedColor);
  };

  // Mock elegant reviews specific to the item category
  const mockReviews = [
    {
      author: 'Aarav Sharma',
      rating: 5,
      date: 'June 12, 2026',
      title: 'Exceeded all expectations of quality',
      comment: `The finish on this item is stunning. It has a real tactile feel that cheap mass-market alternatives absolutely lack. Extremely happy with BG SHPOI EI's service! Ordered and got payment request within 20 mins.`
    },
    {
      author: 'Anjali Nair',
      rating: 4,
      date: 'May 28, 2026',
      title: 'Extremely elegant and curated feel',
      comment: 'Matches my boutique studio aesthetic beautifully. Shipping details came clean, and the direct bank payment verification took under an hour. Love the touch of direct merchant review!'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Return Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-8 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4 text-yellow-500" />
        Back to Gallery
      </button>

      <div className="bg-[#1A1A1A] rounded-3xl border border-gray-850 shadow-xl overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Column 1: Image Showcase */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900/50 border border-gray-800 shadow-sm relative">
              <picture>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </picture>
              <button className="absolute top-4 right-4 p-3 rounded-full bg-black/80 hover:bg-black text-gray-400 hover:text-red-500 shadow-md transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900/50 border border-gray-800 cursor-pointer hover:opacity-80 transition-opacity">
                <picture>
                  <img
                    src={product.image}
                    alt="Detail thumb 1"
                    className="w-full h-full object-cover filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                </picture>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900/50 border border-gray-800 cursor-pointer hover:opacity-80 transition-opacity relative">
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold font-mono">
                  + Close Angle
                </div>
                <picture>
                  <img
                    src={product.image}
                    alt="Detail thumb 2"
                    className="w-full h-full object-cover filter contrast-125 saturate-120"
                    referrerPolicy="no-referrer"
                  />
                </picture>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-900/50 border border-gray-800 cursor-pointer hover:opacity-80 transition-opacity relative">
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold font-mono">
                  + Ambient Inset
                </div>
                <picture>
                  <img
                    src={product.image}
                    alt="Detail thumb 3"
                    className="w-full h-full object-cover filter sepia-10"
                    referrerPolicy="no-referrer"
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* Column 2: Rich Buy Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#eab308]">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                  {product.name}
                </h2>
                
                {/* Rating & Reviews overview */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'fill-current' : 'opacity-25'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    {product.rating} ({product.reviewCount} customer reviews)
                  </span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-[#131921] p-5 rounded-2xl border border-gray-800">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-yellow-500">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {discountValue > 0 && (
                  <p className="text-xs text-yellow-500 font-bold mt-1">
                    You save {formatPrice(discountValue)} ({Math.round((discountValue / (product.originalPrice || 1)) * 100)}% off)!
                  </p>
                )}
                <p className="text-[10px] text-gray-400 font-medium mt-3 leading-relaxed">
                  ⚠️ <span className="font-bold text-yellow-500">Secure Direct Order Flow</span>: When clicking place order, the Merchant reviews specifications and sends an explicit UPI/Bank payment request directly to your Order panel. No third-party processing fee markup!
                </p>
              </div>

              {/* Product description */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Description
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Styles / Colors Select */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Select Color: <span className="text-yellow-500 font-bold">{selectedColor}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {CONST_COLORS.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                        selectedColor === col
                          ? 'bg-yellow-500 text-black border-yellow-500 font-semibold shadow'
                          : 'bg-[#252525] hover:bg-gray-800 text-gray-300 border-gray-700'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {CONST_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                        selectedSize === sz
                          ? 'bg-yellow-500 text-black border-yellow-500 font-semibold shadow'
                          : 'bg-[#252525] hover:bg-gray-800 text-gray-300 border-gray-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bullet Features checklists */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Craft Details & Specs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-light">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions Panel */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCartClick}
                  disabled={product.stock === 0}
                  className="bg-white hover:bg-gray-200 text-black px-6 py-4 rounded-full text-xs font-extrabold tracking-widest flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-all"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  ADD TO BASKET
                </button>
                <button
                  onClick={handleBuyNowClick}
                  disabled={product.stock === 0}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-full text-xs font-extrabold tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                >
                  BUY NOW (SECURE ENROLL)
                </button>
              </div>

              {addedNote && (
                <div className="mt-3 text-center text-xs font-bold text-yellow-500 bg-[#232F3E] py-2 rounded-lg border border-yellow-500/20 animate-bounce">
                  ✨ Added to shopping cart successfully with selections!
                </div>
              )}

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 mt-6 text-center text-[10px] text-gray-400 font-medium">
                <div className="flex flex-col items-center p-2 bg-[#131921] rounded-xl border border-gray-850">
                  <ShieldCheck className="h-5 w-5 text-yellow-500 mb-1" />
                  <span>Verified Craftsman</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-[#131921] rounded-xl border border-gray-850">
                  <Truck className="h-5 w-5 text-yellow-500 mb-1" />
                  <span>Priority Courier</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-[#131921] rounded-xl border border-gray-850">
                  <RefreshCw className="h-5 w-5 text-yellow-500 mb-1" />
                  <span>7-Day Direct Refund</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Product Reviews Box */}
        <div className="mt-16 pt-10 border-t border-gray-805">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
            Customer Testimonials
          </h3>
          <div className="space-y-6">
            {mockReviews.map((rev, idx) => (
              <div key={idx} className="bg-[#252525] p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'opacity-25'}`} />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {rev.date}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-white mb-1">{rev.title}</h5>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">{rev.comment}</p>
                </div>
                <div className="sm:text-right flex-shrink-0 text-gray-400 text-xs">
                  <span className="font-semibold text-yellow-500">{rev.author}</span>
                  <div className="text-[10px] text-yellow-500 font-bold uppercase mt-1">✓ Verified Purchase</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
