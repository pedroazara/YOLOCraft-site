import { Activity } from 'lucide-react';

import { ActiveTab } from '../types';

interface FooterProps {
  onTabChange?: (tab: ActiveTab) => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full mt-24 border-t border-[#222222] bg-[#0c0c0c]">
      <div className="w-full flex flex-col md:flex-row justify-between items-center px-6 py-8 max-w-7xl mx-auto space-y-6 md:space-y-0 text-on-surface-variant">
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="font-display text-sm font-bold text-white tracking-widest">
            YOLOCraft <span className="text-primary font-mono text-[10px] uppercase">ANALÍTICO</span>
          </div>
          <div className="font-mono text-[11px] text-gray-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse inline-block"></span>
            <span>VOXEL_ENGINE_v4.2 // NEURAL_GRID_ESTÁVEL</span>
          </div>
        </div>

        <div className="font-mono text-[10px] text-gray-500 text-center md:text-left">
          © {currentYear} YOLOCraft - MONITOR DE ENTIDADES EM VOXELS.
        </div>

        <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px]">
          <button 
            onClick={() => {
              if (onTabChange) {
                onTabChange('criadores');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-gray-400 hover:text-primary transition-colors uppercase tracking-wider font-mono cursor-pointer bg-transparent border-none p-0 outline-none"
          >
            CRIADORES
          </button>
          <a 
            href="https://github.com/pedroazara/YOLOCraft" 
            target="_blank" 
            rel="noreferrer" 
            className="text-gray-400 hover:text-primary transition-colors uppercase tracking-wider"
          >
            GITHUB
          </a>
        </div>
      </div>

      {/* Modern High-Tech Neon Metadata bar from Design HTML */}
      <div className="h-8 bg-primary px-6 flex items-center justify-between font-mono text-[10px] font-bold text-black uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 bg-black rounded-full animate-ping"></span>
          <span>SISTEMA: OPERACIONAL</span>
        </div>
        <div className="hidden sm:block">MODELO: MOB_DET_YOLO_V4</div>
        <div>AUTO-SCAN: ATIVADO</div>
      </div>
    </footer>
  );
}
