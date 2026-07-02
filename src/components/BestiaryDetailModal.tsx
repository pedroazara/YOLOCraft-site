import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MobEntity } from '../types';
import { Shield, Skull, Target, HelpCircle, Heart, Swords } from 'lucide-react';

interface BestiaryDetailModalProps {
  entity: MobEntity | null;
  onClose: () => void;
}

const IMAGE_CACHE_KEY = 'yolocraft_image_cache_v1';
const getCachedUrl = (id: string): string | null => {
  try {
    const cached = localStorage.getItem(IMAGE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed[id] || null;
    }
  } catch (e) {}
  return null;
};

const setCachedUrl = (id: string, url: string) => {
  try {
    const cached = localStorage.getItem(IMAGE_CACHE_KEY);
    const parsed = cached ? JSON.parse(cached) : {};
    parsed[id] = url;
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(parsed));
  } catch (e) {}
};

const getTemperamentDetails = (type: string) => {
  switch (type) {
    case 'Passivo':
      return {
        label: 'Pacífico (Passivo)',
        desc: 'Não ataca o jogador sob nenhuma circunstância.',
        colorClass: 'text-green-400 bg-green-950/20 border-green-500/30',
        icon: Heart
      };
    case 'Neutro':
      return {
        label: 'Neutro',
        desc: 'Ataca apenas se for provocado ou atacado primeiro.',
        colorClass: 'text-amber-400 bg-amber-950/20 border-amber-500/30',
        icon: Shield
      };
    case 'Hostil':
      return {
        label: 'Hostil',
        desc: 'Ataca o jogador imediatamente ao avistá-lo.',
        colorClass: 'text-red-400 bg-red-950/20 border-red-500/30',
        icon: Swords
      };
    case 'Ataque à Distância':
      return {
        label: 'Hostil (À Distância)',
        desc: 'Dispara projéteis contra o jogador à distância.',
        colorClass: 'text-orange-400 bg-orange-950/20 border-orange-500/30',
        icon: Target
      };
    default:
      return {
        label: type,
        desc: 'Comportamento padrão.',
        colorClass: 'text-gray-400 bg-gray-950/20 border-gray-500/30',
        icon: HelpCircle
      };
  }
};

export default function BestiaryDetailModal({ entity, onClose }: BestiaryDetailModalProps) {
  if (!entity) return null;

  const getCandidates = (id: string): string[] => {
    const nameMap: { [key: string]: string } = {
      'cave_spider': 'Cave_Spider',
      'creeper': 'Creeper',
      'enderman': 'Enderman',
      'skeleton': 'Skeleton',
      'slime': 'Slime',
      'spider': 'Spider',
      'zombie': 'Zombie',
      'iron_golem': 'Iron_Golem',
      'wolf': 'Wolf',
      'cat': 'Tuxedo_Cat',
      'chicken': 'Chicken',
      'cow': 'Cow',
      'frog': 'Temperate_Frog',
      'horse': 'White_Horse',
      'pig': 'Pig',
      'sheep': 'White_Sheep',
    };

    const baseName = nameMap[id] || id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');

    return [
      `${baseName}_JE2_BE2.gif`,
      `${baseName}_JE2_BE1.gif`,
      `${baseName}_JE3_BE2.gif`,
      `${baseName}_JE1_BE1.gif`,
      `${baseName}_render.gif`,
      `${baseName}.gif`,
      `${baseName}_JE2_BE2.png`,
      `${baseName}_JE2_BE1.png`,
      `${baseName}_JE3_BE2.png`,
      `${baseName}_render.png`,
      `${baseName}.png`,
    ];
  };

  const candidates = getCandidates(entity.id);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [providerIndex, setProviderIndex] = useState(0);
  const [isCacheFailed, setIsCacheFailed] = useState(false);

  const providers = [
    (file: string) => `https://images.weserv.nl/?url=https://minecraft.fandom.com/wiki/Special:FilePath/${file}`,
    (file: string) => `https://minecraft.fandom.com/wiki/Special:FilePath/${file}`,
    (file: string) => `https://images.weserv.nl/?url=https://minecraft.wiki/w/Special:FilePath/${file}`,
    (file: string) => `https://minecraft.wiki/w/Special:FilePath/${file}`,
  ];

  const cachedUrl = isCacheFailed ? null : getCachedUrl(entity.id);
  const currentFilename = candidates[candidateIndex] || `${entity.id}.gif`;
  const imageUrl = cachedUrl || (providers[providerIndex] 
    ? providers[providerIndex](currentFilename) 
    : `https://minecraft.fandom.com/wiki/Special:FilePath/${currentFilename}`);

  const handleImageError = () => {
    if (cachedUrl) {
      try {
        const cached = localStorage.getItem(IMAGE_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          delete parsed[entity.id];
          localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(parsed));
        }
      } catch (e) {}
      setIsCacheFailed(true);
      setCandidateIndex(0);
      setProviderIndex(0);
      return;
    }

    if (providerIndex < providers.length - 1) {
      setProviderIndex(prev => prev + 1);
    } else if (candidateIndex < candidates.length - 1) {
      setCandidateIndex(prev => prev + 1);
      setProviderIndex(0);
    }
  };

  const handleImageLoad = () => {
    if (!cachedUrl) {
      setCachedUrl(entity.id, imageUrl);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const temperament = getTemperamentDetails(entity.type);

  return createPortal(
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
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
            onClick={onClose}
            className="w-8 h-8 bg-[#1a1a1a] border border-[#333333] hover:border-red-500 text-gray-400 hover:text-red-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Image & Loot Table Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#161616] border border-[#222222] p-3 aspect-square flex items-center justify-center">
            <img 
              className="w-full h-full object-contain animate-pulse-slow" 
              src={imageUrl} 
              alt={entity.name} 
              onError={handleImageError}
              onLoad={handleImageLoad}
              referrerPolicy="no-referrer" 
            />
          </div>

          <div className="flex flex-col gap-4 justify-between">
            <div>
              <h4 className="text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-2">PROPRIEDADES DA ENTIDADE</h4>
              <div className="space-y-2 text-xs text-gray-300 font-mono">
                <p><span className="text-gray-500">Classificação:</span> {entity.type}</p>
                <p>
                  <span className="text-gray-500">Temperamento:</span>{' '}
                  <span className={`px-1.5 py-0.5 rounded-sm border inline-flex items-center gap-1 ${temperament.colorClass}`}>
                    <temperament.icon className="w-3 h-3 shrink-0" />
                    <span>{temperament.label}</span>
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 leading-tight italic">{temperament.desc}</p>
                <p><span className="text-gray-500">Confiabilidade YOLO:</span> {entity.accuracy}%</p>
              </div>
            </div>

            <div>
              <h4 className="text-secondary font-mono text-[10px] font-bold uppercase tracking-wider mb-2">DROPS POSSIVEIS</h4>
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
            <h4 className="text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-1">DESCRICAO DO SISTEMA</h4>
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
            onClick={onClose}
            className="bg-primary hover:bg-[#34d399] text-black px-6 py-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors"
          >
            FECHAR LOGS
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
