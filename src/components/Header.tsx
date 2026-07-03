import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Compass, Skull, HelpCircle, Menu, X, Users } from 'lucide-react';
import YolocraftLogo from './YolocraftLogo';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEnterClick: () => void;
  userEmail?: string;
  apiStatus: 'online' | 'offline' | 'checking';
}

export default function Header({ activeTab, setActiveTab, onEnterClick, userEmail, apiStatus }: HeaderProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If mobile menu is open, keep the header visible
      if (isMobileMenuOpen) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide when scrolling down past 80px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isMobileMenuOpen]);

  return (
    <header className={`bg-[#111111] border-b border-[#333333] sticky top-0 z-50 w-full transition-all duration-300 ease-in-out transform ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
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
            YOLOCraft
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
            <span className="font-minecraft tracking-wider">{t('nav_detector')}</span>
            
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
            <span className="font-minecraft tracking-wider">{t('nav_bestiary')}</span>

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
            <span className="font-minecraft tracking-wider">{t('nav_how_it_works')}</span>

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

          <button
            onClick={() => setActiveTab('criadores')}
            onMouseEnter={() => setHoveredTab('criadores')}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center gap-2 px-3 lg:px-4 py-2.5 text-xs lg:text-sm select-none cursor-pointer whitespace-nowrap transition-all duration-100 ${
              activeTab === 'criadores'
                ? 'text-primary'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0 relative top-[1px]" />
            <span className="font-minecraft tracking-wider">{t('nav_creators')}</span>

            {activeTab === 'criadores' && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-[#1e3f22]/60 border-2 border-t-[#4ade80] border-l-[#4ade80] border-r-[#155e2f] border-b-[#155e2f] -z-20 shadow-[2px_2px_0px_#000000]"
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              />
            )}

            {hoveredTab === 'criadores' && activeTab !== 'criadores' && (
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

        {/* Right Action buttons (Language switcher + Mobile Menu Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* API Status Indicator */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 border-2 border-t-[#555555] border-l-[#555555] border-r-[#111111] border-b-[#111111] shadow-[2px_2px_0px_#000000] select-none h-[34px]">
            <span className={`w-2 h-2 rounded-none ${
              apiStatus === 'online' 
                ? 'bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse' 
                : apiStatus === 'checking'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
            }`} />
            <span className="font-minecraft text-[8px] sm:text-[9px] font-bold text-gray-300 uppercase whitespace-nowrap">
              {apiStatus === 'online' 
                ? 'API ONLINE' 
                : apiStatus === 'checking' 
                ? (language === 'pt' ? 'TESTANDO' : 'CHECKING') 
                : 'API OFFLINE'}
            </span>
          </div>

          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] border-2 border-t-[#555555] border-l-[#555555] border-r-[#111111] border-b-[#111111] font-minecraft text-[11px] font-bold text-primary active:border-t-[#111111] active:border-l-[#111111] active:border-r-[#555555] active:border-b-[#555555] transition-all duration-100 cursor-pointer rounded-none flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]"
            title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          >
            <span className="text-sm">🌐</span>
            <span className="font-bold">{language === 'pt' ? 'EN' : 'PT'}</span>
          </button>

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
                <span>{t('nav_detector')}</span>
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
                <span>{t('nav_bestiary')}</span>
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
                <span>{t('nav_how_it_works')}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('criadores');
                  setIsMobileMenuOpen(false);
                }}
                className={`relative flex items-center gap-3 px-4 py-3 font-minecraft text-sm select-none cursor-pointer w-full text-left transition-all duration-100 ${
                  activeTab === 'criadores'
                    ? 'text-primary bg-[#1e3f22]/30 border-l-4 border-primary'
                    : 'text-[#aaaaaa] hover:text-white bg-transparent border-l-4 border-transparent'
                }`}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{t('nav_creators')}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
