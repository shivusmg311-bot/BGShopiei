import React, { useState } from 'react';
import { ShoppingBag, Search, Eye, Compass, Package, Smartphone, RefreshCw } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentView: 'shop' | 'orders' | 'admin';
  onChangeView: (view: 'shop' | 'orders' | 'admin') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onResetDemo: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  currentView,
  onChangeView,
  searchTerm,
  onSearchChange,
  onResetDemo
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#131921]/90 backdrop-blur-md sticky top-[50px] z-40 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Group */}
          <div className="flex items-center gap-3">
            <button
               onClick={() => onChangeView('shop')}
               className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center font-serif text-xl font-bold text-[#0F1111] border border-white shadow-md group-hover:scale-105 transition-transform">
                BG
              </div>
              <div>
                <h1 id="brand-title" className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-gray-300 transition-colors">
                  BG SHPOI EI
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none mt-0.5">
                  Est. 2026 • Luxe Store
                </p>
              </div>
            </button>
          </div>

          {/* Search Box in Center */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search high-end aesthetic products..."
                className="w-full bg-[#111] border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white/30 rounded-full py-2.5 pl-11 pr-4 text-xs tracking-wide text-gray-250 placeholder-gray-500 outline-none transition-all"
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Nav Links / Active Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            
            {/* View Shop */}
            <button
              id="nav-shop"
              onClick={() => {
                onChangeView('shop');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                currentView === 'shop'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className={`h-4 w-4 ${currentView === 'shop' ? 'text-black' : 'text-gray-400'}`} />
              <span className="hidden sm:inline">Explore Catalog</span>
            </button>

            {/* View Tracking */}
            <button
              id="nav-orders"
              onClick={() => {
                onChangeView('orders');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-all relative ${
                currentView === 'orders'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className={`h-4 w-4 ${currentView === 'orders' ? 'text-black' : 'text-gray-400'}`} />
              <span>My Orders</span>
            </button>

            {/* Cart Trigger */}
            <button
              id="nav-cart"
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-extrabold px-4 py-2 rounded-full text-xs transition-all shadow-md active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 text-black" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-black text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>

            {/* Reset Demo State button */}
            <button
              onClick={onResetDemo}
              title="Reset Demo Data"
              className="p-2 rounded-full border border-gray-800 text-gray-500 hover:text-yellow-500 hover:border-gray-750 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="md:hidden pb-4 border-t border-gray-800 pt-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1A1A1A] border border-gray-700 focus:border-white rounded-full py-2 pl-10 pr-4 text-xs tracking-wide text-gray-200 placeholder-gray-500 outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
