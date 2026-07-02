import React, { useState, useRef, useEffect } from 'react';
import { ScanResult, ApiPredictResponse, ApiDetection } from '../types';
import { UploadCloud, Radar, Shield, Eye, Download, Info, Check, RefreshCw, Layers, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DetectorPanelProps {
  onScanComplete: (result: ScanResult) => void;
  recentScans: ScanResult[];
  externalLoadScan?: ScanResult | null;
  onClearExternalLoad?: () => void;
  onViewMobDetails?: (mobClass: string) => void;
}

// Map class names to beautiful Minecraft palette colors
const getClassColor = (className: string): string => {
  const name = className.toLowerCase();
  if (name.includes('cave_spider')) return '#10B981'; // Teal / Emerald
  if (name.includes('creeper')) return '#4ADE80'; // Lime green
  if (name.includes('enderman')) return '#C084FC'; // Purple
  if (name.includes('skeleton') || name.includes('esqueleto')) return '#93C5FD'; // Light blue / gray
  if (name.includes('slime')) return '#86EFAC'; // Soft green
  if (name.includes('spider') || name.includes('aranha')) return '#F43F5E'; // Rose/Red
  if (name.includes('zombie') || name.includes('zumbi')) return '#06B6D4'; // Cyan
  if (name.includes('iron_golem') || name.includes('iron_golem') || name.includes('golem')) return '#F59E0B'; // Amber Golem
  if (name.includes('wolf') || name.includes('lobo')) return '#E2E8F0'; // Slate Gray
  if (name.includes('cat') || name.includes('gato')) return '#FB7185'; // Warm Pink
  if (name.includes('chicken') || name.includes('galinha')) return '#FEE2E2'; // Reddish White
  if (name.includes('cow') || name.includes('vaca')) return '#78350F'; // Brown
  if (name.includes('frog') || name.includes('sapo')) return '#A3E635'; // Lime Green
  if (name.includes('horse') || name.includes('cavalo')) return '#D97706'; // Dark Amber
  if (name.includes('pig') || name.includes('porco')) return '#F472B6'; // Pink
  if (name.includes('sheep') || name.includes('ovelha')) return '#FFFFFF'; // White
  if (name.includes('witch') || name.includes('bruxa')) return '#A855F7'; // Violet
  if (name.includes('phantom')) return '#3B82F6'; // Blue
  return '#F59E0B'; // Amber default
};

// Voxel contour helper for high-fidelity blocky Minecraft polygon shapes
const generateMockPolygon = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  className: string
): [number, number][] => {
  const w = x2 - x1;
  const h = y2 - y1;
  const name = className.toLowerCase();
  
  if (name.includes('creeper')) {
    // Creeper head + body + legs blocky shape
    const headW = w * 0.8;
    const bodyW = w * 0.5;
    const footW = w * 0.9;
    
    const hLeft = x1 + (w - headW)/2;
    const hRight = x2 - (w - headW)/2;
    const hBottom = y1 + h * 0.35;
    
    const bLeft = x1 + (w - bodyW)/2;
    const bRight = x2 - (w - bodyW)/2;
    const bBottom = y1 + h * 0.8;
    
    return [
      [hLeft, y1 + h * 0.05],
      [hRight, y1 + h * 0.05],
      [hRight, hBottom],
      [bRight, hBottom],
      [bRight, bBottom],
      [x2 - (w - footW)/2, bBottom],
      [x2 - (w - footW)/2, y2],
      [x2 - (w - footW)/2 - footW * 0.35, y2],
      [x2 - (w - footW)/2 - footW * 0.35, y2 - h * 0.12],
      [x1 + (w - footW)/2 + footW * 0.35, y2 - h * 0.12],
      [x1 + (w - footW)/2 + footW * 0.35, y2],
      [x1 + (w - footW)/2, y2],
      [x1 + (w - footW)/2, bBottom],
      [bLeft, bBottom],
      [bLeft, hBottom],
      [hLeft, hBottom]
    ];
  } else if (name.includes('spider') || name.includes('aranha')) {
    const midX = x1 + w / 2;
    const midY = y1 + h / 2;
    return [
      [midX - w * 0.2, y1 + h * 0.2],
      [midX + w * 0.2, y1 + h * 0.2],
      [midX + w * 0.4, midY - h * 0.1],
      [x2, midY + h * 0.1],
      [midX + w * 0.3, midY + h * 0.15],
      [x2 - w * 0.1, y2],
      [midX + w * 0.2, y2 - h * 0.1],
      [midX - w * 0.2, y2 - h * 0.1],
      [x1 + w * 0.1, y2],
      [midX - w * 0.3, midY + h * 0.15],
      [x1, midY + h * 0.1],
      [midX - w * 0.4, midY - h * 0.1]
    ];
  } else if (name.includes('skeleton') || name.includes('esqueleto')) {
    return [
      [x1 + w * 0.3, y1],
      [x2 - w * 0.3, y1],
      [x2 - w * 0.3, y1 + h * 0.25],
      [x2 - w * 0.15, y1 + h * 0.25],
      [x2 - w * 0.15, y1 + h * 0.6],
      [x2 - w * 0.3, y1 + h * 0.6],
      [x2 - w * 0.3, y1 + h * 0.8],
      [x2 - w * 0.35, y2],
      [x2 - w * 0.45, y2],
      [x2 - w * 0.45, y1 + h * 0.8],
      [x1 + w * 0.45, y1 + h * 0.8],
      [x1 + w * 0.45, y2],
      [x1 + w * 0.35, y2],
      [x1 + w * 0.3, y1 + h * 0.8],
      [x1 + w * 0.3, y1 + h * 0.6],
      [x1 + w * 0.15, y1 + h * 0.6],
      [x1 + w * 0.15, y1 + h * 0.25],
      [x1 + w * 0.3, y1 + h * 0.25]
    ];
  } else {
    // Default humanoid shape (Zombie, etc.)
    return [
      [x1 + w * 0.25, y1],
      [x2 - w * 0.25, y1],
      [x2 - w * 0.25, y1 + h * 0.22],
      [x2, y1 + h * 0.25],
      [x2, y1 + h * 0.42],
      [x2 - w * 0.25, y1 + h * 0.42],
      [x2 - w * 0.25, y1 + h * 0.75],
      [x2 - w * 0.2, y2],
      [x2 - w * 0.45, y2],
      [x2 - w * 0.45, y1 + h * 0.75],
      [x1 + w * 0.45, y1 + h * 0.75],
      [x1 + w * 0.45, y2],
      [x1 + w * 0.2, y2],
      [x1 + w * 0.25, y1 + h * 0.75],
      [x1 + w * 0.25, y1 + h * 0.42],
      [x1, y1 + h * 0.42],
      [x1, y1 + h * 0.25],
      [x1 + w * 0.25, y1 + h * 0.22]
    ];
  }
};

const PRESET_SCANS = [
  {
    name: 'Floresta Escura',
    mob: 'Creeper',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQyR4UfDyQUrX-SlWKILrGAZ3nVrY7K5ktanmMRUbEFBkIUUT5mSROYpuwQ7JnyZxZeHTM7LCdSylDwQklYqwhltxq2kh0vHX5G_PZv56bAWDDpCRcQ4rZLRKuF4j3w2h_4T2Vkuuu2lZl4H8fmpo8kxzE0pv8pRA5rNUbdfYT_vdzB9ciaExVuIH5zQ1oX0u2Znhfb6nzf9Z4O-YFFuEuLGL0xjTP9ZJvXMXA7z68ppZIESoCLfQuGmGX_y1p9nR97L21b5UUe_M',
    threatLevel: 'CRÍTICO' as const,
    insight: 'Creeper furtivo detectado sob a folhagem do bioma florestal. Perigo iminente de explosão e perda de blocos.',
    width: 800,
    height: 450,
    detections: [
      {
        class: 'creeper',
        confidence: 0.98,
        box: [304, 144, 496, 369] as [number, number, number, number],
        polygon: generateMockPolygon(304, 144, 496, 369, 'creeper')
      }
    ]
  },
  {
    name: 'Caverna Subterrânea',
    mob: 'Esqueleto',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADtppedK-2d_Jrz2aLO-SIV6ACE5dq6hR71s6A2cBnqVOPTgCih8L8u4a7jRWgTaB-5d21Gu7Ql02nSVst39fdwhCCHA9u82oNaHgzAHykU0ha25VEJNkLZ5D9KaqQwJ_YN5LQDYtAtkvE3e8xFhI-QUe0WbXBfNVsfNZD9dH5CNVcp9gI49QXWkYXCi-TCgTFkJjYgPi0lZxVCADs92Ayz3acUNUuYO5WHbjRd3B0wNRyk7fygLPPNNLrT9BT1l0SBYjdVNFB7Eg',
    threatLevel: 'ALTO' as const,
    insight: 'Atirador esquelético camuflado na escuridão profunda. Equipe seu escudo de ferro antes de se aproximar.',
    width: 800,
    height: 450,
    detections: [
      {
        class: 'esqueleto',
        confidence: 0.91,
        box: [280, 135, 504, 382] as [number, number, number, number],
        polygon: generateMockPolygon(280, 135, 504, 382, 'esqueleto')
      }
    ]
  },
  {
    name: 'Ninho Abandonado',
    mob: 'Aranha',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFF7kPIdMhwhp7Wpl512ulSlwWIuG10lBdTD8xws5QNVsZtkgfAyulsawd8zHlkDmFgW4LDfvN8uPGcCTotlqULYgkQYNdF_u5j75zGc0C1CXbjPSrud9gUYlgsUeP7MjOmRcm3_sdgy6lL2-fX1SrFjRX2o1R4qomq7YrdmoToZ_IFvemC5eslEhJ8Zlgq091M0XQzgFYdtPaaaogLw6zpL9xfSDcagrUShiUVvazcy4M95iwrznKntzP-t0y1gIN7Ng63ZogohY',
    threatLevel: 'MÉDIO' as const,
    insight: 'Aranha de caverna tecendo teias venenosas. Alta agilidade de salto vertical observada na área.',
    width: 800,
    height: 450,
    detections: [
      {
        class: 'aranha',
        confidence: 0.89,
        box: [160, 112, 640, 360] as [number, number, number, number],
        polygon: generateMockPolygon(160, 112, 640, 360, 'aranha')
      }
    ]
  },
  {
    name: 'Vale Crepuscular',
    mob: 'Zumbi',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoFtXB3ecId2yHp3ZsLWvATbeaLdKEODBwaGjredKrJB7VW0zxqPzFkY5Z0bjE9wkmjKCcYxp47yan5axan9OtOT_J4t8g8cM2e8YbKX2kqAJvHV7w9l2mbDgFMVhA6FbuX_oYpprLDcIWhjOfsl-yy0Mbg80O5Y8drJIjNCuQ1oWpHAveQeFD1cJBkUTMcrLx-F3K_7LS2sQKCveUybcQ2rOKHUuKCG96i4cFiu--oESKTuo24_cudWgVn9K0Hebfx86tS_L62bs',
    threatLevel: 'CRÍTICO' as const,
    insight: 'Horda hostil detectada no mesmo quadrante. Prepare armadura de diamante ou retorne para o abrigo!',
    width: 800,
    height: 450,
    detections: [
      {
        class: 'zumbi',
        confidence: 0.98,
        box: [96, 90, 272, 360] as [number, number, number, number],
        polygon: generateMockPolygon(96, 90, 272, 360, 'zumbi')
      },
      {
        class: 'zumbi',
        confidence: 0.94,
        box: [360, 144, 504, 369] as [number, number, number, number],
        polygon: generateMockPolygon(360, 144, 504, 369, 'zumbi')
      },
      {
        class: 'aranha',
        confidence: 0.88,
        box: [544, 67, 736, 225] as [number, number, number, number],
        polygon: generateMockPolygon(544, 67, 736, 225, 'aranha')
      }
    ]
  }
];

export default function DetectorPanel({ 
  onScanComplete, 
  recentScans, 
  externalLoadScan, 
  onClearExternalLoad,
  onViewMobDetails
}: DetectorPanelProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('AGUARDANDO ENTRADA');
  const [activeScanResult, setActiveScanResult] = useState<ScanResult | null>(null);
  const [apiData, setApiData] = useState<ApiPredictResponse | null>(null);

  // Connection modes
  const [serverMode, setServerMode] = useState<'real' | 'simulated'>('real');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Pipeline settings
  const [viewMode, setViewMode] = useState<'bbox' | 'highlight' | 'overlay'>('highlight');
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [isLive, setIsLive] = useState(false);
  const [liveInterval, setLiveInterval] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<any>(null);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://stimulate-excusably-subsystem.ngrok-free.dev';

  useEffect(() => {
    // Default to real server mode using the provided ngrok API url
    setServerMode('real');
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (liveInterval) clearInterval(liveInterval);
    };
  }, []);

  useEffect(() => {
    if (externalLoadScan) {
      setSelectedImage(externalLoadScan.imageUrl);
      setActiveScanResult(externalLoadScan);
      setApiData(externalLoadScan.apiResponse || {
        width: 800,
        height: 450,
        detections: externalLoadScan.boundingBoxes.map(b => ({
          class: b.label.toLowerCase(),
          confidence: b.confidence / 100,
          box: [
            (b.left / 100) * 800,
            (b.top / 100) * 450,
            ((b.left + b.width) / 100) * 800,
            ((b.top + b.height) / 100) * 450,
          ] as [number, number, number, number],
          polygon: []
        }))
      });
      setIsLive(false);
      setIsScanning(false);
      if (onClearExternalLoad) {
        onClearExternalLoad();
      }
    }
  }, [externalLoadScan]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Reference to avoid stale processFile closures in global event listener
  const processFileRef = useRef(processFile);
  useEffect(() => {
    processFileRef.current = processFile;
  }, [processFile]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            processFileRef.current(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Main client file processing
  function processFile(file: File) {
    setErrorMessage(null);
    setIsLive(false);
    
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsScanning(true);
    setScanProgress(5);
    setScanStepText('CARREGANDO IMAGEM NA MEMÓRIA...');

    // Load image in memory to get its original resolution
    const img = new Image();
    img.onload = async () => {
      const originalW = img.naturalWidth || 800;
      const originalH = img.naturalHeight || 450;
      
      setScanProgress(25);
      setScanStepText('CONECTANDO AO SERVIDOR DE IA...');

      if (serverMode === 'real') {
        try {
          const form = new FormData();
          form.append("file", file);
          
          setScanProgress(60);
          setScanStepText('EXECUTANDO INFERÊNCIA YOLO...');
          
          const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/predict`, {
            method: 'POST',
            headers: {
              'ngrok-skip-browser-warning': 'true'
            },
            body: form
          });

          if (!response.ok) {
            throw new Error(`Erro do Servidor (${response.status})`);
          }

          const data: ApiPredictResponse = await response.json();
          
          setScanProgress(90);
          setScanStepText('DECODIFICANDO SEGMENTAÇÃO...');
          
          finishScan(imageUrl, file.name, data);
        } catch (err: any) {
          console.error(err);
          setErrorMessage(`Falha na API: ${err.message || 'Erro de conexão'}. Alternando para modo de simulação local para esta imagem.`);
          setServerMode('simulated');
          simulateLocalScan(imageUrl, file.name, originalW, originalH);
        }
      } else {
        // Simulated local path
        setTimeout(() => {
          setScanProgress(65);
          setScanStepText('SIMULANDO RESPOSTA DA REDE NEURAL...');
          setTimeout(() => {
            simulateLocalScan(imageUrl, file.name, originalW, originalH);
          }, 400);
        }, 300);
      }
    };
    img.onerror = () => {
      setIsScanning(false);
      setErrorMessage('Erro ao ler formato da imagem.');
    };
    img.src = imageUrl;
  }

  // Simulation fallback
  const simulateLocalScan = (imageUrl: string, fileName: string, w: number, h: number) => {
    const fn = fileName.toLowerCase();
    const detections: ApiDetection[] = [];

    // Realistic target detection boxes based on filenames
    if (fn.includes('creeper') || fn.includes('floresta') || Math.random() > 0.5) {
      const x1 = Math.round(w * 0.38);
      const y1 = Math.round(h * 0.32);
      const x2 = Math.round(w * 0.62);
      const y2 = Math.round(h * 0.82);
      detections.push({
        class: 'creeper',
        confidence: 0.95,
        box: [x1, y1, x2, y2],
        polygon: generateMockPolygon(x1, y1, x2, y2, 'creeper')
      });
    }

    if (fn.includes('esqueleto') || fn.includes('caverna') || (detections.length === 0 && Math.random() > 0.4)) {
      const x1 = Math.round(w * 0.25);
      const y1 = Math.round(h * 0.2);
      const x2 = Math.round(w * 0.52);
      const y2 = Math.round(h * 0.88);
      detections.push({
        class: 'esqueleto',
        confidence: 0.91,
        box: [x1, y1, x2, y2],
        polygon: generateMockPolygon(x1, y1, x2, y2, 'esqueleto')
      });
    }

    if (fn.includes('zumbi') || fn.includes('vale') || (detections.length === 0 && Math.random() > 0.5)) {
      const x1 = Math.round(w * 0.15);
      const y1 = Math.round(h * 0.25);
      const x2 = Math.round(w * 0.4);
      const y2 = Math.round(h * 0.8);
      detections.push({
        class: 'zumbi',
        confidence: 0.87,
        box: [x1, y1, x2, y2],
        polygon: generateMockPolygon(x1, y1, x2, y2, 'zumbi')
      });
    }

    if (fn.includes('aranha') || fn.includes('ninho') || (detections.length === 0)) {
      const x1 = Math.round(w * 0.2);
      const y1 = Math.round(h * 0.3);
      const x2 = Math.round(w * 0.8);
      const y2 = Math.round(h * 0.85);
      detections.push({
        class: 'aranha',
        confidence: 0.89,
        box: [x1, y1, x2, y2],
        polygon: generateMockPolygon(x1, y1, x2, y2, 'aranha')
      });
    }

    const mockData: ApiPredictResponse = {
      width: w,
      height: h,
      detections
    };

    finishScan(imageUrl, fileName, mockData);
  };

  const finishScan = (imageUrl: string, fileName: string, data: ApiPredictResponse) => {
    setScanProgress(100);
    setScanStepText('SEGMENTAÇÃO CONCLUÍDA!');
    
    // Evaluate main threat level
    let highestThreat: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO' = 'BAIXO';
    let summaryInsight = 'Nenhuma ameaça hostil detectada no visor.';

    const hasCreeper = data.detections.some(d => d.class.toLowerCase().includes('creeper'));
    const hasZumbiOrSkeleton = data.detections.some(d => d.class.toLowerCase().includes('zumbi') || d.class.toLowerCase().includes('zombie') || d.class.toLowerCase().includes('skeleton') || d.class.toLowerCase().includes('esqueleto'));
    const hasSpider = data.detections.some(d => d.class.toLowerCase().includes('aranha') || d.class.toLowerCase().includes('spider'));

    if (hasCreeper) {
      highestThreat = 'CRÍTICO';
      summaryInsight = 'Creeper detectado na chunk! Risco iminente de explosão em proximidade. Proteja suas estruturas de Redstone!';
    } else if (hasZumbiOrSkeleton) {
      highestThreat = 'ALTO';
      summaryInsight = 'Ameaças armadas detectadas. Equipe armadura de ferro e escudo antes de engajar o combate.';
    } else if (hasSpider) {
      highestThreat = 'MÉDIO';
      summaryInsight = 'Criatura aracnídea móvel avistada. Cuidado com ataques rápidos de escalada.';
    } else if (data.detections.length > 0) {
      highestThreat = 'BAIXO';
      summaryInsight = 'Entidades neutras ou desconhecidas registradas na viewport.';
    }

    const finalResult: ScanResult = {
      id: `scan_${Date.now()}`,
      name: fileName.substring(0, 16).toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      imageUrl: imageUrl,
      threatLevel: highestThreat,
      entitiesCount: data.detections.length,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      depth: `${Math.floor(Math.random() * 32) + 4}m`,
      boundingBoxes: data.detections.map(d => ({
        label: d.class.toUpperCase(),
        confidence: Math.round(d.confidence * 100),
        top: Math.round((d.box[1] / data.height) * 100),
        left: Math.round((d.box[0] / data.width) * 100),
        width: Math.round(((d.box[2] - d.box[0]) / data.width) * 100),
        height: Math.round(((d.box[3] - d.box[1]) / data.height) * 100),
        color: getClassColor(d.class)
      })),
      insight: summaryInsight,
      apiResponse: data
    };

    setTimeout(() => {
      setIsScanning(false);
      setApiData(data);
      setActiveScanResult(finalResult);
      onScanComplete(finalResult);
    }, 400);
  };

  const loadPreset = (preset: typeof PRESET_SCANS[0]) => {
    setErrorMessage(null);
    setIsLive(false);
    setSelectedImage(preset.imageUrl);
    setIsScanning(true);
    setScanProgress(20);
    setScanStepText('RECORTANDO COORDENADAS DO PRESET...');

    setTimeout(() => {
      setScanProgress(70);
      setScanStepText('MAPEANDO POLÍGONOS DE TEXTURA...');
      
      setTimeout(() => {
        const finalResult: ScanResult = {
          id: `scan_${preset.mob.toLowerCase()}_${Date.now()}`,
          name: `${preset.mob.toUpperCase()}_PRESET`,
          imageUrl: preset.imageUrl,
          threatLevel: preset.threatLevel,
          entitiesCount: preset.detections.length,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          depth: '12m',
          boundingBoxes: preset.detections.map(d => ({
            label: d.class.toUpperCase(),
            confidence: Math.round(d.confidence * 100),
            top: Math.round((d.box[1] / preset.height) * 100),
            left: Math.round((d.box[0] / preset.width) * 100),
            width: Math.round(((d.box[2] - d.box[0]) / preset.width) * 100),
            height: Math.round(((d.box[3] - d.box[1]) / preset.height) * 100),
            color: getClassColor(d.class)
          })),
          insight: preset.insight,
          apiResponse: {
            width: preset.width,
            height: preset.height,
            detections: preset.detections
          }
        };

        setIsScanning(false);
        setApiData({
          width: preset.width,
          height: preset.height,
          detections: preset.detections
        });
        setActiveScanResult(finalResult);
        onScanComplete(finalResult);
      }, 300);
    }, 300);
  };

  const toggleLiveStream = () => {
    if (isLive) {
      setIsLive(false);
      if (liveInterval) clearInterval(liveInterval);
      setSelectedImage(null);
      setActiveScanResult(null);
      setApiData(null);
    } else {
      setIsLive(true);
      // Load Dark Forest Preset as start feed
      loadPreset(PRESET_SCANS[0]);
    }
  };

  // Help calculate text background tag sizes dynamically for precise SVG look
  const calculateTextWidth = (cls: string, conf: number) => {
    return (cls.length + 6) * 8.2 + 8;
  };

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 py-4">
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 border border-primary/30 font-mono text-[10px] font-bold text-primary uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span>SISTEMA INTEGRADO YOLO V8 + POLYGON MASKS</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-none uppercase tracking-tight select-none">
            Analise de Mobs <br /> <span className="text-primary font-display">YOLOCraft</span>
          </h1>
          <p className="font-sans text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
            Mapeie o contorno das ameaças hostis. Envie capturas de tela ou pressione <span className="text-primary font-mono font-bold">Ctrl + V</span> para colar diretamente uma imagem da área de transferência. O pipeline de Redstone YOLO realiza a segmentação de contornos pixelados instantaneamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={triggerUploadClick}
              disabled={isScanning}
              className="px-6 py-3.5 bg-primary hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>ENVIAR OU COLAR (CTRL + V)</span>
            </button>
          </div>
        </div>

        {/* Biome Presets Switcher Frame */}
        <div className="w-full lg:w-2/5 bg-[#111111] p-6 border border-[#333333] relative">
          <div className="corner-bracket-tl"></div>
          <div className="corner-bracket-tr"></div>
          <div className="corner-bracket-bl"></div>
          <div className="corner-bracket-br"></div>

          <h3 className="font-display text-base text-secondary uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
            <Radar className="w-4 h-4 text-secondary" />
            <span>Varreduras de Teste Rapido</span>
          </h3>
          <p className="font-sans text-xs text-gray-400 leading-relaxed mb-4 font-normal">
            Não tem uma captura disponível? Clique em um dos cenários abaixo para rodar o pipeline com dados de teste integrados:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PRESET_SCANS.map((p, i) => (
              <button
                key={i}
                onClick={() => loadPreset(p)}
                disabled={isScanning}
                className="p-3 bg-[#161616] hover:bg-[#222222] text-left border border-[#262626] hover:border-primary cursor-pointer flex flex-col gap-1 transition-all disabled:opacity-50"
              >
                <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">{p.mob}</span>
                <span className="font-sans text-xs text-white truncate font-medium">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Analysis Screen Viewport */}
      {(selectedImage || isScanning) && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* LEFT: Tactical Viewport Frame */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
                <h2 className="font-display text-lg text-white font-bold uppercase tracking-wider">Visor Optico Principal</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase ${
                  serverMode === 'real' 
                    ? 'text-primary bg-primary/5 border-primary/20' 
                    : 'text-amber-500 bg-amber-500/5 border-amber-500/20'
                }`}>
                  {serverMode === 'real' ? 'Servidor Real' : 'Simulação Offline'}
                </span>
                {serverMode === 'simulated' && (
                  <button 
                    onClick={() => {
                      setServerMode('real');
                      alert('Conexão configurada para enviar requisições reais para: ' + API_BASE_URL);
                    }}
                    className="font-mono text-[10px] text-gray-500 hover:text-white underline cursor-pointer"
                  >
                    Ativar Real
                  </button>
                )}
              </div>
            </div>

            {/* SVG Interactive Canvas Container */}
            <div 
              className="scan-frame w-full aspect-video flex flex-col items-center justify-center relative overflow-hidden bg-[#111111] border border-[#333333]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isScanning && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 z-20">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <div className="font-mono text-xs text-primary font-bold uppercase tracking-widest animate-pulse mb-3">
                    {scanStepText}
                  </div>
                  <div className="w-64 bg-[#111111] h-2 border border-[#333333] p-0.5">
                    <div 
                      className="bg-primary h-full transition-all duration-100" 
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-gray-500 mt-2">{scanProgress}% COMPLETO</span>
                </div>
              )}

              {/* Responsive SVG Viewer with raw coordinate tracking */}
              {selectedImage && apiData && !isScanning && (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <svg 
                    viewBox={`0 0 ${apiData.width} ${apiData.height}`} 
                    className="w-full h-full object-contain select-none"
                  >
                    <defs>
                      {/* Mask for dimming background and keeping polygon at 100% brightness */}
                      {viewMode === 'highlight' && (
                        <mask id="spotlight-mask">
                          {/* Fill white means fully dimmed */}
                          <rect x="0" y="0" width={apiData.width} height={apiData.height} fill="white" />
                          {/* Draw black polygon overlay holes to bypass the mask and shine at full brightness */}
                          {apiData.detections.map((d, i) => {
                            if (d.confidence * 100 < confidenceThreshold) return null;
                            if (!d.polygon || d.polygon.length === 0) return null;
                            return (
                              <polygon 
                                key={i} 
                                points={d.polygon.map(p => `${p[0]},${p[1]}`).join(' ')} 
                                fill="black" 
                              />
                            );
                          })}
                        </mask>
                      )}
                    </defs>

                    {/* Ground Image */}
                    <image 
                      href={selectedImage} 
                      width={apiData.width} 
                      height={apiData.height} 
                    />

                    {/* Dim Overlay Rect */}
                    {viewMode === 'highlight' && (
                      <rect 
                        x="0" 
                        y="0" 
                        width={apiData.width} 
                        height={apiData.height} 
                        fill="rgba(0, 0, 0, 0.7)" 
                        mask="url(#spotlight-mask)" 
                      />
                    )}

                    {/* Draw Detections layer */}
                    {apiData.detections.map((d, i) => {
                      const isFiltered = d.confidence * 100 < confidenceThreshold;
                      if (isFiltered) return null;

                      const color = getClassColor(d.class);
                      const hasPolygon = d.polygon && d.polygon.length > 0;

                      return (
                        <g key={i}>
                          {/* 1. Draw Segmentation Contour */}
                          {hasPolygon && (viewMode === 'overlay' || viewMode === 'highlight') && (
                            <polygon
                              points={d.polygon.map(p => `${p[0]},${p[1]}`).join(' ')}
                              fill={viewMode === 'highlight' ? 'none' : `${color}4D`}
                              stroke={color}
                              strokeWidth="3"
                              className="transition-all duration-200"
                            />
                          )}

                          {/* 2. Draw Classic Bounding Box */}
                          {(viewMode === 'bbox' || (!hasPolygon && (viewMode === 'overlay' || viewMode === 'highlight'))) && (
                            <rect
                              x={d.box[0]}
                              y={d.box[1]}
                              width={d.box[2] - d.box[0]}
                              height={d.box[3] - d.box[1]}
                              fill="none"
                              stroke={color}
                              strokeWidth="2"
                              className="transition-all duration-200"
                            />
                          )}

                          {/* 3. Label Tag above target */}
                          {viewMode !== 'highlight' && (
                            <g>
                              <rect
                                x={d.box[0]}
                                y={Math.max(0, d.box[1] - 22)}
                                width={calculateTextWidth(d.class, d.confidence)}
                                height="20"
                                fill={color}
                              />
                              <text
                                x={d.box[0] + 6}
                                y={Math.max(14, d.box[1] - 8)}
                                fill="#000000"
                                fontSize="10.5"
                                fontWeight="bold"
                                fontFamily="monospace"
                                className="uppercase font-mono"
                              >
                                {d.class} {Math.round(d.confidence * 100)}%
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                  
                  {errorMessage && (
                    <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 border border-red-500/30 p-3 text-red-300 font-mono text-[10px] uppercase flex gap-2 items-center">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Real-time Computer Vision Control Panel */}
            <div className="bg-[#111111] p-6 border border-[#333333] space-y-6 relative">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>
              
              <div className="flex items-center gap-2 border-b border-[#222222] pb-3">
                <Layers className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">Modos de Visualização & Pipeline</span>
              </div>

              {/* View Modes Selector (Modos de Visualização) */}
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block">
                  Alternar Visualização
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setViewMode('bbox')}
                    className={`px-3 py-2.5 font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      viewMode === 'bbox'
                        ? 'bg-primary text-black border-primary'
                        : 'bg-[#161616] text-gray-400 border-[#262626] hover:border-gray-500'
                    }`}
                  >
                    CAIXAS ENQUADRADAS
                  </button>
                  <button
                    onClick={() => setViewMode('highlight')}
                    className={`px-3 py-2.5 font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      viewMode === 'highlight'
                        ? 'bg-primary text-black border-primary'
                        : 'bg-[#161616] text-gray-400 border-[#262626] hover:border-gray-500'
                    }`}
                  >
                    FOCO / DESTAQUE (SPOTLIGHT)
                  </button>
                  <button
                    onClick={() => setViewMode('overlay')}
                    className={`px-3 py-2.5 font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      viewMode === 'overlay'
                        ? 'bg-primary text-black border-primary'
                        : 'bg-[#161616] text-gray-400 border-[#262626] hover:border-gray-500'
                    }`}
                  >
                    MÁSCARA COLORIDA (OVERLAY)
                  </button>
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="bg-[#161616] p-4 border border-[#222222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-400 uppercase block tracking-wider">FILTRO DE CONFIDÊNCIA DO SENSOR</span>
                  <span className="font-mono text-xs text-primary font-bold">{confidenceThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="95" 
                  value={confidenceThreshold} 
                  onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                  className="w-full accent-primary bg-[#222222] h-1"
                />
                <span className="font-mono text-[8px] text-gray-500 block">Esconde detecções abaixo desta probabilidade de acerto</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Legend, Telemetry, and Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111111] p-6 border border-[#333333] relative">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <h3 className="font-display text-base text-secondary font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Legenda do Radar de Mobs</span>
              </h3>

              {activeScanResult && apiData ? (
                <div className="space-y-6 font-mono">
                  
                  {/* Legend inventory slots */}
                  <div className="space-y-3">
                    {apiData.detections.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-xs font-mono border border-dashed border-[#333] p-4 uppercase">
                        Nenhum mob detectado nesta captura.
                      </div>
                    ) : (
                      apiData.detections.map((d, idx) => {
                        const isFiltered = d.confidence * 100 < confidenceThreshold;
                        if (isFiltered) return null;

                        const color = getClassColor(d.class);
                        const hasPolygon = d.polygon && d.polygon.length > 0;

                        return (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (onViewMobDetails) {
                                onViewMobDetails(d.class);
                              }
                            }}
                            className="p-3 bg-[#161616] hover:bg-[#1f1f1f] hover:border-primary/50 cursor-pointer border border-[#222222] space-y-2 transition-all group/legend"
                            title="Clique para abrir detalhes na Enciclopédia"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div 
                                  className="w-3 h-3 border"
                                  style={{ backgroundColor: color, borderColor: color }}
                                />
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider group-hover/legend:text-primary transition-colors">
                                  {d.class}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] text-gray-500 group-hover/legend:text-primary transition-colors font-bold uppercase tracking-widest mr-2">VER DETALHES →</span>
                                <span className="text-xs text-primary font-bold">{Math.round(d.confidence * 100)}% CONFIANÇA</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 border-t border-[#222222]/60 pt-2 font-mono">
                              <div>
                                <span className="text-gray-500 uppercase block text-[8px]">Enquadramento Box</span>
                                <span className="text-white">[{d.box.map(Math.round).join(', ')}]</span>
                              </div>
                              <div>
                                <span className="text-gray-500 uppercase block text-[8px]">Pontos Polígono</span>
                                <span className="text-primary font-bold">
                                  {hasPolygon ? `${d.polygon.length} vértices` : 'Sem máscara'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="w-full bg-[#222222] h-1 mt-1">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${d.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#222222] pt-4 text-xs">
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[10px]">GRAU DE RISCO</span>
                      <span className={`text-sm font-bold ${
                        activeScanResult.threatLevel === 'CRÍTICO' ? 'text-red-500' :
                        activeScanResult.threatLevel === 'ALTO' ? 'text-amber-500' : 'text-primary'
                      }`}>{activeScanResult.threatLevel}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[10px]">TOTAL CATALOGADO</span>
                      <span className="text-sm text-primary font-bold">
                        {apiData.detections.filter(b => b.confidence * 100 >= confidenceThreshold).length} Mobs
                      </span>
                    </div>
                  </div>

                  {/* Tactical advice card */}
                  <div className="bg-[#111] border border-red-950/40 text-gray-300 p-4 text-[11px] leading-relaxed relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/50"></div>
                    <div className="flex gap-2.5 items-start pl-1">
                      <Info className="w-4 h-4 shrink-0 text-red-400" />
                      <p>{activeScanResult.insight}</p>
                    </div>
                  </div>

                  {/* Operational actions */}
                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => alert(`Salvando exportação JSON para os registros: \n${JSON.stringify(apiData, null, 2)}`)}
                      className="flex-1 bg-[#161616] text-gray-300 hover:text-primary py-3 border border-[#333333] hover:border-primary text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>EXPORTAR JSON</span>
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedImage(null);
                        setActiveScanResult(null);
                        setIsLive(false);
                        setApiData(null);
                      }}
                      className="px-4 bg-red-950/20 hover:bg-red-900/30 text-red-400 py-3 border border-red-900/30 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      LIMPAR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600 text-xs tracking-wider uppercase">
                  AGUARDANDO PROCESSO DO SCANNER...
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
