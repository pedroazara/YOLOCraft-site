import React, { useState } from 'react';
import { MobEntity } from '../types';
import { Shield, Skull, Target, HelpCircle, Heart, Swords, Activity } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  warning: Shield,
  skull: Skull,
  target: Target,
  bolt: HelpCircle,
  visibility: Skull,
  shield: Shield,
};

const getTemperamentDetails = (type: string) => {
  switch (type) {
    case 'Passivo':
      return {
        label: 'Pacífico (Passivo)',
        desc: 'Não ataca o jogador sob nenhuma circunstância.',
        colorClass: 'text-green-400 bg-green-950/20 border-green-500/30',
        icon: '❤️'
      };
    case 'Neutro':
      return {
        label: 'Neutro',
        desc: 'Ataca apenas se for provocado ou atacado primeiro.',
        colorClass: 'text-amber-400 bg-amber-950/20 border-amber-500/30',
        icon: '🛡️'
      };
    case 'Hostil':
      return {
        label: 'Hostil',
        desc: 'Ataca o jogador imediatamente ao avistá-lo.',
        colorClass: 'text-red-400 bg-red-950/20 border-red-500/30',
        icon: '💀'
      };
    case 'Ataque à Distância':
      return {
        label: 'Hostil (À Distância)',
        desc: 'Dispara projéteis contra o jogador à distância.',
        colorClass: 'text-orange-400 bg-orange-950/20 border-orange-500/30',
        icon: '🏹'
      };
    default:
      return {
        label: type,
        desc: 'Comportamento padrão.',
        colorClass: 'text-gray-400 bg-gray-950/20 border-gray-500/30',
        icon: '❓'
      };
  }
};

interface BestiaryCardProps {
  entity: MobEntity;
  key?: string | number;
}

export default function BestiaryCard({ entity }: BestiaryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Map entity type to custom background styles for high-tech tags
  const typeColors: { [key: string]: { border: string; bg: string; text: string } } = {
    'Hostil': { border: 'border-red-500/30', bg: 'bg-red-950/10', text: 'text-red-400' },
    'Ataque à Distância': { border: 'border-amber-500/30', bg: 'bg-amber-950/10', text: 'text-amber-400' },
    'Neutro': { border: 'border-purple-500/30', bg: 'bg-purple-950/10', text: 'text-purple-400' },
    'Passivo': { border: 'border-primary/30', bg: 'bg-primary/10', text: 'text-primary' },
  };

  const styleConfig = typeColors[entity.type] || { border: 'border-[#333]', bg: 'bg-[#1a1a1a]', text: 'text-primary' };

  const segmentsCount = 10;
  const activeSegments = Math.round(entity.accuracy / 10);
  const temperament = getTemperamentDetails(entity.type);

  return (
    <>
      <div 
        className="gui-card group flex flex-col h-full select-none bg-[#111111] border border-[#333333] hover:border-primary transition-all duration-300 rounded-none relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Subtle decorative grid/corners inside the card */}
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 border-t border-r border-[#4ADE80]"></div>
        
        {/* Entity Category Header */}
        <div className="px-4 py-2.5 flex justify-between items-center border-b border-[#222222] bg-[#161616]">
          <span className="font-mono text-[10px] tracking-wider text-gray-500 font-bold">
            {entity.number}
          </span>
          <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${styleConfig.border} ${styleConfig.bg} ${styleConfig.text}`}>
            {entity.type}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 flex flex-col grow">
          {/* Main Slot Image */}
          <div className="w-full aspect-square mb-4 flex items-center justify-center relative overflow-hidden bg-[#161616] border border-[#222222]">
            <img 
              className="w-4/5 h-4/5 object-contain transition-transform duration-300 group-hover:scale-105" 
              src={entity.image} 
              alt={entity.name}
              referrerPolicy="no-referrer"
            />
            {/* Scanline overlay effect on image when hovered */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>

          <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 font-bold group-hover:text-primary transition-colors">
            {entity.name}
          </h3>

          <div className="space-y-4 mt-auto">
            {/* Accuracy Indicator (Segmented XP Bar) */}
            <div>
              <div className="flex justify-between font-mono text-[10px] text-gray-400 mb-1.5">
                <span className="tracking-widest">A CURÁCIA</span>
                <span className="text-primary font-bold">{entity.accuracy}%</span>
              </div>
              <div className="h-2 bg-[#1a1a1a] border border-[#333333] flex gap-0.5 p-0.5">
                {Array.from({ length: segmentsCount }).map((_, index) => {
                  const isActive = index < activeSegments;
                  return (
                    <div 
                      key={index} 
                      className={`flex-1 h-full transition-colors duration-200 ${
                        isActive 
                          ? 'bg-primary' 
                          : 'bg-[#2a2a2a]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scan Action Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="w-full bg-[#161616] hover:bg-primary hover:text-black text-gray-300 font-mono text-[10px] tracking-widest uppercase py-2.5 border border-[#333333] hover:border-primary transition-all duration-200 cursor-pointer"
            >
              ANÁLISE DE DADOS
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-lg bg-[#111111] border border-[#333333] p-6 text-on-background relative flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            {/* Corner Bracket Elements */}
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-tr"></div>
            <div className="corner-bracket-bl"></div>
            <div className="corner-bracket-br"></div>

            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#222222] pb-3">
              <div>
                <span className="text-[#888888] font-mono text-[10px] uppercase block tracking-wider">{entity.number}</span>
                <h2 className="font-display text-2xl text-white font-bold uppercase mt-1 tracking-wider">{entity.name}</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-[#1a1a1a] border border-[#333333] hover:border-red-500 text-gray-400 hover:text-red-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Image & Loot Table Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#161616] border border-[#222222] p-3 aspect-square flex items-center justify-center">
                <img className="w-full h-full object-contain animate-pulse-slow" src={entity.image} alt={entity.name} referrerPolicy="no-referrer" />
              </div>

              <div className="flex flex-col gap-4 justify-between">
                <div>
                  <h4 className="text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-2">PROPRIEDADES DA ENTIDADE</h4>
                  <div className="space-y-2 text-xs text-gray-300 font-mono">
                    <p><span className="text-gray-500">Classificação:</span> {entity.type}</p>
                    <p>
                      <span className="text-gray-500">Temperamento:</span>{' '}
                      <span className={`px-1.5 py-0.5 rounded-sm border inline-flex items-center gap-1 ${temperament.colorClass}`}>
                        <span>{temperament.icon}</span>
                        <span>{temperament.label}</span>
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight italic">{temperament.desc}</p>
                    <p><span className="text-gray-500">Confiabilidade YOLO:</span> {entity.accuracy}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-secondary font-mono text-[10px] font-bold uppercase tracking-wider mb-2">DROPS POSSÍVEIS</h4>
                  {entity.drops.length > 0 ? (
                    <ul className="list-disc list-inside text-xs space-y-1 text-gray-300 font-mono">
                      {entity.drops.map((drop, i) => (
                        <li key={i}>{drop}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 font-mono italic">Nenhum drop registrado.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="bg-[#161616] border border-[#222222] p-4 text-xs space-y-3">
              <div>
                <h4 className="text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-1">DESCRIÇÃO DO SISTEMA</h4>
                <p className="text-gray-300 leading-relaxed font-sans text-xs">
                  {entity.description}
                </p>
              </div>
              <div>
                <h4 className="text-secondary font-mono text-[10px] font-bold uppercase tracking-wider mb-1">COMPORTAMENTO OBSERVADO</h4>
                <p className="text-gray-300 leading-relaxed font-sans text-xs">
                  {entity.behavior}
                </p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-primary hover:bg-primary-hover text-black px-6 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                FECHAR LOGS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
