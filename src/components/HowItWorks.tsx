import React, { useState } from 'react';
import { 
  BookOpen, 
  Database, 
  FolderTree, 
  Cpu, 
  Terminal, 
  CheckSquare, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  ListFilter,
  Play,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HowItWorksProps {
  initialSubSection?: 'visao-geral' | 'dataset' | 'yolo-redes' | 'metodos' | 'estrutura' | 'modelo' | 'instalacao' | 'roadmap';
  initialFocusedMethod?: 'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed' | null;
  onClearFocus?: () => void;
}

type SubSection = 'visao-geral' | 'dataset' | 'yolo-redes' | 'metodos' | 'estrutura' | 'modelo' | 'instalacao' | 'roadmap';

export default function HowItWorks({
  initialSubSection,
  initialFocusedMethod,
  onClearFocus
}: HowItWorksProps = {}) {
  const [activeSubSection, setActiveSubSection] = useState<SubSection>('visao-geral');
  const [selectedMethod, setSelectedMethod] = useState<'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed'>('sam');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  React.useEffect(() => {
    if (initialFocusedMethod) {
      setSelectedMethod(initialFocusedMethod);
    }
  }, [initialFocusedMethod]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navItems = [
    { id: 'visao-geral' as SubSection, label: 'Visão Geral', icon: BookOpen },
    { id: 'dataset' as SubSection, label: 'Dataset & Classes', icon: Database },
    { id: 'yolo-redes' as SubSection, label: 'YOLO & Redes', icon: Brain },
    { id: 'metodos' as SubSection, label: 'Métodos de Segmentação', icon: Layers },
    { id: 'estrutura' as SubSection, label: 'Estrutura do Projeto', icon: FolderTree },
    { id: 'modelo' as SubSection, label: 'Estado do Modelo', icon: Cpu },
    { id: 'instalacao' as SubSection, label: 'Instalação & Guia', icon: Terminal },
    { id: 'roadmap' as SubSection, label: 'Roadmap', icon: CheckSquare },
  ];

  const codeBlocks = {
    clone: `git clone https://github.com/seu-usuario/YOLOCraft.git
cd YOLOCraft`,
    venv: `# Criar ambiente virtual
python -m venv .venv

# Ativar no Linux / macOS
source .venv/bin/activate

# Ativar no Windows
.venv\\Scripts\\activate`,
    deps: `pip install -r requirements.txt`,
    kaggle: `# Autenticar no terminal
kaggle auth login`,
    download: `python scripts/download_dataset.py`,
    train: `python -m src.train_with_logging`,
    inference: `# Iniciar API de inferência (FastAPI)
uvicorn src.api:app --reload --port 8000

# Iniciar App Desktop de teste (PyQt6)
python -m src.detector_gui`
  };

  const curatedClasses = [
    'cave_spider', 'creeper', 'enderman', 'skeleton', 
    'slime', 'spider', 'zombie', 'iron_golem', 
    'wolf', 'cat', 'chicken', 'cow', 
    'frog', 'horse', 'pig', 'sheep'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
      {/* Sidebar Sub-Navigation */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-sm mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider text-primary">MANUAL TECNICO</span>
          </div>
          <p className="text-gray-400 text-xs font-sans leading-relaxed">
            Explore a documentação do projeto, estrutura de pastas, dataset, estado de treino e guias práticos do YOLOCraft.
          </p>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubSection(item.id)}
                className={`flex items-center gap-2.5 px-4 py-3 font-minecraft text-xs select-none cursor-pointer text-left whitespace-nowrap transition-all duration-150 border-l-2 w-full ${
                  isActive
                    ? 'text-primary bg-[#1e3f22]/20 border-primary'
                    : 'text-[#aaaaaa] hover:text-white bg-[#111111]/40 hover:bg-[#161616] border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-9 bg-[#111111] border border-[#222222] p-6 sm:p-8 relative min-h-[500px]">
        <div className="corner-bracket-tl"></div>
        <div className="corner-bracket-tr"></div>
        <div className="corner-bracket-bl"></div>
        <div className="corner-bracket-br"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* SUB-SECTION 1: VISÃO GERAL */}
            {activeSubSection === 'visao-geral' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>VISAO GERAL DO PROJETO</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">Introdução, pipeline YOLO + SAM e objetivos acadêmicos</p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                  <strong className="text-white block mb-2 font-display text-sm tracking-wider">O que e o YOLOCraft?</strong>
                  YOLOCraft identifica automaticamente mobs do Minecraft em imagens e gera máscaras de segmentação com precisão cirúrgica de pixels. O sistema integra inteligência de localização de objetos de alta velocidade com um segmentador universal de forma livre.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-[#161616] border border-[#262626] rounded-sm space-y-3">
                    <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase">
                      <ChevronRight className="w-4 h-4" />
                      <span>Pipeline Integrado</span>
                    </div>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed">
                      Um modelo <strong className="text-white">YOLO (You Only Look Once)</strong> detecta instantaneamente a classe e a caixa delimitadora (bounding box) de cada criatura. Logo depois, o <strong className="text-white">SAM (Segment Anything Model)</strong> usa essa caixa como prompt espacial para delimitar e mascarar o corpo do mob pixel por pixel.
                    </p>
                  </div>

                  <div className="p-5 bg-[#161616] border border-[#262626] rounded-sm space-y-3">
                    <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase">
                      <Sparkles className="w-4 h-4" />
                      <span>Sem Treino de Máscara</span>
                    </div>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed">
                      O SAM é pré-treinado e generaliza perfeitamente para formas geométricas e texturas customizadas. Isso elimina a necessidade de fazer o treinamento manual ou exaustivo do zero para segmentação por instância!
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-display text-sm font-bold tracking-wider text-white border-l-2 border-primary pl-2 uppercase">
                    Objetivos Praticos de Estudo
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Visao Computacional", desc: "Aplicação de técnicas avançadas de imagem e extração de contornos em ambientes virtuais de jogos." },
                      { title: "Deteccao de Objetos (YOLO)", desc: "Treinamento, varredura de thresholds de confiança e avaliação quantitativa de bounding boxes." },
                      { title: "Segmentacao por Instancia", desc: "Integração híbrida de YOLO + SAM para mapear geometrias voxelizadas complexas sem latência." },
                      { title: "Engenharia de Pipelines ML", desc: "Estruturação limpa de conversores, registradores automáticos de logs e criação de APIs de inferência." }
                    ].map((obj, idx) => (
                      <div key={idx} className="p-4 bg-[#121212] border border-[#222222] hover:border-[#333333] transition-colors rounded-sm space-y-1">
                        <span className="font-mono text-[9px] text-primary block">MÓDULO 0{idx+1}</span>
                        <h4 className="font-display text-xs font-bold text-white uppercase">{obj.title}</h4>
                        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">{obj.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-display text-sm font-bold tracking-wider text-white border-l-2 border-primary pl-2 uppercase">
                    Tecnologias de Ponta Utilizadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python", "PyTorch", "Ultralytics YOLO", "Segment Anything (SAM)", 
                      "FastAPI / Uvicorn", "PyQt6", "OpenCV", "NumPy", 
                      "Pandas", "Matplotlib", "Kaggle CLI", "Git & GitHub"
                    ].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-[#161616] border border-[#2e2e2e] font-mono text-[10px] text-gray-300 rounded-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 2: DATASET */}
            {activeSubSection === 'dataset' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <Database className="w-5 h-5 text-primary" />
                    <span>DATASET & CURADORIA</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">Amostragem de imagens, classes mapeadas e links oficiais</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#141414] border border-[#222222] text-center space-y-1">
                    <span className="font-mono text-[10px] text-gray-500 uppercase">Dataset de Origem</span>
                    <span className="text-lg font-display text-white font-bold block">Minecraft Mobs</span>
                  </div>
                  <div className="p-4 bg-[#141414] border border-[#222222] text-center space-y-1">
                    <span className="font-mono text-[10px] text-gray-500 uppercase">Volume Bruto</span>
                    <span className="text-lg font-display text-primary font-bold block">+27.000 Imagens</span>
                  </div>
                  <div className="p-4 bg-[#141414] border border-[#222222] text-center space-y-1">
                    <span className="font-mono text-[10px] text-gray-500 uppercase">Variabilidade Bruta</span>
                    <span className="text-lg font-display text-secondary font-bold block">87 Classes</span>
                  </div>
                </div>

                <div className="p-4 bg-[#161616] border border-[#262626] rounded-sm space-y-3">
                  <h3 className="font-display text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span>Anotações e Metadados</span>
                  </h3>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    As anotações brutas incluem bounding boxes normalizadas no arquivo CSV original, juntamente com metadados detalhados de cena, tais como clima do mundo, nível de luz, distância de renderização e profundidade relativa. O conversor <code className="text-white px-1 py-0.5 bg-black rounded-sm text-[11px] font-mono">convert_dataset.py</code> traduz as coordenadas normalizadas diretamente para o formato de treino padrão esperado pelo YOLO.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-xs font-bold text-white tracking-wider uppercase">
                      Subconjunto Curado (Apresentação - 16 Classes)
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-[#1e3f22]/30 text-primary border border-primary/20">
                      Curado via dataset_manager.py
                    </span>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed mb-3">
                    Para otimizar o treinamento do modelo de apresentação e viabilizar inferências rápidas em tempo real, selecionamos um grupo equilibrado de 16 classes representativas:
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                    {curatedClasses.map((item) => (
                      <div key={item} className="p-2 bg-[#141414] border border-[#222222] hover:border-primary/40 text-gray-300 rounded-sm flex items-center gap-1.5 transition-colors">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222222] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs font-sans text-gray-400 text-center sm:text-left">
                    O dataset oficial está hospedado e disponível publicamente na plataforma Kaggle.
                  </div>
                  <a 
                    href="https://www.kaggle.com/datasets/pierreayfri/minecraft-mobs/data" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-primary border border-[#333333] hover:border-primary text-gray-300 hover:text-black font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  >
                    <span>ACESSAR DATASET KAGGLE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* SUB-SECTION: YOLO & REDES NEURAIS */}
            {activeSubSection === 'yolo-redes' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>ENTENDENDO REDES NEURAIS E YOLO</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">O motor de Deep Learning por trás da detecção de mobs</p>
                </div>

                {/* Bloco 1: O que é uma Rede Neural */}
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-bold tracking-wider text-white border-l-2 border-primary pl-2 uppercase">
                    1. O que e uma Rede Neural Artificial?
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Uma <strong>Rede Neural Artificial</strong> é um modelo matemático computacional inspirado na estrutura neuronal do cérebro biológico. Ela foi concebida para aprender e aproximar funções complexas, reconhecendo padrões intrínsecos em grandes volumes de dados (como imagens de jogos).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-[#141414] border border-[#222222] rounded-sm space-y-2">
                      <div className="text-primary font-mono text-[10px] font-bold uppercase tracking-wider">Neurônios e Pesos</div>
                      <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
                        Cada neurônio recebe entradas (características ou pixels), multiplica-as por <strong>Pesos (weights)</strong> ajustáveis e adiciona um <strong>Viés (bias)</strong>. Os pesos determinam a importância de cada sinal de entrada no resultado final.
                      </p>
                    </div>
                    <div className="p-4 bg-[#141414] border border-[#222222] rounded-sm space-y-2">
                      <div className="text-secondary font-mono text-[10px] font-bold uppercase tracking-wider">Funções de Ativação</div>
                      <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
                        Para que a rede possa aprender padrões não lineares (como curvas, formas orgânicas e mobs voxelizados complexos), a saída de cada neurônio passa por uma <strong>Função de Ativação</strong> (ex: ReLU, SiLU).
                      </p>
                    </div>
                    <div className="p-4 bg-[#141414] border border-[#222222] rounded-sm space-y-2">
                      <div className="text-primary font-mono text-[10px] font-bold uppercase tracking-wider">Filtros Convolucionais</div>
                      <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
                        Em imagens, usamos <strong>Camadas Convolucionais (CNNs)</strong>. Elas deslizam filtros pequenos sobre a imagem, aprendendo primeiro a extrair bordas simples, depois texturas e, finalmente, formas complexas como braços de Zombies e olhos de Creepers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bloco 2: Como Funciona o YOLO */}
                <div className="space-y-4 pt-4 border-t border-[#222222]">
                  <h3 className="font-display text-sm font-bold tracking-wider text-white border-l-2 border-primary pl-2 uppercase">
                    2. O Algoritmo YOLO — You Only Look Once
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Antes do algoritmo <strong>YOLO (Você Só Olha Uma Vez)</strong>, os sistemas de visão computacional detectavam objetos usando abordagens baseadas em propostas de regiões (como R-CNN), as quais selecionavam milhares de fatias da imagem e as processavam individualmente. Isso gerava uma latência absurda, inviabilizando aplicações em tempo real.
                  </p>

                  <div className="p-5 bg-black/60 border border-[#222222] rounded-sm space-y-4">
                    <div className="flex items-center gap-2 text-[#4ade80]">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      <span className="font-display text-xs font-bold uppercase tracking-wider">Logica de Passo Unico (Single-Pass Model)</span>
                    </div>
                    
                    <p className="font-sans text-xs text-gray-300 leading-relaxed">
                      O YOLO reestruturou a detecção de objetos como um único problema de regressão matemática direta. A imagem de entrada é dividida em uma grade (ex: <code className="text-white bg-black/80 px-1 font-mono text-[11px]">S x S</code>). A rede analisa a imagem <strong>uma única vez</strong> e prevê simultaneamente:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 text-xs font-mono">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-primary font-bold">▪</span>
                        <span>Coordenadas das caixas (Bounding Boxes)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-primary font-bold">▪</span>
                        <span>Probabilidade de classe por objeto</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-primary font-bold">▪</span>
                        <span>Pontuação de Confiança (Confidence Score)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-primary font-bold">▪</span>
                        <span>Contornos poligonais (Segmentação SAM)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bloco 3: Ultralytics Credits */}
                <div className="p-6 bg-primary/5 border border-primary/20 relative rounded-sm space-y-4 pt-6 mt-6">
                  <div className="corner-bracket-tl"></div>
                  <div className="corner-bracket-tr"></div>
                  <div className="corner-bracket-bl"></div>
                  <div className="corner-bracket-br"></div>

                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                    <h3 className="font-display text-sm font-bold text-white tracking-wider uppercase">
                      CREDITOS OFICIAIS: ULTRALYTICS
                    </h3>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed">
                    O pipeline de detecção e segmentação rápida de mobs do <strong>YOLOCraft</strong> é viabilizado pelo poder dos modelos desenvolvidos e mantidos de forma brilhante pela <strong>Ultralytics</strong>. 
                  </p>
                  
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    A Ultralytics é líder de mercado e pioneira em pesquisa de visão computacional, sendo a criadora e mantenedora oficial da arquitetura do <strong>YOLOv8</strong>, que implementa detecção, rastreamento de instâncias, classificação e segmentação em tempo real com excelente portabilidade para dispositivos periféricos e servidores em nuvem.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <a 
                      href="https://ultralytics.com" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-primary border border-[#333333] hover:border-primary text-gray-300 hover:text-black font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
                    >
                      <span>PÁGINA DA ULTRALYTICS</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    
                    <a 
                      href="https://github.com/ultralytics/ultralytics" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-secondary border border-[#333333] hover:border-secondary text-gray-300 hover:text-black font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
                    >
                      <span>GITHUB DA ULTRALYTICS</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION: MÉTODOS DE SEGMENTAÇÃO */}
            {activeSubSection === 'metodos' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <span>MÉTODOS DE SEGMENTAÇÃO</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">
                    Modo Automático (Deep Learning) e Comparação de 4 Métodos Clássicos
                  </p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                  Nosso sistema oferece <strong className="text-white">5 métodos</strong> de segmentação de imagem, divididos em dois grupos: um método baseado em deep learning (automático) e quatro métodos clássicos de visão computacional (configuráveis, para fins comparativos).
                  <br /><br />
                  Todos os métodos partem do mesmo ponto de partida — a <strong className="text-white">caixa delimitadora (bounding box)</strong> detectada pelo YOLO — e todos devolvem a resposta no mesmo formato: <code className="text-primary font-mono bg-black/40 px-1 py-0.5 border border-[#222222]">class</code>, <code className="text-primary font-mono bg-black/40 px-1 py-0.5 border border-[#222222]">confidence</code>, <code className="text-primary font-mono bg-black/40 px-1 py-0.5 border border-[#222222]">box</code> e <code className="text-primary font-mono bg-black/40 px-1 py-0.5 border border-[#222222]">polygon</code>. Isso permite comparar os 5 métodos lado a lado sobre a mesma detecção.
                </div>

                {/* Method selector tabs inside help page */}
                <div className="grid grid-cols-5 gap-1.5 bg-[#161616] p-1 border border-[#222222]">
                  {(['sam', 'otsu', 'hsv', 'grabcut', 'watershed'] as const).map((methodKey) => {
                    const label = methodKey === 'sam' ? 'SAM (IA)' :
                                  methodKey === 'otsu' ? 'Otsu' :
                                  methodKey === 'hsv' ? 'HSV' :
                                  methodKey === 'grabcut' ? 'GrabCut' : 'Watershed';
                    const isSelected = selectedMethod === methodKey;
                    return (
                      <button
                        key={methodKey}
                        onClick={() => setSelectedMethod(methodKey)}
                        className={`py-2 px-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-[#1e1e1e] text-primary shadow-[0_0_8px_rgba(238,195,12,0.15)]'
                            : 'border-transparent text-gray-400 hover:text-white hover:bg-black/20'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Method Details Panel */}
                <div className="p-5 bg-[#141414] border border-[#222222] rounded-sm space-y-4 animate-fade-in">
                  {selectedMethod === 'sam' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                        <span className="font-display text-sm font-bold text-primary tracking-wider uppercase">SAM (MobileSAM) — Deep Learning</span>
                        <span className="font-mono text-[8px] bg-[#1e3f22]/30 text-primary px-2 py-0.5 border border-primary/20">AUTOMÁTICO</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">
                        <strong>Endpoint:</strong> <code className="bg-black text-[#4ADE80] px-1.5 py-0.5 font-bold">POST /predict</code>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        O YOLO primeiro detecta o objeto e gera uma caixa delimitadora. Essa caixa é usada como <em>prompt</em> (indicação espacial) para o <strong>SAM (Segment Anything Model)</strong>, na sua versão leve <strong>MobileSAM</strong>, que gera a máscara de segmentação do objeto.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        Por ser uma rede neural já treinada para segmentação genérica, esse método não exige nenhum ajuste manual de parâmetros — basta a caixa do YOLO como entrada, e o modelo já entrega o contorno do objeto.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-[#4ADE80] font-bold uppercase">Vantagens</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Alta qualidade de máscara, robusto a variações de iluminação, cor e textura, sem necessidade de calibração manual.
                          </p>
                        </div>
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-red-400 font-bold uppercase">Desvantagens</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Mais pesado computacionalmente que os métodos clássicos, e funciona como uma "caixa-preta" (menos interpretável).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'otsu' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                        <span className="font-display text-sm font-bold text-sky-400 tracking-wider uppercase">Otsu Thresholding</span>
                        <span className="font-mono text-[8px] bg-sky-950/40 text-sky-400 px-2 py-0.5 border border-sky-500/20">CLÁSSICO</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">
                        <strong>Endpoint:</strong> <code className="bg-black text-[#4ADE80] px-1.5 py-0.5 font-bold">POST /predict/classic?method=otsu</code>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        <strong>Ideia:</strong> aplica o <strong>método de limiarização automática de Otsu</strong> sobre o canal de <strong>saturação (S)</strong> do espaço de cor <strong>HSV</strong>, dentro da Região de Interesse (ROI).
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        O algoritmo de Otsu busca o valor de limiar (threshold) que melhor separa os pixels em dois grupos (objeto e fundo), minimizando a variância dentro de cada grupo. Como é aplicado no canal de saturação, funciona extremamente bem quando o objeto tem uma saturação de cor visivelmente diferente do fundo.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-sky-400 font-bold uppercase">Bom Para</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Objetos com cor bem saturada e viva contra fundo neutro/dessaturado ou tons de cinza.
                          </p>
                        </div>
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-red-400 font-bold uppercase">Limitações</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Altamente sensível a fundos com saturação ou tonalidade de cor semelhante à do objeto detectado.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'hsv' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                        <span className="font-display text-sm font-bold text-emerald-400 tracking-wider uppercase">HSV (Distância de Cor)</span>
                        <span className="font-mono text-[8px] bg-emerald-950/40 text-emerald-400 px-2 py-0.5 border border-emerald-500/20">CLÁSSICO</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">
                        <strong>Endpoint:</strong> <code className="bg-black text-[#4ADE80] px-1.5 py-0.5 font-bold">POST /predict/classic?method=hsv</code>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        <strong>Ideia:</strong> estima a cor do <strong>fundo</strong> dentro da ROI e depois compara a cor de <strong>cada pixel</strong> com esse fundo estimado, usando uma métrica de distância semelhante a um <strong>z-score</strong> (quantos desvios-padrão o pixel está distante da cor média do fundo).
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        Pixels muito diferentes do fundo de referência são classificados como pertencentes ao objeto.
                      </p>
                      <div className="p-3 bg-[#1a1a1a] border border-emerald-500/10 rounded-sm">
                        <span className="font-mono text-[10px] text-emerald-400 font-bold block mb-1">Parâmetro Ajustável: hsv_threshold</span>
                        <p className="text-[11px] text-gray-300">
                          Define o quão distante (em termos de desvios-padrão) um pixel precisa estar da cor média do fundo para ser considerado parte do objeto. Valores menores tornam a segmentação mais sensível (pega mais pixels como objeto); valores maiores tornam mais conservadora.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">Bom Para</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Cenários com fundo relativamente uniforme e bem contrastado com o objeto.
                          </p>
                        </div>
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-red-400 font-bold uppercase">Limitações</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Requer calibração manual fina do threshold conforme o contraste da cena e brilho ambiente.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'grabcut' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                        <span className="font-display text-sm font-bold text-rose-400 tracking-wider uppercase">GrabCut Segmenter</span>
                        <span className="font-mono text-[8px] bg-rose-950/40 text-rose-400 px-2 py-0.5 border border-rose-500/20">CLÁSSICO</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">
                        <strong>Endpoint:</strong> <code className="bg-black text-[#4ADE80] px-1.5 py-0.5 font-bold">POST /predict/classic?method=grabcut</code>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        <strong>Ideia:</strong> usa o algoritmo <strong>GrabCut</strong> nativo do OpenCV, que modela iterativamente a distribuição de cores do objeto e do fundo (via <em>Gaussian Mixture Models</em> ou GMMs) e resolve um problema de corte mínimo em grafo (<em>graph cut</em>) para separar as duas regiões.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        Ele é inicializado diretamente com a própria bounding box enviada pelo YOLO, informando ao algoritmo clássico onde está aproximadamente o objeto principal do recorte.
                      </p>
                      <div className="p-3 bg-[#1a1a1a] border border-rose-500/10 rounded-sm">
                        <span className="font-mono text-[10px] text-rose-400 font-bold block mb-1">Parâmetro Ajustável: grabcut_iterations</span>
                        <p className="text-[11px] text-gray-300">
                          Número de iterações do processo de refinamento e corte de grafos. Mais iterações tendem a gerar máscaras significativamente mais precisas, mas custam visivelmente mais tempo de processamento.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-rose-400 font-bold uppercase">Bom Para</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Objetos com textura, pelagem ou cor complexa onde técnicas simples de thresholding falham.
                          </p>
                        </div>
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-red-400 font-bold uppercase">Limitações</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Mais custoso computacionalmente que Otsu/HSV; ainda pode errar se o fundo possuir cores idênticas às do objeto.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'watershed' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                        <span className="font-display text-sm font-bold text-amber-400 tracking-wider uppercase">Watershed Transform</span>
                        <span className="font-mono text-[8px] bg-amber-950/40 text-amber-400 px-2 py-0.5 border border-amber-500/20">CLÁSSICO</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-400">
                        <strong>Endpoint:</strong> <code className="bg-black text-[#4ADE80] px-1.5 py-0.5 font-bold">POST /predict/classic?method=watershed</code>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        <strong>Ideia:</strong> combina três etapas consecutivas de processamento: limiarização de <strong>Otsu</strong>, aplicação de <strong>transformada de distância</strong> (<em>distance transform</em>) e o algoritmo clássico de <strong>watershed</strong> (<code className="font-mono bg-black/40 px-1">cv2.watershed</code>) do OpenCV.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                        A transformada de distância ajuda a identificar com precisão os "centros" de cada blob (região conexa), e o watershed então "inunda" a imagem a partir desses marcadores, criando divisões exatamente onde diferentes bacias hidrográficas se encontram.
                      </p>
                      <div className="p-3 bg-[#1a1a1a] border border-amber-500/10 rounded-sm">
                        <span className="font-mono text-[10px] text-amber-400 font-bold block mb-1">Parâmetro Ajustável: watershed_fg_ratio</span>
                        <p className="text-[11px] text-gray-300">
                          Define a proporção máxima da transformada de distância que é usada para marcar o <strong>foreground</strong> (objeto) com absoluta certeza matemática antes de iniciar o preenchimento por watershed. Valores maiores tornam a marcação de foreground mais restritiva e conservadora.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-amber-400 font-bold uppercase">Bom Para</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Cenas com múltiplos objetos próximos ou fisicamente encostados que um threshold simples uniria em um único elemento.
                          </p>
                        </div>
                        <div className="p-3 bg-black/40 border border-[#222222] rounded-sm space-y-1">
                          <span className="font-mono text-[9px] text-red-400 font-bold uppercase">Limitações</span>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            Extremamente sensível a ruídos pixel-level e parâmetros mal ajustados, podendo fragmentar o objeto em múltiplos pedaços.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shared Classical Parameters Box */}
                <div className="p-4 bg-[#111111] border border-[#262626] rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase">
                    <ChevronRight className="w-4 h-4" />
                    <span>Parâmetros Compartilhados (Métodos Clássicos)</span>
                  </div>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Todos os 4 métodos clássicos compartilham dois parâmetros fundamentais na API:
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-400 space-y-1.5 pl-2">
                    <li>
                      <strong className="text-white font-mono">margin_ratio:</strong> Define quanto de contexto adicional ao redor da bounding box do YOLO é incluído na imagem de recorte antes de rodar a segmentação. Ajuda a prevenir o corte acidental das bordas extremas do mob.
                    </li>
                    <li>
                      <strong className="text-white font-mono">poly_epsilon:</strong> Controla o nível de simplificação do polígono final gerado (algoritmo RDP). Quanto maior este valor, mais geométrico e com menos vértices fica o polígono resultante da segmentação.
                    </li>
                  </ul>
                </div>

                {/* Summary Table */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-sm font-bold tracking-wider text-white border-l-2 border-primary pl-2 uppercase">
                    Resumo Comparativo Geral
                  </h3>
                  <div className="overflow-x-auto border border-[#222222]">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#161616] border-b border-[#222222] text-primary">
                          <th className="p-2.5 font-bold uppercase">Método</th>
                          <th className="p-2.5 font-bold uppercase">Tipo</th>
                          <th className="p-2.5 font-bold uppercase">Base Técnica</th>
                          <th className="p-2.5 font-bold uppercase">Parâmetro Específico</th>
                          <th className="p-2.5 font-bold uppercase">Ponto Forte</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222222] text-gray-300">
                        <tr>
                          <td className="p-2.5 font-bold text-white">SAM</td>
                          <td className="p-2.5 text-green-400 font-bold">Deep Learning</td>
                          <td className="p-2.5">MobileSAM com caixa YOLO</td>
                          <td className="p-2.5 text-gray-500">—</td>
                          <td className="p-2.5">Incrível precisão geral sem calibração manual</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Otsu</td>
                          <td className="p-2.5 text-sky-400 font-bold">Clássico</td>
                          <td className="p-2.5">Limiarização automática (Canal S - HSV)</td>
                          <td className="p-2.5 text-gray-500">—</td>
                          <td className="p-2.5">Muito rápido e excelente em cores vivas</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">HSV</td>
                          <td className="p-2.5 text-emerald-400 font-bold">Clássico</td>
                          <td className="p-2.5">Distância de cor z-score do fundo</td>
                          <td className="p-2.5 text-emerald-400 font-bold">hsv_threshold</td>
                          <td className="p-2.5">Excelente em fundos uniformes</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">GrabCut</td>
                          <td className="p-2.5 text-rose-400 font-bold">Clássico</td>
                          <td className="p-2.5">Corte em grafo + modelo de cor (GMM)</td>
                          <td className="p-2.5 text-rose-400 font-bold">grabcut_iterations</td>
                          <td className="p-2.5">Muito robusto em texturas complexas</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold text-white">Watershed</td>
                          <td className="p-2.5 text-amber-400 font-bold">Clássico</td>
                          <td className="p-2.5">Distance Transform + Watershed</td>
                          <td className="p-2.5 text-amber-400 font-bold">watershed_fg_ratio</td>
                          <td className="p-2.5">Separa múltiplos objetos encostados</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 3: ESTRUTURA DO PROJETO */}
            {activeSubSection === 'estrutura' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <FolderTree className="w-5 h-5 text-primary" />
                    <span>ESTRUTURA DE DIRETORIOS</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">Organização física de dados, scripts, modelos e documentações</p>
                </div>

                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button 
                      onClick={() => copyToClipboard(`YOLOCraft/
├── data/
│   ├── minecraft_mobs/          # dataset inicial (baseline, 4 classes)
│   └── minecraft_mobs-2/        # dataset principal (87 classes) + subconjuntos curados
├── notebooks/
│   ├── 1_exploracao/            # análise exploratória e visualização de labels
│   ├── 2_baseline/              # treinamento baseline
│   ├── 3_experimentos/          # experimentos de treinamento (usa TrainingLogger)
│   ├── 4_segmentation/          # testes de segmentação com SAM
│   └── testes/                  # imagens de teste manual
├── src/
│   ├── config.py                # seleção de dataset (registro de paths)
│   ├── convert_dataset.py       # converte CSV de anotações para formato YOLO
│   ├── training_logger.py       # registra histórico de treinos (JSON/CSV)
│   ├── train_with_logging.py    # treino com registro automático
│   ├── train_improved.py        # treino com hiperparâmetros de augmentation
│   ├── test_thresholds.py       # varredura de confidence threshold
│   ├── detector_gui.py          # app desktop (PyQt6) para testar modelos
│   ├── dataset_manager.py       # app desktop (PyQt6) para curar o dataset
│   ├── api.py                   # API de inferência (FastAPI)
│   └── utils.py
├── scripts/
│   └── download_dataset.py      # download automatizado via Kaggle CLI
├── docs/
│   └── frontend_integration.md  # contrato da API para o frontend
├── pretrained_models/           # pesos pré-treinados (YOLO, MobileSAM)
└── training_logs/               # histórico de treinos`, 'tree')}
                      className="p-1.5 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                      title="Copiar estrutura"
                    >
                      {copiedId === 'tree' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 leading-relaxed overflow-x-auto max-h-[460px] scrollbar-thin">
{`YOLOCraft/
│
├── data/
│   ├── minecraft_mobs/          # dataset inicial (baseline, 4 classes)
│   └── minecraft_mobs-2/        # dataset principal (87 classes) + subconjuntos curados
│
├── notebooks/
│   ├── 1_exploracao/            # análise exploratória e visualização de labels
│   ├── 2_baseline/              # treinamento baseline
│   ├── 3_experimentos/          # experimentos de treinamento (usa TrainingLogger)
│   ├── 4_segmentation/          # testes de segmentação com SAM
│   └── testes/                  # imagens de teste manual
│
├── src/
│   ├── config.py                # seleção de dataset (registro de paths)
│   ├── convert_dataset.py       # converte CSV de anotações para formato YOLO
│   ├── training_logger.py       # registra histórico de treinos (JSON/CSV)
│   ├── train_with_logging.py    # treino com registro automático
│   ├── train_improved.py        # treino com hiperparâmetros de augmentation
│   ├── test_thresholds.py       # varredura de confidence threshold
│   ├── detector_gui.py          # app desktop (PyQt6) para testar modelos
│   ├── dataset_manager.py       # app desktop (PyQt6) para curar o dataset
│   ├── api.py                   # API de inferência (FastAPI)
│   └── utils.py
│
├── scripts/
│   └── download_dataset.py      # download automatizado via Kaggle CLI
│
├── docs/
│   └── frontend_integration.md  # contrato da API para o frontend
│
├── pretrained_models/           # pesos pré-treinados (YOLO, MobileSAM)
├── training_logs/               # histórico de treinos
├── requirements.txt
└── README.md`}
                  </pre>
                </div>
              </div>
            )}

            {/* SUB-SECTION 4: ESTADO DO MODELO */}
            {activeSubSection === 'modelo' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-primary" />
                    <span>ESTADO ATUAL DO MODELO</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">Métricas observadas, histórico de treino e logs consolidados</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* YOLO26s - 16 Classes (Em Treinamento) */}
                  <div className="p-5 bg-[#141414] border border-primary/20 relative rounded-sm space-y-4">
                    <div className="corner-bracket-tl"></div>
                    <div className="corner-bracket-tr"></div>
                    <div className="corner-bracket-bl"></div>
                    <div className="corner-bracket-br"></div>
                    
                    <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                      <span className="font-display text-sm font-bold text-primary tracking-wider">YOLO26s (Apresentacao)</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#1e3f22]/30 text-primary border border-primary/20 animate-pulse">EM TREINO</span>
                    </div>
                    
                    <div className="font-sans text-xs text-gray-400 leading-relaxed">
                      Treinado no subconjunto curado de 16 classes. Métricas parciais consolidadas:
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">Precision</span>
                        <span className="font-display text-base text-white font-bold">~ 0.98</span>
                      </div>
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">Recall</span>
                        <span className="font-display text-base text-white font-bold">~ 0.98</span>
                      </div>
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">mAP50</span>
                        <span className="font-display text-base text-primary font-bold">~ 0.99</span>
                      </div>
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">mAP50-95</span>
                        <span className="font-display text-base text-white font-bold">~ 0.95</span>
                      </div>
                    </div>
                  </div>

                  {/* YOLO26s - Baseline (4 Classes) */}
                  <div className="p-5 bg-[#141414] border border-[#222222] relative rounded-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                      <span className="font-display text-sm font-bold text-white tracking-wider">YOLO26s (Baseline)</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 bg-black text-gray-400 border border-[#222222]">CONSOLIDADO</span>
                    </div>
                    
                    <div className="font-sans text-xs text-gray-400 leading-relaxed">
                      Treinado para 4 classes fundamentais (creeper, skeleton, spider, zombie) ao longo de 100 épocas completas.
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">Mapeamento de Épocas</span>
                        <span className="font-display text-xs text-white font-bold">100 / 100 EPOCAS</span>
                      </div>
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">Estabilidade</span>
                        <span className="font-display text-xs text-secondary font-bold">100% ESTAVEL</span>
                      </div>
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">mAP50</span>
                        <span className="font-display text-base text-white font-bold">0.9522</span>
                      </div>
                      <div className="bg-black/50 p-2.5 border border-[#222222]">
                        <span className="font-mono text-[9px] text-gray-500 block">mAP50-95</span>
                        <span className="font-display text-base text-white font-bold">0.8165</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#141414] border border-[#222222] rounded-sm space-y-3">
                  <h3 className="font-display text-xs font-bold text-white uppercase">Historico e API Funcional</h3>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    O histórico de treinamento estruturado completo é guardado e persistido de forma dinâmica em <code className="text-white px-1 py-0.5 bg-black rounded-sm text-[11px] font-mono">training_logs/training_history.csv</code> (gerado autonomamente por <code className="text-white px-1 py-0.5 bg-black rounded-sm text-[11px] font-mono">src/training_logger.py</code>). A API do backend (<code className="text-white px-1 py-0.5 bg-black rounded-sm text-[11px] font-mono">src/api.py</code>) está totalmente funcional, expondo o pipeline de segmentação integrada com SAM no endpoint unificado <code className="text-white px-1 py-0.5 bg-black rounded-sm text-[11px] font-mono">/predict</code>.
                  </p>
                </div>
              </div>
            )}

            {/* SUB-SECTION 5: INSTALAÇÃO & GUIA */}
            {activeSubSection === 'instalacao' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-primary" />
                    <span>GUIA DE INSTALAÇÃO E EXECUÇÃO</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">Como clonar, preparar dependências, autenticar e treinar modelos</p>
                </div>

                {/* Passo 1 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">01 / CLONAR REPOSITÓRIO</span>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.clone, 'clone')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'clone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.clone}
                    </pre>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">02 / AMBIENTE VIRTUAL</span>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.venv, 'venv')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'venv' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.venv}
                    </pre>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">03 / INSTALAR DEPENDÊNCIAS</span>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.deps, 'deps')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'deps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.deps}
                    </pre>
                  </div>
                </div>

                {/* Passo 4 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">04 / AUTENTICAÇÃO KAGGLE CLI</span>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed mb-1">
                    Execute o login. Um link será fornecido no terminal. Abra no seu navegador, conecte sua conta e confirme para que as credenciais sejam armazenadas em sua máquina local:
                  </p>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.kaggle, 'kaggle')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'kaggle' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.kaggle}
                    </pre>
                  </div>
                </div>

                {/* Passo 5 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">05 / DOWNLOAD & CONVERSÃO</span>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.download, 'download')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'download' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.download}
                    </pre>
                  </div>
                </div>

                {/* Passo 6 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">06 / INICIAR TREINAMENTO</span>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.train, 'train')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'train' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.train}
                    </pre>
                  </div>
                </div>

                {/* Passo 7 */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-primary font-bold tracking-wider block">07 / EXECUTAR INFERÊNCIA (API OU DESKTOP APP)</span>
                  <div className="relative">
                    <button 
                      onClick={() => copyToClipboard(codeBlocks.inference, 'inference')}
                      className="absolute top-2.5 right-2.5 p-1 bg-[#141414] hover:bg-primary border border-[#2d2d2d] hover:border-primary text-gray-400 hover:text-black transition-colors rounded-sm cursor-pointer"
                    >
                      {copiedId === 'inference' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <pre className="p-4 bg-black border border-[#222222] font-mono text-[11px] sm:text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {codeBlocks.inference}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-SECTION 6: ROADMAP */}
            {activeSubSection === 'roadmap' && (
              <div className="space-y-6">
                <div className="border-b border-[#222222] pb-4">
                  <h2 className="font-display text-2xl font-bold tracking-wider flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <span>ROADMAP DO PROJETO</span>
                  </h2>
                  <p className="font-mono text-xs text-gray-500 mt-1 uppercase">Acompanhamento do ciclo de vida, entregáveis e progresso</p>
                </div>

                <div className="space-y-6">
                  {/* Versão 1.0 */}
                  <div className="p-5 bg-[#141414] border border-[#222222] rounded-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                      <span className="font-display text-sm font-bold text-white tracking-wider">Versao 1.0 - Deteccao com YOLO</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/20">100% COMPLETO</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Estrutura inicial do projeto", checked: true },
                        { label: "Download automatizado do dataset", checked: true },
                        { label: "Análise exploratória dos dados", checked: true },
                        { label: "Verificação do balanceamento de classes", checked: true },
                        { label: "Validação visual das anotações", checked: true },
                        { label: "Treinamento baseline", checked: true },
                        { label: "Avaliação de desempenho", checked: true },
                        { label: "Testes de inferência", checked: true },
                        { label: "Comparação de arquiteturas YOLO", checked: true },
                        { label: "Seleção do modelo final de detecção", checked: true }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs font-sans text-gray-300">
                          <span className="p-0.5 bg-primary/10 border border-primary text-primary rounded-sm flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Versão 2.0 */}
                  <div className="p-5 bg-[#141414] border border-[#222222] rounded-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                      <span className="font-display text-sm font-bold text-white tracking-wider">Versao 2.0 - Segmentacao</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/20">80% COMPLETO</span>
                    </div>

                    <p className="font-sans text-xs text-gray-400 italic">
                      A abordagem original utilizando segmentação clássica com OpenCV (Threshold, Otsu, Canny, GrabCut, Watershed) foi com sucesso substituída pelo SAM, que generaliza sem necessidade de ajuste por classe.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {[
                        { label: "Extração de ROI via bounding boxes YOLO", checked: true },
                        { label: "Integração YOLO + SAM (MobileSAM)", checked: true },
                        { label: "Conversão de máscara para polígono", checked: true },
                        { label: "Avaliação qualitativa em mais classes", checked: false }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs font-sans text-gray-300">
                          {item.checked ? (
                            <span className="p-0.5 bg-primary/10 border border-primary text-primary rounded-sm flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 bg-black border border-[#333333] rounded-sm flex-shrink-0 mt-0.5" />
                          )}
                          <span className={item.checked ? "" : "text-gray-500"}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Versão 3.0 */}
                  <div className="p-5 bg-[#141414] border border-[#222222] rounded-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-[#222222] pb-2">
                      <span className="font-display text-sm font-bold text-white tracking-wider">Versao 3.0 - Aplicacao Web</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-[#443311]/30 text-[#e6a23c] border border-[#e6a23c]/20">60% COMPLETO</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Desenvolvimento da API de inferência", checked: true },
                        { label: "Upload de imagens estáticas", checked: true },
                        { label: "Visualização das bounding boxes", checked: true },
                        { label: "Visualização das máscaras segmentadas", checked: true },
                        { label: "Aplicação web unificada (Em execução)", checked: true },
                        { label: "Dashboard dinâmico de resultados", checked: true },
                        { label: "Deploy definitivo da API em nuvem", checked: false }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs font-sans text-gray-300">
                          {item.checked ? (
                            <span className="p-0.5 bg-primary/10 border border-primary text-primary rounded-sm flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="w-4 h-4 bg-black border border-[#333333] rounded-sm flex-shrink-0 mt-0.5" />
                          )}
                          <span className={item.checked ? "" : "text-gray-500"}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
