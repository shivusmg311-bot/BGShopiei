import React from 'react';
import { Shield, User, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSwitcherProps {
  currentRole: 'user' | 'admin';
  onChangeRole: (role: 'user' | 'admin') => void;
}

export default function RoleSwitcher({ currentRole, onChangeRole }: RoleSwitcherProps) {
  return (
    <div className="bg-black text-white py-2.5 px-4 sticky top-0 z-50 border-b border-neutral-900 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
          <p className="text-xs font-mono text-gray-300">
            <span className="font-bold text-white tracking-widest uppercase text-[10px] mr-1">🌟 BG SHPOI EI INTERACTIVE PROTOTYPE:</span> Demo both roles in a single viewport.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#111] p-0.5 rounded-full flex border border-neutral-800">
            <button
              onClick={() => onChangeRole('user')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                currentRole === 'user'
                  ? 'bg-white text-black shadow-md font-extrabold'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Customer view
            </button>
            <button
              onClick={() => onChangeRole('admin')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-white text-black shadow-md font-extrabold'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Merchant Admin
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-[#111] px-3 py-1 rounded-md text-[10px] text-gray-400 max-w-xs border border-neutral-800">
            <Info className="h-3.5 w-3.5 text-white flex-shrink-0" />
            <span>Place orders as customer, then switch to Admin dashboard to send a payment demand!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
