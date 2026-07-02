import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Compass, Skull, TrendingUp, HelpCircle, User } from 'lucide-react';
import YolocraftLogo from './YolocraftLogo';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEnterClick: () => void;
  userEmail?: string;
}

export default function Header({ activeTab, setActiveTab, onEnterClick, userEmail }: HeaderProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <header className="bg-[#111111] border-b border-[#333333] sticky top-0 z-50 w-full transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        {/* Brand Logo with modern Geometric look */}
        <div 
          onClick={() => setActiveTab('detector')}
          className="flex items-center gap-3 cursor-pointer select-none"
          id="brand-logo"
        >
          <YolocraftLogo className="w-12 h-12 sm:w-14 sm:h-14" />
          <span className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tighter">
            YOLOCRAFT <span className="text-primary font-mono text-sm ml-1">v2.4</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-4 text-xs">
          <button
            onClick={() => setActiveTab('detector')}
            onMouseEnter={() => setHoveredTab('detector')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-3.5 py-2 transition-all font-display text-xs sm:text-sm tracking-wider select-none cursor-pointer ${
              activeTab === 'detector'
                ? 'text-primary font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>DETECTOR</span>
            
            {activeTab === 'detector' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {hoveredTab === 'detector' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-primary/10 border border-primary/20 -z-10 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('entidades')}
            onMouseEnter={() => setHoveredTab('entidades')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-3.5 py-2 transition-all font-display text-xs sm:text-sm tracking-wider select-none cursor-pointer ${
              activeTab === 'entidades'
                ? 'text-primary font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>ENTIDADES</span>

            {activeTab === 'entidades' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {hoveredTab === 'entidades' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-primary/10 border border-primary/20 -z-10 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            onMouseEnter={() => setHoveredTab('stats')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-3.5 py-2 transition-all font-display text-xs sm:text-sm tracking-wider select-none cursor-pointer ${
              activeTab === 'stats'
                ? 'text-primary font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ESTATISTICAS</span>

            {activeTab === 'stats' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {hoveredTab === 'stats' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-primary/10 border border-primary/20 -z-10 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('como-funciona')}
            onMouseEnter={() => setHoveredTab('como-funciona')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-3.5 py-2 transition-all font-display text-xs sm:text-sm tracking-wider select-none cursor-pointer ${
              activeTab === 'como-funciona'
                ? 'text-primary font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMO FUNCIONA</span>

            {activeTab === 'como-funciona' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {hoveredTab === 'como-funciona' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-primary/10 border border-primary/20 -z-10 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </nav>

        {/* Right action button */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden lg:inline font-mono text-xs text-[#888888]">
              {userEmail.split('@')[0]}
            </span>
          )}
          <button
            onClick={onEnterClick}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#333333] hover:border-primary text-white hover:text-primary font-mono text-[11px] tracking-wider transition-all duration-200 cursor-pointer select-none uppercase"
          >
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>{userEmail ? 'PERFIL' : 'ENTRAR'}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
