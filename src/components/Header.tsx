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
            className={`relative flex items-center gap-2 px-4 py-2.5 font-minecraft text-sm select-none cursor-pointer transition-all duration-100 ${
              activeTab === 'detector'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>DETECTOR</span>
            
            {activeTab === 'detector' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-[#1e3f22]/60 border-2 border-t-[#4ade80] border-l-[#4ade80] border-r-[#155e2f] border-b-[#155e2f] -z-20 shadow-[2px_2px_0px_#000000]"
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}

            {hoveredTab === 'detector' && activeTab !== 'detector' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-[#2c2c2c] border-2 border-t-[#8b8b8b] border-l-[#8b8b8b] border-r-[#444444] border-b-[#444444] -z-10 shadow-[2px_2px_0px_#000000]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('entidades')}
            onMouseEnter={() => setHoveredTab('entidades')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-4 py-2.5 font-minecraft text-sm select-none cursor-pointer transition-all duration-100 ${
              activeTab === 'entidades'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>ENTIDADES</span>

            {activeTab === 'entidades' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-[#1e3f22]/60 border-2 border-t-[#4ade80] border-l-[#4ade80] border-r-[#155e2f] border-b-[#155e2f] -z-20 shadow-[2px_2px_0px_#000000]"
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}

            {hoveredTab === 'entidades' && activeTab !== 'entidades' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-[#2c2c2c] border-2 border-t-[#8b8b8b] border-l-[#8b8b8b] border-r-[#444444] border-b-[#444444] -z-10 shadow-[2px_2px_0px_#000000]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            onMouseEnter={() => setHoveredTab('stats')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-4 py-2.5 font-minecraft text-sm select-none cursor-pointer transition-all duration-100 ${
              activeTab === 'stats'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>ESTATISTICAS</span>

            {activeTab === 'stats' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-[#1e3f22]/60 border-2 border-t-[#4ade80] border-l-[#4ade80] border-r-[#155e2f] border-b-[#155e2f] -z-20 shadow-[2px_2px_0px_#000000]"
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}

            {hoveredTab === 'stats' && activeTab !== 'stats' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-[#2c2c2c] border-2 border-t-[#8b8b8b] border-l-[#8b8b8b] border-r-[#444444] border-b-[#444444] -z-10 shadow-[2px_2px_0px_#000000]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('como-funciona')}
            onMouseEnter={() => setHoveredTab('como-funciona')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-4 py-2.5 font-minecraft text-sm select-none cursor-pointer transition-all duration-100 ${
              activeTab === 'como-funciona'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>COMO FUNCIONA</span>

            {activeTab === 'como-funciona' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-[#1e3f22]/60 border-2 border-t-[#4ade80] border-l-[#4ade80] border-r-[#155e2f] border-b-[#155e2f] -z-20 shadow-[2px_2px_0px_#000000]"
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}

            {hoveredTab === 'como-funciona' && activeTab !== 'como-funciona' && (
              <motion.div
                layoutId="hover-indicator"
                className="absolute inset-0 bg-[#2c2c2c] border-2 border-t-[#8b8b8b] border-l-[#8b8b8b] border-r-[#444444] border-b-[#444444] -z-10 shadow-[2px_2px_0px_#000000]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
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
