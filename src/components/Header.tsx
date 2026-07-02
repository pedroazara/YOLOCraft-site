import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Compass, Skull, TrendingUp, HelpCircle, User, Menu, X } from 'lucide-react';
import YolocraftLogo from './YolocraftLogo';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEnterClick: () => void;
  userEmail?: string;
}

export default function Header({ activeTab, setActiveTab, onEnterClick, userEmail }: HeaderProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#111111] border-b border-[#333333] sticky top-0 z-50 w-full transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto relative">
        {/* Brand Logo with modern Geometric look */}
        <div 
          onClick={() => {
            setActiveTab('detector');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
          id="brand-logo"
        >
          <YolocraftLogo className="w-10 h-10 sm:w-14 sm:h-14" />
          <span className="font-display text-lg sm:text-2xl font-bold text-white tracking-tighter flex items-center">
            YOLOCraft <span className="text-primary font-mono text-xs ml-1.5 sm:ml-2">v2.4</span>
          </span>
        </div>

        {/* Navigation Menu (Desktop) - md:ml-auto leaves generous space from the logo */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-5 md:ml-auto md:mr-6">
          <button
            onClick={() => setActiveTab('detector')}
            onMouseEnter={() => setHoveredTab('detector')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm select-none cursor-pointer whitespace-nowrap transition-all duration-100 ${
              activeTab === 'detector'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 flex-shrink-0 relative top-[1px]" />
            <span className="font-minecraft tracking-wider">DETECTOR</span>
            
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
            className={`relative flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm select-none cursor-pointer whitespace-nowrap transition-all duration-100 ${
              activeTab === 'entidades'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4 flex-shrink-0 relative top-[1px]" />
            <span className="font-minecraft tracking-wider">ENTIDADES</span>

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
            className={`relative flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm select-none cursor-pointer whitespace-nowrap transition-all duration-100 ${
              activeTab === 'stats'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0 relative top-[1px]" />
            <span className="font-minecraft tracking-wider">ESTATISTICAS</span>

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
            className={`relative flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm select-none cursor-pointer whitespace-nowrap transition-all duration-100 ${
              activeTab === 'como-funciona'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0 relative top-[1px]" />
            <span className="font-minecraft tracking-wider">COMO FUNCIONA</span>

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

        {/* Right Action buttons (Authentication removed, only keeping Mobile Menu Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 bg-[#1a1a1a] border border-[#333333] hover:border-primary text-[#aaaaaa] hover:text-white transition-all duration-200 cursor-pointer rounded-sm flex items-center justify-center"
            aria-label="Alternar Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 flex-shrink-0" /> : <Menu className="w-5 h-5 flex-shrink-0" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 bg-[#161616] border-b border-[#333333] px-6 py-4 flex flex-col gap-2 z-40 md:hidden shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => {
                  setActiveTab('detector');
                  setIsMobileMenuOpen(false);
                }}
                className={`relative flex items-center gap-3 px-4 py-3 font-minecraft text-sm select-none cursor-pointer w-full text-left transition-all duration-100 ${
                  activeTab === 'detector'
                    ? 'text-primary bg-[#1e3f22]/30 border-l-4 border-primary'
                    : 'text-[#aaaaaa] hover:text-white bg-transparent border-l-4 border-transparent'
                }`}
              >
                <Compass className="w-4 h-4 flex-shrink-0" />
                <span>DETECTOR</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('entidades');
                  setIsMobileMenuOpen(false);
                }}
                className={`relative flex items-center gap-3 px-4 py-3 font-minecraft text-sm select-none cursor-pointer w-full text-left transition-all duration-100 ${
                  activeTab === 'entidades'
                    ? 'text-primary bg-[#1e3f22]/30 border-l-4 border-primary'
                    : 'text-[#aaaaaa] hover:text-white bg-transparent border-l-4 border-transparent'
                }`}
              >
                <Skull className="w-4 h-4 flex-shrink-0" />
                <span>ENTIDADES</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('stats');
                  setIsMobileMenuOpen(false);
                }}
                className={`relative flex items-center gap-3 px-4 py-3 font-minecraft text-sm select-none cursor-pointer w-full text-left transition-all duration-100 ${
                  activeTab === 'stats'
                    ? 'text-primary bg-[#1e3f22]/30 border-l-4 border-primary'
                    : 'text-[#aaaaaa] hover:text-white bg-transparent border-l-4 border-transparent'
                }`}
              >
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span>ESTATISTICAS</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('como-funciona');
                  setIsMobileMenuOpen(false);
                }}
                className={`relative flex items-center gap-3 px-4 py-3 font-minecraft text-sm select-none cursor-pointer w-full text-left transition-all duration-100 ${
                  activeTab === 'como-funciona'
                    ? 'text-primary bg-[#1e3f22]/30 border-l-4 border-primary'
                    : 'text-[#aaaaaa] hover:text-white bg-transparent border-l-4 border-transparent'
                }`}
              >
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span>COMO FUNCIONA</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
