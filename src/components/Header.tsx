import { ActiveTab } from '../types';
import { Compass, Skull, TrendingUp, HelpCircle, User } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEnterClick: () => void;
  userEmail?: string;
}

export default function Header({ activeTab, setActiveTab, onEnterClick, userEmail }: HeaderProps) {
  return (
    <header className="bg-[#111111] border-b border-[#333333] sticky top-0 z-50 w-full transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        {/* Brand Logo with modern Geometric look */}
        <div 
          onClick={() => setActiveTab('detector')}
          className="flex items-center gap-3 cursor-pointer select-none"
          id="brand-logo"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center transition-transform hover:rotate-45 duration-300">
            <div className="w-4 h-4 bg-black"></div>
          </div>
          <span className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tighter">
            YOLOCRAFT <span className="text-primary font-mono text-sm ml-1">v2.4</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          <button
            onClick={() => setActiveTab('detector')}
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${
              activeTab === 'detector'
                ? 'text-primary border-primary'
                : 'text-[#888888] hover:text-white border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>DETECTOR</span>
          </button>

          <button
            onClick={() => setActiveTab('entidades')}
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${
              activeTab === 'entidades'
                ? 'text-primary border-primary'
                : 'text-[#888888] hover:text-white border-transparent'
            }`}
          >
            <Skull className="w-3.5 h-3.5" />
            <span>ENTIDADES</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${
              activeTab === 'stats'
                ? 'text-primary border-primary'
                : 'text-[#888888] hover:text-white border-transparent'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ESTATÍSTICAS</span>
          </button>

          <button
            onClick={() => setActiveTab('como-funciona')}
            className={`flex items-center gap-2 pb-1 transition-all border-b-2 ${
              activeTab === 'como-funciona'
                ? 'text-primary border-primary'
                : 'text-[#888888] hover:text-white border-transparent'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMO FUNCIONA</span>
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
