import React, { useState, useEffect } from 'react';
import { ActiveTab, ScanResult, MobEntity } from './types';
import { BESTIARY_ENTITIES, RECENT_SCANS, RESULTS_SCREENSHOT_BOUNDING_BOXES, STATIC_RESULTS_IMAGE } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import BestiaryCard from './components/BestiaryCard';
import DetectorPanel from './components/DetectorPanel';
import BestiaryDetailModal from './components/BestiaryDetailModal';
import { Shield, Brain, Terminal, ChevronRight, BarChart3, AlertTriangle, Eye, Compass, LayoutGrid } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detector');
  const [scans, setScans] = useState<ScanResult[]>(RECENT_SCANS);
  const [hoveredGridCell, setHoveredGridCell] = useState<{ r: number; c: number } | null>(null);
  const [blockCursorPos, setBlockCursorPos] = useState({ x: -100, y: -100 });
  const [userEmail, setUserEmail] = useState<string | undefined>('PedroHenriqueAlmeida2004@gmail.com');
  const [externalLoadScan, setExternalLoadScan] = useState<ScanResult | null>(null);
  const [selectedMob, setSelectedMob] = useState<MobEntity | null>(null);

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
      if (confirm('Deseja deslogar da conta YOLOCraft?')) {
        setUserEmail(undefined);
      }
    } else {
      const email = prompt('Digite seu e-mail de explorador:', 'Steve@yolocraft.com');
      if (email) setUserEmail(email);
    }
  };

  return (
    <div className="custom-cursor min-h-screen flex flex-col justify-between selection:bg-primary selection:text-on-primary transition-colors duration-200">
      
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
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-margin-sm md:px-margin-lg py-12">
        
        {/* TAB 1: DETECTOR (Home Dashboard) */}
        <div className={`space-y-16 animate-fade-in ${activeTab !== 'detector' ? 'hidden' : ''}`}>
            
            {/* Detector Core Module Panel */}
            <DetectorPanel 
              onScanComplete={handleScanComplete} 
              recentScans={scans} 
              externalLoadScan={externalLoadScan}
              onClearExternalLoad={() => setExternalLoadScan(null)}
              onViewMobDetails={handleViewMobDetails}
            />

            {/* Bento Grid Info: Scan Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 col-span-1 md:col-span-2 space-y-4 bg-[#111111] border border-[#333333] relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>

                <div className="flex items-center gap-3 text-primary">
                  <Shield className="w-6 h-6" />
                  <h3 className="font-display text-xl uppercase font-bold tracking-wider">Análise Espacial Avançada</h3>
                </div>
                <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed">
                  Nosso algoritmo do YOLOCraft detecta múltiplos mobs mesmo em áreas de densa folhagem ou cavernas profundas. Receba feedback em tempo real com probabilidade de drops de pólvora, teia, flechas ou carne podre de pixels brutos filtrados do HUD.
                </p>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <div className="h-1 bg-primary"></div>
                  <div className="h-1 bg-primary"></div>
                  <div className="h-1 bg-primary/40"></div>
                  <div className="h-1 bg-primary/10"></div>
                </div>
              </div>

              <div className="p-6 space-y-3 bg-[#111111] border border-[#333333] relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>

                <div className="flex items-center gap-2 text-secondary">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-display text-base uppercase font-bold tracking-wider">Auto-Loot Predict</h3>
                </div>
                <p className="font-sans text-xs leading-relaxed text-gray-400">
                  Preveja os espólios de drops potenciais com base nos encantamentos atuais do jogador e variantes de mobs detectadas a até 16 chunks de distância.
                </p>
              </div>
            </section>

            {/* Recent Scans History Grid */}
            <section className="space-y-8">
              <div className="flex justify-between items-end border-b border-[#222222] pb-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl uppercase text-white font-bold tracking-wider">Varreduras Recentes</h2>
                  <p className="font-mono text-[10px] text-gray-500 uppercase mt-1 tracking-widest">
                    Histórico das últimas sondas ativas de Redstone
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('stats')}
                  className="text-primary font-mono text-[11px] uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Ver Todos Relatórios →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {scans.slice(0, 6).map((scan, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setExternalLoadScan(scan);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group cursor-pointer hover:border-primary transition-all duration-200 bg-[#111111] border border-[#333333] p-2"
                  >
                    <div className="aspect-square bg-[#161616] flex items-center justify-center overflow-hidden border border-[#222222]">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                        src={scan.imageUrl} 
                        alt={scan.name}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-2 text-center text-[10px] font-mono text-gray-400 font-bold uppercase truncate bg-[#161616] p-1 border border-[#222222]">
                      {scan.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Stats Foot */}
            <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#222222] text-center bg-[#111111] border border-[#333333]">
              <div className="p-6 space-y-1">
                <div className="text-primary text-3xl font-display font-bold">1.2M+</div>
                <div className="font-mono uppercase text-[10px] text-gray-500 tracking-wider">Mobs Escaneados</div>
              </div>
              <div className="p-6 space-y-1">
                <div className="text-primary text-3xl font-display font-bold">99.8%</div>
                <div className="font-mono uppercase text-[10px] text-gray-500 tracking-wider">Precisão de Detecção</div>
              </div>
              <div className="p-6 space-y-1">
                <div className="text-primary text-3xl font-display font-bold">4ms</div>
                <div className="font-mono uppercase text-[10px] text-gray-500 tracking-wider">Tempo de Inferência</div>
              </div>
            </section>

          </div>

        {/* TAB 2: ENTIDADES ENCYCLOPEDIA */}
        <div className={`space-y-8 animate-fade-in ${activeTab !== 'entidades' ? 'hidden' : ''}`}>
            <div className="border-b border-[#222222] pb-6">
              <h1 className="font-display text-3xl sm:text-4xl text-white font-bold uppercase tracking-wider mb-3">
                ENCICLOPÉDIA DE ENTIDADES
              </h1>
              <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                A Rede Neural YOLO-VOXEL catalogou as seguintes entidades com base no treinamento de Redstone. A precisão de segmentação é validada através de 40.000 quadros de voxels únicos no bioma Overworld.
              </p>
            </div>

            {/* Bestiary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BESTIARY_ENTITIES.map((entity) => (
                <BestiaryCard key={entity.id} entity={entity} />
              ))}
            </div>
          </div>

        {/* TAB 3: COMO FUNCIONA (Blueprints) */}
        <div className={`space-y-12 animate-fade-in ${activeTab !== 'como-funciona' ? 'hidden' : ''}`}>
            {/* Blueprint introduction block */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="font-display text-3xl sm:text-4xl uppercase font-bold tracking-wider leading-none text-white">
                  OLHE <span className="text-primary">APENAS UMA VEZ</span>
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Já se perguntou como o algoritmo YOLO-VOXEL detecta um Creeper escondido na grama alta ou atrás de pedregulhos antes dele detonar? Não é mágica de poção — é lógica pura de passo único. Nossa rede neural processa a chunk inteira em um único tick de renderização do jogo.
                </p>
                <button 
                  onClick={() => setActiveTab('detector')}
                  className="px-5 py-3 bg-[#111111] hover:bg-primary border border-[#333333] hover:border-primary text-gray-300 hover:text-black font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-3 cursor-pointer transition-all duration-200"
                >
                  <Terminal className="w-4 h-4" />
                  <span>INICIALIZAR VARREDURA EM TEMPO REAL</span>
                </button>
              </div>

              {/* Dynamic pulse dither container */}
              <div className="relative h-64 border border-[#333333] bg-[#111111] overflow-hidden flex items-center justify-center">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-36 h-36 border border-primary border-dashed opacity-50 redstone-pulse flex items-center justify-center">
                    <span className="font-mono text-[10px] text-primary font-bold tracking-widest">GRID_LOCK: ATIVO</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Blueprint steps list */}
            <section className="space-y-8">
              <h2 className="font-display text-lg uppercase text-white font-bold tracking-wider border-l-2 border-primary pl-3">
                Planta da Arquitetura Neural
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Passo 1 */}
                <div className="p-6 bg-[#111111] border border-[#333333] flex flex-col justify-between relative">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-tr"></div>
                  <div className="corner-bracket-bl"></div>
                  <div className="corner-bracket-br"></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-primary font-bold tracking-wider">PASSO 01</span>
                      <Eye className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-display text-base uppercase text-white font-bold tracking-wider mb-3">Entrada Bruta Texturizada</h3>
                    <div className="h-36 bg-black mb-4 border border-[#222222] overflow-hidden">
                      <img 
                        className="w-full h-full object-cover opacity-60" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQyR4UfDyQUrX-SlWKILrGAZ3nVrY7K5ktanmMRUbEFBkIUUT5mSROYpuwQ7JnyZxZeHTM7LCdSylDwQklYqwhltxq2kh0vHX5G_PZv56bAWDDpCRcQ4rZLRKuF4j3w2h_4T2Vkuuu2lZl4H8fmpo8kxzE0pv8pRA5rNUbdfYT_vdzB9ciaExVuIH5zQ1oX0u2Znhfb6nzf9Z4O-YFFuEuLGL0xjTP9ZJvXMXA7z68ppZIESoCLfQuGmGX_y1p9nR97L21b5UUe_M" 
                        alt="Visão Voxel" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed">
                      O sensor do YOLOCraft captura a tela cheia como uma única matriz de textura voxelizada de 1024x1024. Sem subdivisões lentas ou atalhos de renderização.
                    </p>
                  </div>
                </div>

                {/* Passo 2: Interactive Grid matrix */}
                <div className="p-6 bg-[#111111] border border-[#333333] flex flex-col justify-between relative">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-tr"></div>
                  <div className="corner-bracket-bl"></div>
                  <div className="corner-bracket-br"></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-primary font-bold tracking-wider">PASSO 02</span>
                      <LayoutGrid className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-display text-base uppercase text-white font-bold tracking-wider mb-3">Divisão Espacial em Grade</h3>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed mb-4">
                      Dividimos a viewport em uma grade S x S (padrão 13x13). Cada coordenada de bloco é responsável por delimitar o centróide do mob mapeado.
                    </p>

                    {/* Interactive Grid Map */}
                    <div className="bg-black border border-[#222222] p-2 aspect-video flex flex-col justify-between">
                      <div className="grid grid-cols-8 gap-1 h-32">
                        {Array.from({ length: 32 }).map((_, i) => {
                          const r = Math.floor(i / 8);
                          const c = i % 8;
                          const isHovered = hoveredGridCell?.r === r && hoveredGridCell?.c === c;
                          return (
                            <div 
                              key={i}
                              onMouseEnter={() => setHoveredGridCell({ r, c })}
                              onMouseLeave={() => setHoveredGridCell(null)}
                              className={`border transition-colors duration-100 ${
                                isHovered ? 'bg-primary/25 border-primary' : 'bg-[#222222]/20 border-[#222222]/50'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="font-mono text-[9px] text-primary flex justify-between uppercase mt-2 tracking-wider">
                        <span>Status: GRID_LOCK ATIVO</span>
                        <span>Coordenadas: {hoveredGridCell ? `X: ${hoveredGridCell.r * 16} Z: ${hoveredGridCell.c * 16}` : 'APONTANDO...'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="p-6 bg-[#111111] border border-[#333333] flex flex-col justify-between relative">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-tr"></div>
                  <div className="corner-bracket-bl"></div>
                  <div className="corner-bracket-br"></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-primary font-bold tracking-wider">PASSO 03</span>
                      <Terminal className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-display text-base uppercase text-white font-bold tracking-wider mb-3">Rede de Repetidores Redstone</h3>
                    <div className="flex flex-wrap gap-2 items-center justify-center p-6 bg-black border border-[#222222] mb-4 font-mono text-[9px] text-gray-500">
                      <div className="p-2 border border-[#222222] bg-[#111111] tracking-wider uppercase">COMPILADOR</div>
                      <span className="text-primary font-bold">→</span>
                      <div className="p-2 border border-primary bg-primary/10 text-primary font-bold tracking-wider uppercase">REPETIDOR x24</div>
                      <span className="text-primary font-bold">→</span>
                      <div className="p-2 border border-[#222222] bg-[#111111] tracking-wider uppercase">SAÍDA_VOXEL</div>
                    </div>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed">
                      Utilizamos 24 camadas convolucionais sequenciadas por barramentos de conexões totalmente integradas. Funciona como uma rede interconectada de repetidores de Redstone que purga dados espúrios de blocos inertes.
                    </p>
                  </div>
                </div>

                {/* Passo 4 */}
                <div className="p-6 bg-[#111111] border border-[#333333] flex flex-col justify-between relative">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-tr"></div>
                  <div className="corner-bracket-bl"></div>
                  <div className="corner-bracket-br"></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-primary font-bold tracking-wider">PASSO 04</span>
                      <Compass className="w-4 h-4 text-gray-500" />
                    </div>
                    <h3 className="font-display text-base uppercase text-white font-bold tracking-wider mb-3">Delimitação de Bounding Boxes</h3>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed mb-4">
                      Geramos pontuações de confiança por segmento mapeado. Bounding boxes acima da tolerância são instantaneamente projetadas no HUD óptico do explorador.
                    </p>
                    <div className="space-y-3 font-mono text-[10px] bg-black p-4 border border-[#222222]">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="tracking-wider">CREEPER</span>
                          <span className="text-primary font-bold">80% CONFIANÇA</span>
                        </div>
                        <div className="h-1.5 bg-[#222222] p-0.5">
                          <div className="h-full bg-primary" style={{ width: '80%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="tracking-wider text-gray-500">GALINHA</span>
                          <span className="text-secondary font-bold">20% CONFIANÇA</span>
                        </div>
                        <div className="h-1.5 bg-[#222222] p-0.5">
                          <div className="h-full bg-secondary" style={{ width: '20%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Redstone code syntax highlights */}
            <section className="p-8 relative overflow-hidden bg-[#111111] border border-[#333333]">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/40" />
              
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-4">
                  <h2 className="font-display text-xl uppercase font-bold text-white tracking-wider">A Regra do "Passo Único"</h2>
                  <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Mapeadores ultrapassados analisam milhares de regiões da tela individualmente — o que equivale a bater em cada bloco de terra um por um. O YOLOCraft observa o campo inteiro de visão uma única vez. É a diferença brutal entre puxar uma alavanca de pistão manual ou configurar um clock repetidor de Redstone infinito.
                  </p>
                  <div className="bg-black border border-[#222222] p-4 font-mono text-xs text-secondary tracking-widest">
                    COMANDO: /execute as @model run scan_chunk ~ ~ ~
                  </div>
                </div>
              </div>
            </section>
          </div>

        {/* TAB 4: STATISTICS & HISTORICAL SCAN ANALYZER */}
        <div className={`space-y-12 animate-fade-in ${activeTab !== 'stats' ? 'hidden' : ''}`}>
            <div className="border-b border-[#222222] pb-6">
              <h1 className="font-display text-3xl sm:text-4xl text-white font-bold uppercase tracking-wider mb-3">
                Painel Estatístico de Varreduras
              </h1>
              <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
                Acompanhe o tráfego de entidades catalogadas pelas suas sondas analíticas. Escolha e clique em qualquer registro do banco de dados local para re-escanear no visor óptico principal do detector.
              </p>
            </div>

            {/* Distribution metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#111111] p-6 border border-[#333333] text-center space-y-3 relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>
                <span className="font-mono text-[10px] text-gray-500 uppercase block tracking-wider">Precisão Geral</span>
                <span className="text-3xl font-display text-primary font-bold">98.4%</span>
                <div className="h-1 bg-[#222222] overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '98.4%' }} />
                </div>
              </div>

              <div className="bg-[#111111] p-6 border border-[#333333] text-center space-y-3 relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>
                <span className="font-mono text-[10px] text-gray-500 uppercase block tracking-wider">Ameaças Evitadas</span>
                <span className="text-3xl font-display text-secondary font-bold">8,432</span>
                <div className="h-1 bg-[#222222] overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '84%' }} />
                </div>
              </div>

              <div className="bg-[#111111] p-6 border border-[#333333] text-center space-y-3 relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>
                <span className="font-mono text-[10px] text-gray-500 uppercase block tracking-wider">Chunks Mapeadas</span>
                <span className="text-3xl font-display text-primary font-bold">14,290</span>
                <div className="h-1 bg-[#222222] overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '91%' }} />
                </div>
              </div>

              <div className="bg-[#111111] p-6 border border-[#333333] text-center space-y-3 relative">
                <div className="corner-bracket-tl"></div>
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-bl"></div>
                <div className="corner-bracket-br"></div>
                <span className="font-mono text-[10px] text-gray-500 uppercase block tracking-wider">Estado do Loop</span>
                <span className="text-xl font-mono text-secondary font-bold uppercase tracking-wider">ESTÁVEL</span>
                <div className="h-1 bg-[#222222] overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Historical Scan Reports list with load handles */}
            <div className="bg-[#111111] border border-[#333333] p-6 relative">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <h3 className="font-display text-lg uppercase text-primary font-bold tracking-wider mb-6 flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                <span>Arquivo Histórico de Chunks Analisadas</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#222222] text-gray-500">
                      <th className="p-3 tracking-wider">IDENTIFICADOR</th>
                      <th className="p-3 tracking-wider">HORÁRIO DA SONDA</th>
                      <th className="p-3 tracking-wider">PROFUNDIDADE</th>
                      <th className="p-3 tracking-wider">NÍVEL DE CRITICIDADE</th>
                      <th className="p-3 tracking-wider">CONFIABILIDADE</th>
                      <th className="p-3 text-right tracking-wider">AÇÃO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222] border-b border-[#222222]">
                    {scans.map((scan, index) => (
                      <tr key={index} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3 font-bold text-white">{scan.name}</td>
                        <td className="p-3 text-gray-400">{scan.timestamp}</td>
                        <td className="p-3 text-gray-400">{scan.depth}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold border tracking-wider ${
                            scan.threatLevel === 'CRÍTICO' ? 'bg-red-950/10 border-red-500/30 text-red-400' :
                            scan.threatLevel === 'ALTO' ? 'bg-amber-950/10 border-amber-500/30 text-amber-400' :
                            'bg-emerald-950/10 border-primary/30 text-primary'
                          }`}>
                            {scan.threatLevel}
                          </span>
                        </td>
                        <td className="p-3 text-primary font-bold">
                          {scan.boundingBoxes[0]?.confidence || 90}%
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setExternalLoadScan(scan);
                              setActiveTab('detector');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-[#161616] hover:bg-primary hover:text-black text-gray-300 font-bold px-3 py-1 text-[10px] uppercase border border-[#333333] hover:border-primary transition-all cursor-pointer"
                          >
                            RE-ANALISAR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Global Details Modal */}
          <BestiaryDetailModal 
            entity={selectedMob} 
            onClose={() => setSelectedMob(null)} 
          />

      </main>

      {/* Footer copyright */}
      <Footer />
    </div>
  );
}
