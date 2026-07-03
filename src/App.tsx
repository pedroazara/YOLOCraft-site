import React, { useState, useEffect } from 'react';
import { ActiveTab, ScanResult, MobEntity } from './types';
import { BESTIARY_ENTITIES, RECENT_SCANS } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import BestiaryCard from './components/BestiaryCard';
import DetectorPanel from './components/DetectorPanel';
import BestiaryDetailModal from './components/BestiaryDetailModal';
import HowItWorks from './components/HowItWorks';
import MinecraftBackground from './components/MinecraftBackground';
import { Shield, Brain, Compass, Trash2, Github, Linkedin, Mail, BookOpen } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detector');
  const [hoveredGridCell, setHoveredGridCell] = useState<{ r: number; c: number } | null>(null);
  const [blockCursorPos, setBlockCursorPos] = useState({ x: -100, y: -100 });
  const [userEmail, setUserEmail] = useState<string | undefined>('PedroHenriqueAlmeida2004@gmail.com');
  const [externalLoadScan, setExternalLoadScan] = useState<ScanResult | null>(null);
  const [selectedMob, setSelectedMob] = useState<MobEntity | null>(null);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [howItWorksInitialMethod, setHowItWorksInitialMethod] = useState<'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed' | null>(null);
  const [howItWorksInitialSubSection, setHowItWorksInitialSubSection] = useState<'visao-geral' | 'dataset' | 'yolo-redes' | 'metodos' | 'estrutura' | 'modelo' | 'instalacao' | 'roadmap' | undefined>(undefined);

  // API Health status ping and 15s interval polling
  useEffect(() => {
    let isMounted = true;
    let intervalId: any = null;

    const checkApiStatus = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const url = `${(import.meta as any).env?.VITE_API_BASE_URL || 'https://pedroazara-yolocraft-api.hf.space'}/ping`;
        const response = await fetch(url, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.status === 200) {
          const data = await response.json();
          if (data && data.ping === 'pong') {
            if (isMounted) setApiStatus('online');
            return;
          }
        }
        if (isMounted) setApiStatus('offline');
      } catch (err) {
        clearTimeout(timeoutId);
        if (isMounted) setApiStatus('offline');
      }
    };

    checkApiStatus();
    intervalId = setInterval(checkApiStatus, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const { language, t, translateMob, getTranslatedMobDetails } = useLanguage();

  // Load persistent scans history
  const [scans, setScans] = useState<ScanResult[]>(() => {
    const saved = localStorage.getItem('yolocraft_scans_history_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return RECENT_SCANS;
      }
    }
    return RECENT_SCANS;
  });

  useEffect(() => {
    localStorage.setItem('yolocraft_scans_history_v1', JSON.stringify(scans));
  }, [scans]);

  useEffect(() => {
    // Reset body overflow lock when switching tabs to ensure scroll is never stuck
    document.body.style.overflow = '';
  }, [activeTab]);

  // Load mouse tracking cursor coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Round to 4px intervals for authentic pixel step look
      const step = 4;
      const x = Math.round(e.clientX / step) * step;
      const y = Math.round(e.clientY / step) * step;
      setBlockCursorPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScanComplete = (newScan: ScanResult) => {
    // Add new scan to the beginning of the history
    setScans(prev => [newScan, ...prev]);
  };

  const handleDeleteScan = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScans(prev => prev.filter(s => s.id !== idToDelete));
  };

  const handleClearHistory = () => {
    if (confirm(language === 'pt' ? 'Tem certeza que deseja limpar todo o histórico de varreduras?' : 'Are you sure you want to clear all scan history?')) {
      setScans([]);
    }
  };

  const handleViewMobDetails = (mobClass: string) => {
    const normalized = mobClass.toLowerCase().trim();
    const found = BESTIARY_ENTITIES.find(e => 
      e.id === normalized || 
      e.name.toLowerCase().includes(normalized) || 
      normalized.includes(e.id) ||
      (normalized === 'zumbi' && e.id === 'zombie') ||
      (normalized === 'esqueleto' && e.id === 'skeleton') ||
      (normalized === 'aranha' && e.id === 'spider') ||
      (normalized === 'aranha da caverna' && e.id === 'cave_spider') ||
      (normalized === 'golem de ferro' && e.id === 'iron_golem') ||
      (normalized === 'vaca' && e.id === 'cow') ||
      (normalized === 'ovelha' && e.id === 'sheep') ||
      (normalized === 'porco' && e.id === 'pig') ||
      (normalized === 'lobo' && e.id === 'wolf') ||
      (normalized === 'galinha' && e.id === 'chicken') ||
      (normalized === 'gato' && e.id === 'cat') ||
      (normalized === 'sapo' && e.id === 'frog') ||
      (normalized === 'cavalo' && e.id === 'horse')
    );
    if (found) {
      setSelectedMob(found);
    }
  };

  const handleEnterClick = () => {
    if (userEmail) {
      if (confirm(t('logout'))) {
        setUserEmail(undefined);
      }
    } else {
      const email = prompt(t('enter_email'), 'Steve@yolocraft.com');
      if (email) setUserEmail(email);
    }
  };

  return (
    <div className="custom-cursor min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary transition-colors duration-200">
      
      {/* Interactive, animated pixelated Minecraft background layer */}
      <MinecraftBackground activeTab={activeTab} />

      {/* Dynamic Minecraft themed glow background for each tab */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-all duration-1000 ${
        activeTab === 'detector' ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.12)_0%,transparent_70%)]' :
        activeTab === 'entidades' ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.12)_0%,transparent_70%)]' :
        activeTab === 'como-funciona' ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.12)_0%,transparent_70%)]' :
        'bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,0.12)_0%,transparent_70%)]'
      }`} />

      {/* Dynamic Minecraft Coordinate trailing block */}
      <div 
        className="fixed w-4 h-4 bg-primary opacity-30 pointer-events-none z-[9999] hidden lg:block border border-black"
        style={{
          left: `${blockCursorPos.x}px`,
          top: `${blockCursorPos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onEnterClick={handleEnterClick} 
        userEmail={userEmail}
        apiStatus={apiStatus}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* TAB 1: DETECTOR (Home Dashboard) */}
        <div className={`space-y-16 animate-fade-in ${activeTab !== 'detector' ? 'hidden' : ''}`}>
            
            {/* Detector Core Module Panel */}
            <DetectorPanel 
              onScanComplete={handleScanComplete} 
              recentScans={scans} 
              externalLoadScan={externalLoadScan}
              onClearExternalLoad={() => setExternalLoadScan(null)}
              onViewMobDetails={handleViewMobDetails}
              apiStatus={apiStatus}
              onViewMethodDetails={(method) => {
                setHowItWorksInitialMethod(method);
                setHowItWorksInitialSubSection('metodos');
                setActiveTab('como-funciona');
              }}
            />

            {/* Bento Grid Info: Scan Features */}
            <section className="w-full">
              <div className="p-6 space-y-3 bg-[#111111] border border-[#333333] relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>

                <div className="flex items-center gap-2 text-secondary">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-display text-base uppercase font-bold tracking-wider">{t('bento2_title')}</h3>
                </div>
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-gray-400">
                  {t('bento2_desc')}
                </p>
              </div>
            </section>

            {/* Recent Scans History Grid */}
            <section className="space-y-8">
              <div className="flex justify-between items-end border-b border-[#222222] pb-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl uppercase text-white font-bold tracking-wider">{t('scan_history')}</h2>
                  <p className="font-mono text-[10px] text-gray-500 uppercase mt-1 tracking-widest">
                    {t('scan_history_sub')}
                  </p>
                </div>
                <div className="flex gap-4">
                  {scans.length > 0 && (
                    <button 
                      onClick={handleClearHistory}
                      className="text-red-400 hover:text-red-300 font-mono text-[11px] uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      [{t('clear_history')}]
                    </button>
                  )}
                </div>
              </div>

              {scans.length === 0 ? (
                <div className="bg-[#111111] border border-[#222222] p-8 text-center text-gray-500 font-mono text-xs">
                  {t('no_history')}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {scans.slice(0, 12).map((scan, idx) => (
                    <div 
                      key={scan.id + '-' + idx}
                      onClick={() => {
                        setExternalLoadScan(scan);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group cursor-pointer hover:border-primary transition-all duration-200 bg-[#111111] border border-[#333333] p-2 relative"
                    >
                      {/* Individual delete item trigger */}
                      <button
                        onClick={(e) => handleDeleteScan(scan.id, e)}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-black/80 hover:bg-red-950 border border-[#333333] hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors cursor-pointer rounded-sm"
                        title={t('delete_scan')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="aspect-square bg-[#161616] flex items-center justify-center overflow-hidden border border-[#222222]">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                          src={scan.imageUrl} 
                          alt={scan.name}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-2 text-center text-[10px] font-mono text-gray-400 font-bold uppercase truncate bg-[#161616] p-1 border border-[#222222]">
                        {translateMob(scan.name)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

        {/* TAB 2: ENTIDADES ENCYCLOPEDIA */}
        <div className={`space-y-8 animate-fade-in ${activeTab !== 'entidades' ? 'hidden' : ''}`}>
            <div className="border-b border-[#222222] pb-6">
              <h1 className="font-display text-3xl sm:text-4xl text-white font-bold uppercase tracking-wider mb-3">
                {t('enc_title')}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                {t('enc_subtitle')}
              </p>
            </div>

            {/* Bestiary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BESTIARY_ENTITIES.map((entity) => (
                <BestiaryCard key={entity.id} entity={getTranslatedMobDetails(entity)} />
              ))}
            </div>
          </div>

        {/* TAB 3: COMO FUNCIONA (Detailed Technical Lab Manual / README specs) */}
        <div className={`animate-fade-in ${activeTab !== 'como-funciona' ? 'hidden' : ''}`}>
          <HowItWorks 
            initialSubSection={howItWorksInitialSubSection}
            initialFocusedMethod={howItWorksInitialMethod}
            onClearFocus={() => {
              setHowItWorksInitialMethod(null);
              setHowItWorksInitialSubSection(undefined);
            }}
          />
        </div>

        {/* TAB 4: CRIADORES */}
        <div className={`space-y-8 animate-fade-in ${activeTab !== 'criadores' ? 'hidden' : ''}`}>
          <div className="border-b border-[#222222] pb-6">
            <h1 className="font-display text-3xl sm:text-4xl text-white font-bold uppercase tracking-wider mb-3">
              {language === 'pt' ? 'Criadores do Projeto' : 'Project Creators'}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              {language === 'pt' 
                ? 'Conheça os acadêmicos responsáveis pela pesquisa, desenvolvimento e implementação do YOLOCraft.'
                : 'Meet the academics responsible for the research, development, and implementation of YOLOCraft.'}
            </p>
          </div>

          {/* Academic Context Alert Box */}
          <div className="bg-[#152e1a]/20 border border-primary/20 p-6 relative space-y-3">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-tr"></div>
            <div className="corner-bracket-bl"></div>
            <div className="corner-bracket-br"></div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest font-bold">
              <BookOpen className="w-4 h-4" />
              <span>{language === 'pt' ? 'Contexto Acadêmico' : 'Academic Context'}</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed">
              {language === 'pt' ? (
                <>
                  Este projeto foi desenvolvido como trabalho prático para a disciplina de{' '}
                  <strong className="text-primary font-semibold">Inteligência Artificial Aplicada à Análise de Imagens e Reconhecimento de Padrões</strong>,
                  ministrada pelo <strong className="text-white">Prof. Dr. Leomar Santos Marques</strong> no Departamento de Física da{' '}
                  <strong className="text-white">Universidade Federal de Lavras (UFLA)</strong>.
                </>
              ) : (
                <>
                  This project was developed as practical work for the course{' '}
                  <strong className="text-primary font-semibold">Artificial Intelligence Applied to Image Analysis and Pattern Recognition</strong>,
                  taught by <strong className="text-white">Prof. Dr. Leomar Santos Marques</strong> at the Department of Physics of the{' '}
                  <strong className="text-white">Federal University of Lavras (UFLA)</strong>.
                </>
              )}
            </p>
            <div className="pt-2 border-t border-[#223326] flex flex-wrap items-center gap-y-2 gap-x-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                  {language === 'pt' ? 'Contato do Professor:' : 'Professor Contact:'}
                </span>
                <a 
                  href="mailto:leomarmarques@ufla.br" 
                  className="font-mono text-xs text-[#aaaaaa] hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  leomarmarques@ufla.br
                </a>
              </div>
              <div className="flex gap-3">
                <a 
                  href="https://github.com/marquesLeomar" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-mono text-[10px] text-[#8b8b8b] hover:text-primary flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#223326] bg-black/40 px-2 py-0.5"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/leomar-santos-marques-417a1562/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-mono text-[10px] text-[#8b8b8b] hover:text-primary flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#223326] bg-black/40 px-2 py-0.5"
                >
                  <Linkedin className="w-3 h-3" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Creator 1 - Pedro */}
            <div className="bg-[#111111] border border-[#333333] p-6 relative flex flex-col justify-between space-y-4">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>
              
              <div className="space-y-2">
                <div className="font-display text-xl font-bold text-primary uppercase tracking-wide">
                  Pedro Henrique Ázara de Almeida
                </div>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                  {language === 'pt' ? 'Estudante de Engenharia Física // UFLA' : 'Physical Engineering Student // UFLA'}
                </div>
                <p className="font-sans text-xs text-gray-400 leading-relaxed pt-2">
                  {language === 'pt'
                    ? 'Atua no projeto liderando o treinamento de redes neurais artificiais YOLO para detecção e integrando modelos de segmentação profunda (como o Segment Anything Model - SAM) a interfaces dinâmicas em ambiente web.'
                    : 'Acts in the project leading the training of YOLO artificial neural networks for detection and integrating deep segmentation models (such as Segment Anything Model - SAM) to dynamic web environment interfaces.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#222222] space-y-3">
                <a 
                  href="mailto:pedrohenriquealmeida2004@gmail.com" 
                  className="font-mono text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors w-max"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>pedrohenriquealmeida2004@gmail.com</span>
                </a>

                <div className="flex gap-4">
                  <a 
                    href="https://github.com/pedroazara" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#8b8b8b] hover:text-primary flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#222222] bg-black/40 px-2.5 py-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/pedroazara" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#8b8b8b] hover:text-primary flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#222222] bg-black/40 px-2.5 py-1"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Creator 2 - Marcos */}
            <div className="bg-[#111111] border border-[#333333] p-6 relative flex flex-col justify-between space-y-4">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <div className="space-y-2">
                <div className="font-display text-xl font-bold text-primary uppercase tracking-wide">
                  Marcos Vinícius Bernardes Marcos Ferreira
                </div>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                  {language === 'pt' ? 'Estudante de Engenharia Física // UFLA' : 'Physical Engineering Student // UFLA'}
                </div>
                <p className="font-sans text-xs text-gray-400 leading-relaxed pt-2">
                  {language === 'pt'
                    ? 'Especializado em engenharia de algoritmos de visão computacional clássica (Otsu, HSV, GrabCut, Watershed) e arquiteto de fluxos de processamento em pipelines hibridizados de segmentação.'
                    : 'Specialized in classical computer vision algorithms engineering (Otsu, HSV, GrabCut, Watershed) and architect of processing flows in hybridized segmentation pipelines.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#222222] space-y-3">
                <a 
                  href="mailto:marcos.ferreira12@estudante.ufla.br" 
                  className="font-mono text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors w-max"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>marcos.ferreira12@estudante.ufla.br</span>
                </a>

                <div className="flex gap-4">
                  <a 
                    href="https://github.com/Bozao-code" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#8b8b8b] hover:text-primary flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#222222] bg-black/40 px-2.5 py-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/marcos-vinicius-a2705536a/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-[11px] text-[#8b8b8b] hover:text-primary flex items-center gap-1.5 transition-colors uppercase tracking-wider border border-[#222222] bg-black/40 px-2.5 py-1"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Global Details Modal */}
          {selectedMob && (
            <BestiaryDetailModal 
              entity={getTranslatedMobDetails(selectedMob)} 
              onClose={() => setSelectedMob(null)} 
            />
          )}

      </main>

      {/* Footer copyright */}
      <Footer onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
