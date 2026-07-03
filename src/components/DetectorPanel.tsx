import React, { useState, useRef, useEffect } from 'react';
import { ScanResult, ApiPredictResponse, ApiDetection } from '../types';
import { UploadCloud, Radar, Shield, Eye, Download, Info, Check, RefreshCw, Layers, AlertTriangle, Search, Sparkles, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface DetectorPanelProps {
  onScanComplete: (result: ScanResult) => void;
  recentScans: ScanResult[];
  externalLoadScan?: ScanResult | null;
  onClearExternalLoad?: () => void;
  onViewMobDetails?: (mobClass: string) => void;
  apiStatus?: 'online' | 'offline' | 'checking';
  onViewMethodDetails?: (method: 'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed') => void;
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
    threatLevel: 'CRITICO' as const,
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
    threatLevel: 'MEDIO' as const,
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
    threatLevel: 'CRITICO' as const,
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
  onViewMobDetails,
  apiStatus = 'checking',
  onViewMethodDetails
}: DetectorPanelProps) {
  const { language, t, translateMob } = useLanguage();
  const [detectorMode, setDetectorMode] = useState<'individual' | 'comparative'>('individual');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('AGUARDANDO ENTRADA');
  const [activeScanResult, setActiveScanResult] = useState<ScanResult | null>(null);
  const [apiData, setApiData] = useState<ApiPredictResponse | null>(null);
  const [comparativeData, setComparativeData] = useState<{
    sam: ApiPredictResponse | null;
    otsu: ApiPredictResponse | null;
    hsv: ApiPredictResponse | null;
    grabcut: ApiPredictResponse | null;
    watershed: ApiPredictResponse | null;
  } | null>(null);

  // Classical prediction parameters states
  const [marginRatio, setMarginRatio] = useState(0.25);
  const [grabcutIterations, setGrabcutIterations] = useState(5);
  const [hsvThreshold, setHsvThreshold] = useState(2.2);
  const [watershedFgRatio, setWatershedFgRatio] = useState(0.5);
  const [polyEpsilon, setPolyEpsilon] = useState(1.5);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentPreset, setCurrentPreset] = useState<typeof PRESET_SCANS[0] | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed' | null>(null);

  // Connection modes
  const [serverMode, setServerMode] = useState<'real' | 'simulated'>('real');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Pipeline settings
  const [viewMode, setViewMode] = useState<'bbox' | 'highlight' | 'overlay' | 'threshold'>('highlight');
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [isLive, setIsLive] = useState(false);
  const [liveInterval, setLiveInterval] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<any>(null);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://stimulate-excusably-subsystem.ngrok-free.dev';

  // State for dataset test image search
  const [sampleClasses, setSampleClasses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [samples, setSamples] = useState<Array<{ name: string; url: string; classes: string[] }>>([]);
  const [isFetchingSamples, setIsFetchingSamples] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSampleClasses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/samples/classes`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.classes)) {
          setSampleClasses(data.classes);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sample classes:', err);
    }
  };

  const fetchSamples = async (mobName?: string) => {
    setIsFetchingSamples(true);
    try {
      let url = `${API_BASE_URL.replace(/\/$/, '')}/samples?count=4`;
      if (mobName && mobName.trim()) {
        url += `&mob=${encodeURIComponent(mobName.trim())}`;
      }
      const res = await fetch(url, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.samples)) {
          setSamples(data.samples);
        }
      }
    } catch (err) {
      console.error('Failed to fetch samples:', err);
    } finally {
      setIsFetchingSamples(false);
    }
  };

  const handleSampleClick = async (sample: { name: string; url: string }) => {
    if (isScanning || isDownloadingSample) return;
    setIsDownloadingSample(sample.url);
    try {
      const fullUrl = `${API_BASE_URL.replace(/\/$/, '')}${sample.url}`;
      const res = await fetch(fullUrl, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch image: ${res.statusText}`);
      }
      const blob = await res.blob();
      const file = new File([blob], sample.name, { type: blob.type || 'image/jpeg' });
      processFile(file);
    } catch (err) {
      console.error('Error loading sample image:', err);
      setErrorMessage(language === 'pt' ? 'Erro ao baixar imagem de teste.' : 'Error downloading sample image.');
    } finally {
      setIsDownloadingSample(null);
    }
  };

  useEffect(() => {
    fetchSampleClasses();
    fetchSamples();
  }, []);

  useEffect(() => {
    // Default to real server mode using the provided ngrok API url
    setServerMode('real');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (liveInterval) clearInterval(liveInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (externalLoadScan) {
      setSelectedImage(externalLoadScan.imageUrl);
      setActiveScanResult(externalLoadScan);
      setZoomedIndex(null);
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
    if (apiStatus === 'offline') return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (apiStatus === 'offline') return;
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerUploadClick = () => {
    if (apiStatus === 'offline') return;
    fileInputRef.current?.click();
  };

  // Reference to avoid stale processFile closures in global event listener
  const processFileRef = useRef(processFile);
  useEffect(() => {
    processFileRef.current = processFile;
  }, [processFile]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (apiStatus === 'offline') return;
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
  }, [apiStatus]);

  const getSimulatedEngineDetections = (
    method: 'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed',
    w: number,
    h: number,
    fileName: string
  ): ApiDetection[] => {
    const fn = fileName.toLowerCase();
    const detections: ApiDetection[] = [];
    
    // Check if filename suggests certain mobs, otherwise do random/fallback
    const hasCreeper = fn.includes('creeper') || fn.includes('floresta') || Math.random() > 0.4;
    const hasSkeleton = fn.includes('esqueleto') || fn.includes('caverna') || Math.random() > 0.5;
    const hasZombie = fn.includes('zumbi') || fn.includes('vale') || Math.random() > 0.6;

    if (method === 'sam') {
      if (hasCreeper) {
        const x1 = Math.round(w * 0.38);
        const y1 = Math.round(h * 0.32);
        const x2 = Math.round(w * 0.62);
        const y2 = Math.round(h * 0.82);
        detections.push({
          class: 'creeper',
          confidence: 0.96,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'creeper')
        });
      }
      if (hasSkeleton) {
        const x1 = Math.round(w * 0.15);
        const y1 = Math.round(h * 0.22);
        const x2 = Math.round(w * 0.38);
        const y2 = Math.round(h * 0.86);
        detections.push({
          class: 'esqueleto',
          confidence: 0.93,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'esqueleto')
        });
      }
      if (hasZombie) {
        const x1 = Math.round(w * 0.65);
        const y1 = Math.round(h * 0.25);
        const x2 = Math.round(w * 0.88);
        const y2 = Math.round(h * 0.84);
        detections.push({
          class: 'zumbi',
          confidence: 0.89,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'zumbi')
        });
      }
    } else if (method === 'otsu') {
      if (hasCreeper) {
        const x1 = Math.round(w * 0.35);
        const y1 = Math.round(h * 0.34);
        const x2 = Math.round(w * 0.64);
        const y2 = Math.round(h * 0.80);
        detections.push({
          class: 'creeper',
          confidence: 0.71,
          box: [x1, y1, x2, y2],
          polygon: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]
        });
      }
      if (hasZombie) {
        const x1 = Math.round(w * 0.62);
        const y1 = Math.round(h * 0.28);
        const x2 = Math.round(w * 0.90);
        const y2 = Math.round(h * 0.82);
        detections.push({
          class: 'zumbi',
          confidence: 0.61,
          box: [x1, y1, x2, y2],
          polygon: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]
        });
      }
    } else if (method === 'hsv') {
      if (hasCreeper) {
        const x1 = Math.round(w * 0.39);
        const y1 = Math.round(h * 0.31);
        const x2 = Math.round(w * 0.61);
        const y2 = Math.round(h * 0.83);
        detections.push({
          class: 'creeper',
          confidence: 0.78,
          box: [x1, y1, x2, y2],
          polygon: [
            [x1, y1], [x1 + 30, y1 + 10], [x2, y1 + 20], [x2, y2 - 40], [x2 - 15, y2], [x1, y2]
          ]
        });
      }
      if (hasSkeleton) {
        const x1 = Math.round(w * 0.12);
        const y1 = Math.round(h * 0.20);
        const x2 = Math.round(w * 0.40);
        const y2 = Math.round(h * 0.89);
        detections.push({
          class: 'esqueleto',
          confidence: 0.55,
          box: [x1, y1, x2, y2],
          polygon: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]
        });
      }
    } else if (method === 'grabcut') {
      if (hasCreeper) {
        const x1 = Math.round(w * 0.37);
        const y1 = Math.round(h * 0.33);
        const x2 = Math.round(w * 0.63);
        const y2 = Math.round(h * 0.81);
        detections.push({
          class: 'creeper',
          confidence: 0.85,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'creeper').filter((_, idx) => idx % 2 === 0)
        });
      }
      if (hasSkeleton) {
        const x1 = Math.round(w * 0.16);
        const y1 = Math.round(h * 0.23);
        const x2 = Math.round(w * 0.37);
        const y2 = Math.round(h * 0.85);
        detections.push({
          class: 'esqueleto',
          confidence: 0.82,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'esqueleto').filter((_, idx) => idx % 2 === 0)
        });
      }
    } else if (method === 'watershed') {
      if (hasCreeper) {
        const x1 = Math.round(w * 0.36);
        const y1 = Math.round(h * 0.35);
        const x2 = Math.round(w * 0.64);
        const y2 = Math.round(h * 0.82);
        detections.push({
          class: 'creeper',
          confidence: 0.81,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'creeper').filter((_, idx) => idx % 2 === 1)
        });
      }
      if (hasSkeleton) {
        const x1 = Math.round(w * 0.17);
        const y1 = Math.round(h * 0.24);
        const x2 = Math.round(w * 0.38);
        const y2 = Math.round(h * 0.84);
        detections.push({
          class: 'esqueleto',
          confidence: 0.78,
          box: [x1, y1, x2, y2],
          polygon: generateMockPolygon(x1, y1, x2, y2, 'esqueleto').filter((_, idx) => idx % 2 === 1)
        });
      }
    }
    
    return detections;
  };

  const simulateComparativeLocal = (imageUrl: string, fileName: string, w: number, h: number) => {
    const samDetections = getSimulatedEngineDetections('sam', w, h, fileName);
    const otsuDetections = getSimulatedEngineDetections('otsu', w, h, fileName);
    const hsvDetections = getSimulatedEngineDetections('hsv', w, h, fileName);
    const grabcutDetections = getSimulatedEngineDetections('grabcut', w, h, fileName);
    const watershedDetections = getSimulatedEngineDetections('watershed', w, h, fileName);

    const mockSam: ApiPredictResponse = { width: w, height: h, detections: samDetections };
    const mockOtsu: ApiPredictResponse = { width: w, height: h, detections: otsuDetections };
    const mockHsv: ApiPredictResponse = { width: w, height: h, detections: hsvDetections };
    const mockGrabcut: ApiPredictResponse = { width: w, height: h, detections: grabcutDetections };
    const mockWatershed: ApiPredictResponse = { width: w, height: h, detections: watershedDetections };

    setComparativeData({
      sam: mockSam,
      otsu: mockOtsu,
      hsv: mockHsv,
      grabcut: mockGrabcut,
      watershed: mockWatershed
    });

    setApiData(mockSam);
    finishScan(imageUrl, fileName, mockSam);
  };

  // Re-run classical predictions when slider parameters are adjusted
  const reRunClassicPrediction = async () => {
    if (!currentFile || serverMode !== 'real') return;
    
    try {
      const runEngine = async (method: 'otsu' | 'hsv' | 'grabcut' | 'watershed'): Promise<ApiPredictResponse> => {
        const form = new FormData();
        form.append("file", currentFile);
        
        let url = `${API_BASE_URL.replace(/\/$/, '')}/predict/classic?method=${method}`;
        url += `&margin_ratio=${marginRatio}`;
        url += `&poly_epsilon=${polyEpsilon}`;
        if (method === 'grabcut') {
          url += `&grabcut_iterations=${grabcutIterations}`;
        } else if (method === 'hsv') {
          url += `&hsv_threshold=${hsvThreshold}`;
        } else if (method === 'watershed') {
          url += `&watershed_fg_ratio=${watershedFgRatio}`;
        }
        
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'ngrok-skip-browser-warning': 'true' },
          body: form
        });
        
        if (!res.ok) {
          throw new Error(`Engine ${method.toUpperCase()} falhou (${res.status})`);
        }
        return await res.json();
      };

      const [otsuRes, hsvRes, grabcutRes, watershedRes] = await Promise.all([
        runEngine('otsu').catch(err => {
          console.error('OTSU Engine error:', err);
          return comparativeData?.otsu || { width: 800, height: 450, detections: [] };
        }),
        runEngine('hsv').catch(err => {
          console.error('HSV Engine error:', err);
          return comparativeData?.hsv || { width: 800, height: 450, detections: [] };
        }),
        runEngine('grabcut').catch(err => {
          console.error('GrabCut Engine error:', err);
          return comparativeData?.grabcut || { width: 800, height: 450, detections: [] };
        }),
        runEngine('watershed').catch(err => {
          console.error('Watershed Engine error:', err);
          return comparativeData?.watershed || { width: 800, height: 450, detections: [] };
        })
      ]);

      setComparativeData(prev => ({
        sam: prev?.sam || null,
        otsu: otsuRes,
        hsv: hsvRes,
        grabcut: grabcutRes,
        watershed: watershedRes
      }));
    } catch (error) {
      console.error('Error re-running classic predictions:', error);
    }
  };

  // Debounced effect to re-run classical CV engines in real time on slider changes
  useEffect(() => {
    if (currentFile && detectorMode === 'comparative' && !isScanning) {
      const handler = setTimeout(() => {
        reRunClassicPrediction();
      }, 400); // 400ms debounce
      return () => clearTimeout(handler);
    }
  }, [marginRatio, grabcutIterations, hsvThreshold, watershedFgRatio, polyEpsilon, currentFile, detectorMode]);

  // Main client file processing
  function processFile(file: File) {
    setErrorMessage(null);
    setIsLive(false);
    setZoomedIndex(null);
    setCurrentFile(file);
    setCurrentPreset(null);
    setExpandedMethod(null);
    
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
      
      setScanProgress(20);

      if (serverMode === 'real') {
        if (detectorMode === 'comparative') {
          setScanStepText('CONECTANDO ENGINES COMPARATIVAS...');
          
          const runEngine = async (method: 'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed'): Promise<ApiPredictResponse> => {
            const form = new FormData();
            form.append("file", file);
            
            let url = `${API_BASE_URL.replace(/\/$/, '')}/predict`;
            if (method !== 'sam') {
              url = `${API_BASE_URL.replace(/\/$/, '')}/predict/classic?method=${method}`;
              url += `&margin_ratio=${marginRatio}`;
              url += `&poly_epsilon=${polyEpsilon}`;
              if (method === 'grabcut') {
                url += `&grabcut_iterations=${grabcutIterations}`;
              } else if (method === 'hsv') {
                url += `&hsv_threshold=${hsvThreshold}`;
              } else if (method === 'watershed') {
                url += `&watershed_fg_ratio=${watershedFgRatio}`;
              }
            }
            
            const res = await fetch(url, {
              method: 'POST',
              headers: {
                'ngrok-skip-browser-warning': 'true'
              },
              body: form
            });
            
            if (!res.ok) {
              throw new Error(`Engine ${method.toUpperCase()} falhou (${res.status})`);
            }
            
            return await res.json();
          };

          try {
            setScanProgress(45);
            setScanStepText('RODANDO 5 ALGORITMOS EM PARALELO...');
            
            const [samRes, otsuRes, hsvRes, grabcutRes, watershedRes] = await Promise.all([
              runEngine('sam').catch(err => {
                console.error('SAM Engine error:', err);
                return { width: originalW, height: originalH, detections: getSimulatedEngineDetections('sam', originalW, originalH, file.name) };
              }),
              runEngine('otsu').catch(err => {
                console.error('OTSU Engine error:', err);
                return { width: originalW, height: originalH, detections: getSimulatedEngineDetections('otsu', originalW, originalH, file.name) };
              }),
              runEngine('hsv').catch(err => {
                console.error('HSV Engine error:', err);
                return { width: originalW, height: originalH, detections: getSimulatedEngineDetections('hsv', originalW, originalH, file.name) };
              }),
              runEngine('grabcut').catch(err => {
                console.error('GrabCut Engine error:', err);
                return { width: originalW, height: originalH, detections: getSimulatedEngineDetections('grabcut', originalW, originalH, file.name) };
              }),
              runEngine('watershed').catch(err => {
                console.error('Watershed Engine error:', err);
                return { width: originalW, height: originalH, detections: getSimulatedEngineDetections('watershed', originalW, originalH, file.name) };
              })
            ]);
            
            setScanProgress(85);
            setScanStepText('DECODIFICANDO COMPARATIVO MULTI-MODAL...');
            
            setComparativeData({
              sam: samRes,
              otsu: otsuRes,
              hsv: hsvRes,
              grabcut: grabcutRes,
              watershed: watershedRes
            });
            
            setApiData(samRes);
            finishScan(imageUrl, file.name, samRes);
          } catch (err: any) {
            console.error(err);
            setErrorMessage(`Falha na API comparativa: ${err.message || 'Erro de conexão'}. Ativando simulação local.`);
            setServerMode('simulated');
            simulateComparativeLocal(imageUrl, file.name, originalW, originalH);
          }
        } else {
          setScanStepText('CONECTANDO AO SERVIDOR DE IA...');
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
            
            setApiData(data);
            finishScan(imageUrl, file.name, data);
          } catch (err: any) {
            console.error(err);
            setErrorMessage(`Falha na API: ${err.message || 'Erro de conexão'}. Alternando para modo de simulação local para esta imagem.`);
            setServerMode('simulated');
            simulateLocalScan(imageUrl, file.name, originalW, originalH);
          }
        }
      } else {
        // Simulated local path
        setTimeout(() => {
          setScanProgress(65);
          setScanStepText('SIMULANDO RESPOSTA DA REDE NEURAL...');
          setTimeout(() => {
            if (detectorMode === 'comparative') {
              simulateComparativeLocal(imageUrl, file.name, originalW, originalH);
            } else {
              simulateLocalScan(imageUrl, file.name, originalW, originalH);
            }
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
    setScanStepText('SEGMENTACAO CONCLUIDA!');
    
    // Evaluate main threat level
    let highestThreat: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAIXO' = 'BAIXO';
    let summaryInsight = 'Nenhuma ameaça hostil detectada no visor.';

    const hasCreeper = data.detections.some(d => d.class.toLowerCase().includes('creeper'));
    const hasZumbiOrSkeleton = data.detections.some(d => d.class.toLowerCase().includes('zumbi') || d.class.toLowerCase().includes('zombie') || d.class.toLowerCase().includes('skeleton') || d.class.toLowerCase().includes('esqueleto'));
    const hasSpider = data.detections.some(d => d.class.toLowerCase().includes('aranha') || d.class.toLowerCase().includes('spider'));

    if (hasCreeper) {
      highestThreat = 'CRITICO';
      summaryInsight = 'Creeper detectado na chunk! Risco iminente de explosão em proximidade. Proteja suas estruturas de Redstone!';
    } else if (hasZumbiOrSkeleton) {
      highestThreat = 'ALTO';
      summaryInsight = 'Ameaças armadas detectadas. Equipe armadura de ferro e escudo antes de engajar o combate.';
    } else if (hasSpider) {
      highestThreat = 'MEDIO';
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
    setZoomedIndex(null);
    setSelectedImage(preset.imageUrl);
    setCurrentPreset(preset);
    setCurrentFile(null);
    setExpandedMethod(null);
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

        if (detectorMode === 'comparative') {
          // Generate simulated classic methods
          const otsuDetections: ApiDetection[] = preset.detections.map(d => ({
            ...d,
            confidence: Math.max(0.5, Number((d.confidence - 0.25).toFixed(2))),
            polygon: [
              [d.box[0], d.box[1]],
              [d.box[2], d.box[1]],
              [d.box[2], d.box[3]],
              [d.box[0], d.box[3]]
            ] // Otsu doesn't have fine polygon, just box corners
          }));

          const hsvDetections: ApiDetection[] = preset.detections.map(d => ({
            ...d,
            confidence: Math.max(0.4, Number((d.confidence - 0.35).toFixed(2))),
            // slightly shifted box for HSV
            box: [d.box[0] + 8, d.box[1] - 8, d.box[2] - 8, d.box[3] + 8] as [number, number, number, number],
            polygon: [
              [d.box[0] + 8, d.box[1] - 8],
              [d.box[2] - 8, d.box[1] - 8],
              [d.box[2] - 8, d.box[3] + 8],
              [d.box[0] + 8, d.box[3] + 8]
            ]
          }));

          const grabcutDetections: ApiDetection[] = preset.detections.map(d => ({
            ...d,
            confidence: Math.max(0.6, Number((d.confidence - 0.15).toFixed(2))),
            polygon: d.polygon.filter((_, idx) => idx % 2 === 0) // simpler polygon
          }));

          const watershedDetections: ApiDetection[] = preset.detections.map(d => ({
            ...d,
            confidence: Math.max(0.5, Number((d.confidence - 0.20).toFixed(2))),
            polygon: d.polygon.filter((_, idx) => idx % 2 === 1) // different simulated polygon shape
          }));

          setComparativeData({
            sam: { width: preset.width, height: preset.height, detections: preset.detections },
            otsu: { width: preset.width, height: preset.height, detections: otsuDetections },
            hsv: { width: preset.width, height: preset.height, detections: hsvDetections },
            grabcut: { width: preset.width, height: preset.height, detections: grabcutDetections },
            watershed: { width: preset.width, height: preset.height, detections: watershedDetections }
          });
        }

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
    setZoomedIndex(null);
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

  const getConstrainedPredictions = (
    vData: ApiPredictResponse,
    methodKey: 'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed'
  ): ApiPredictResponse => {
    if (methodKey === 'sam') return vData;

    // Get the reference boxes from the SAM (YOLO) engine
    const yoloDetections = comparativeData?.sam?.detections || [];
    if (yoloDetections.length === 0) {
      // If YOLO didn't detect any boxes, there are no valid targets to restrict classical segmentation to
      return { ...vData, detections: [] };
    }

    const constrainedDetections: ApiDetection[] = [];

    for (const d of vData.detections || []) {
      // Find the YOLO box with the maximum intersection area
      let bestYolo: typeof yoloDetections[0] | null = null;
      let maxIntersectionArea = 0;

      const [cx1, cy1, cx2, cy2] = d.box;
      const cWidth = cx2 - cx1;
      const cHeight = cy2 - cy1;
      if (cWidth <= 0 || cHeight <= 0) continue;

      for (const yolo_d of yoloDetections) {
        const [yx1, yy1, yx2, yy2] = yolo_d.box;
        
        // Calculate intersection rectangle
        const ix1 = Math.max(cx1, yx1);
        const iy1 = Math.max(cy1, yy1);
        const ix2 = Math.min(cx2, yx2);
        const iy2 = Math.min(cy2, yy2);

        const iWidth = ix2 - ix1;
        const iHeight = iy2 - iy1;

        if (iWidth > 0 && iHeight > 0) {
          const intersectionArea = iWidth * iHeight;
          if (intersectionArea > maxIntersectionArea) {
            maxIntersectionArea = intersectionArea;
            bestYolo = yolo_d;
          }
        }
      }

      // If we have a matching YOLO box, constrain/clip this classical detection to it!
      if (bestYolo) {
        const [yx1, yy1, yx2, yy2] = bestYolo.box;

        // 1. Clip bounding box
        const clippedBox: [number, number, number, number] = [
          Math.max(cx1, yx1),
          Math.max(cy1, yy1),
          Math.min(cx2, yx2),
          Math.min(cy2, yy2)
        ];

        // 2. Clip/clamp polygon coordinates
        let clippedPolygon: [number, number][] = [];
        if (d.polygon && d.polygon.length > 0) {
          clippedPolygon = d.polygon.map(([px, py]) => [
            Math.max(yx1, Math.min(yx2, px)),
            Math.max(yy1, Math.min(yy2, py))
          ] as [number, number]);
        }

        constrainedDetections.push({
          ...d,
          class: bestYolo.class, // Inherit class from YOLO detection
          confidence: d.confidence,
          box: clippedBox,
          polygon: clippedPolygon
        });
      }
    }

    return {
      ...vData,
      detections: constrainedDetections
    };
  };

  const renderViewport = (
    vData: ApiPredictResponse,
    methodKey: 'sam' | 'otsu' | 'hsv' | 'grabcut' | 'watershed',
    methodLabel: string,
    isZoomable: boolean = true
  ) => {
    const constrainedData = getConstrainedPredictions(vData, methodKey);
    let viewBoxVal = `0 0 ${vData.width} ${vData.height}`;
    if (zoomedIndex !== null && constrainedData.detections[zoomedIndex] && isZoomable) {
      const d = constrainedData.detections[zoomedIndex];
      const x1 = d.box[0];
      const y1 = d.box[1];
      const x2 = d.box[2];
      const y2 = d.box[3];
      const boxW = x2 - x1;
      const boxH = y2 - y1;
      
      const paddingX = Math.max(35, boxW * 0.35);
      const paddingY = Math.max(35, boxH * 0.35);
      
      const zoomX = Math.max(0, x1 - paddingX);
      const zoomY = Math.max(0, y1 - paddingY);
      const zoomW = Math.min(vData.width - zoomX, boxW + paddingX * 2);
      const zoomH = Math.min(vData.height - zoomY, boxH + paddingY * 2);
      
      viewBoxVal = `${zoomX} ${zoomY} ${zoomW} ${zoomH}`;
    }

    const validDetections = constrainedData.detections || [];
    const isExpanded = expandedMethod === methodKey;

    return (
      <div 
        id={`viewport-${methodKey}`}
        onClick={() => {
          if (detectorMode === 'comparative' && !isExpanded) {
            setExpandedMethod(methodKey);
          }
        }}
        className={`w-full h-full relative flex flex-col bg-black border transition-all duration-300 group/viewport overflow-hidden ${
          detectorMode === 'comparative' && !isExpanded 
            ? 'cursor-pointer hover:border-primary/60 hover:shadow-[0_0_12px_rgba(238,195,12,0.15)]' 
            : 'border-[#333333]'
        } ${isExpanded ? 'border-primary ring-2 ring-primary/25' : ''}`}
      >
        {/* Click to expand hover overlay */}
        {detectorMode === 'comparative' && !isExpanded && (
          <div className="absolute inset-0 bg-black/5 hover:bg-black/25 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 z-10 pointer-events-none">
            <span className="bg-black/90 border border-primary/40 px-3 py-1.5 font-mono text-[9px] font-bold text-primary tracking-widest uppercase shadow-lg">
              {language === 'pt' ? 'CLIQUE PARA AMPLIAR / EDITAR' : 'CLICK TO EXPAND / EDIT'}
            </span>
          </div>
        )}

        {/* Method Label Badge */}
        <div className="absolute top-2 left-2 z-10 bg-black/85 px-2 py-1 border border-primary/30 font-mono text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span>{methodLabel}</span>
          <span className="text-gray-500 text-[8px]">
            ({validDetections.filter(d => d.confidence * 100 >= confidenceThreshold).length})
          </span>
        </div>

        {/* Method Info / Guide Button */}
        {onViewMethodDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewMethodDetails(methodKey);
            }}
            title={language === 'pt' ? 'Como funciona este método?' : 'How does this method work?'}
            className="absolute top-2 right-2 z-20 bg-black/80 hover:bg-primary border border-[#333333] hover:border-primary p-1.5 text-gray-400 hover:text-black shadow-md transition-all duration-200 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden aspect-video">
          <motion.svg 
            viewBox={viewBoxVal}
            layout
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="w-full h-full object-contain select-none"
          >
            <defs>
              <filter id={`threshold-filter-${methodKey}`}>
                <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" />
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues="0 1" />
                  <feFuncG type="discrete" tableValues="0 1" />
                  <feFuncB type="discrete" tableValues="0 1" />
                </feComponentTransfer>
              </filter>
              {viewMode === 'highlight' && (
                <mask id={`spotlight-mask-${methodKey}`}>
                  <rect x="0" y="0" width={vData.width} height={vData.height} fill="white" />
                  {validDetections.map((d, i) => {
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
              {viewMode === 'threshold' && (
                <mask id={`threshold-mask-${methodKey}`}>
                  <rect x="0" y="0" width={vData.width} height={vData.height} fill="black" />
                  {validDetections.map((d, i) => {
                    if (d.confidence * 100 < confidenceThreshold) return null;
                    const hasPolygon = d.polygon && d.polygon.length > 0;
                    if (hasPolygon) {
                      return (
                        <polygon 
                          key={i} 
                          points={d.polygon.map(p => `${p[0]},${p[1]}`).join(' ')} 
                          fill="white" 
                        />
                      );
                    } else {
                      return (
                        <rect
                          key={i}
                          x={d.box[0]}
                          y={d.box[1]}
                          width={d.box[2] - d.box[0]}
                          height={d.box[3] - d.box[1]}
                          fill="white"
                        />
                      );
                    }
                  })}
                </mask>
              )}
            </defs>

            {/* Black Background for Threshold Mode */}
            {viewMode === 'threshold' && (
              <rect 
                x="0" 
                y="0" 
                width={vData.width} 
                height={vData.height} 
                fill="black" 
              />
            )}

            {/* Ground Image / White Silhouette in Threshold Mode */}
            {viewMode === 'threshold' ? (
              <rect 
                x="0" 
                y="0" 
                width={vData.width} 
                height={vData.height} 
                fill="white" 
                mask={`url(#threshold-mask-${methodKey})`}
              />
            ) : (
              <image 
                href={selectedImage || ''} 
                width={vData.width} 
                height={vData.height} 
              />
            )}

            {/* Dim Overlay Rect */}
            {viewMode === 'highlight' && (
              <rect 
                x="0" 
                y="0" 
                width={vData.width} 
                height={vData.height} 
                fill="rgba(0, 0, 0, 0.7)" 
                mask={`url(#spotlight-mask-${methodKey})`} 
              />
            )}

            {/* Draw Detections layer */}
            {validDetections.map((d, i) => {
              const isFiltered = d.confidence * 100 < confidenceThreshold;
              if (isFiltered) return null;

              const color = getClassColor(d.class);
              const hasPolygon = d.polygon && d.polygon.length > 0;
              const isZoomed = zoomedIndex === i && isZoomable;

              return (
                <g 
                  key={i} 
                  onClick={(e) => {
                    if (detectorMode === 'comparative' && !isExpanded) {
                      e.stopPropagation();
                      setExpandedMethod(methodKey);
                      if (isZoomable) {
                        setZoomedIndex(i);
                      }
                    } else {
                      e.stopPropagation();
                      if (isZoomable) {
                        setZoomedIndex(zoomedIndex === i ? null : i);
                      }
                    }
                  }}
                  className="cursor-pointer group/det"
                >
                  <rect
                    x={d.box[0]}
                    y={d.box[1]}
                    width={d.box[2] - d.box[0]}
                    height={d.box[3] - d.box[1]}
                    fill="#000000"
                    fillOpacity={0}
                    pointerEvents="all"
                    className="cursor-pointer"
                  />

                  {/* 1. Draw Segmentation Contour */}
                  {hasPolygon && (viewMode === 'overlay' || viewMode === 'highlight' || viewMode === 'threshold') && (
                    <polygon
                      points={d.polygon.map(p => `${p[0]},${p[1]}`).join(' ')}
                      fill={viewMode === 'threshold' ? '#ffffff' : (viewMode === 'highlight' ? 'none' : `${color}4D`)}
                      stroke={viewMode === 'threshold' ? '#ffffff' : color}
                      strokeWidth={isZoomed ? "4" : "2.5"}
                      className="transition-all duration-200 group-hover/det:stroke-[3px]"
                    />
                  )}

                  {/* 2. Draw Classic Bounding Box */}
                  {(viewMode === 'bbox' || (!hasPolygon && (viewMode === 'overlay' || viewMode === 'highlight' || viewMode === 'threshold'))) && (
                    <rect
                      x={d.box[0]}
                      y={d.box[1]}
                      width={d.box[2] - d.box[0]}
                      height={d.box[3] - d.box[1]}
                      fill={viewMode === 'threshold' ? '#ffffff' : 'none'}
                      stroke={viewMode === 'threshold' ? '#ffffff' : color}
                      strokeWidth={isZoomed ? "3" : "2"}
                      className="transition-all duration-200 group-hover/det:stroke-[2.5px]"
                    />
                  )}

                  {/* 3. Label Tag above target */}
                  {viewMode !== 'highlight' && viewMode !== 'threshold' && (
                    <g>
                      <rect
                        x={d.box[0]}
                        y={Math.max(0, d.box[1] - 18)}
                        width={calculateTextWidth(translateMob(d.class), d.confidence) * 0.9}
                        height="16"
                        fill={color}
                      />
                      <text
                        x={d.box[0] + 4}
                        y={Math.max(11, d.box[1] - 6)}
                        fill="#000000"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        className="uppercase font-mono font-bold text-[9px]"
                      >
                        {translateMob(d.class)} {Math.round(d.confidence * 100)}%
                      </text>
                    </g>
                  )}

                  {/* 4. Target Lock On Indicator HUD */}
                  {isZoomed && (
                    <g className="animate-pulse">
                      <rect
                        x={d.box[0] - 6}
                        y={d.box[1] - 6}
                        width={d.box[2] - d.box[0] + 12}
                        height={d.box[3] - d.box[1] + 12}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </motion.svg>

          {zoomedIndex !== null && isZoomable && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setZoomedIndex(null);
              }}
              className="absolute top-2 right-2 bg-primary hover:bg-emerald-400 text-black font-mono text-[8px] px-2 py-1 border border-primary font-bold transition-all uppercase tracking-wider shadow-lg z-20 cursor-pointer"
            >
              <span>Reset [ESC]</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 py-4">
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 border border-primary/30 font-mono text-[10px] font-bold text-primary uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span>{t('det_subtitle')}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-none tracking-[0.12em] select-none uppercase">
            {t('det_title')}
          </h1>
          <p className="font-sans text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
            {language === 'pt' 
              ? 'Mapeie o contorno das ameaças hostis. Envie capturas de tela ou pressione Ctrl + V para colar diretamente uma imagem da área de transferência. O pipeline de Redstone YOLO realiza a segmentação de contornos pixelados instantaneamente.'
              : 'Map the contours of hostile threats. Upload screenshots or press Ctrl + V to paste an image directly from the clipboard. The Redstone YOLO pipeline performs pixelated contour segmentation instantly.'}
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
              disabled={isScanning || apiStatus === 'offline'}
              className="px-6 py-3.5 mc-button mc-btn-green text-xs font-bold uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <UploadCloud className="w-4 h-4 text-white" />
              <span className="text-white">
                {apiStatus === 'offline'
                  ? (language === 'pt' ? 'DESATIVADO (API OFFLINE)' : 'DISABLED (API OFFLINE)')
                  : (language === 'pt' ? 'ENVIAR OU COLAR (CTRL + V)' : 'UPLOAD OR PASTE (CTRL + V)')}
              </span>
            </button>
          </div>

          {/* Engine Selector Segment */}
          <div className="bg-[#111111]/80 border border-[#222222] p-4 space-y-3 mt-4 max-w-xl relative">
            <div className="corner-bracket-tl"></div>
            <div className="corner-bracket-tr"></div>
            <div className="corner-bracket-bl"></div>
            <div className="corner-bracket-br"></div>
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block">
              {language === 'pt' ? 'MODO DE SENSORIAMENTO' : 'SENSING MODE'}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setDetectorMode('individual');
                  setZoomedIndex(null);
                  setExpandedMethod(null);
                }}
                disabled={isScanning}
                className={`py-2 px-3 font-mono text-[10px] font-bold tracking-wider transition-all uppercase flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 cursor-pointer ${
                  detectorMode === 'individual'
                    ? 'mc-button mc-btn-green'
                    : 'mc-button bg-[#161616]'
                }`}
              >
                <span>{t('single_mode')}</span>
                <span className="text-[7.5px] font-normal text-gray-400 lowercase">yolo + sam pipeline</span>
              </button>
              <button
                onClick={() => {
                  setDetectorMode('comparative');
                  setZoomedIndex(null);
                  if (currentFile) {
                    processFile(currentFile);
                  } else if (currentPreset) {
                    loadPreset(currentPreset);
                  }
                }}
                disabled={isScanning}
                className={`py-2 px-3 font-mono text-[10px] font-bold tracking-wider transition-all uppercase flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 cursor-pointer ${
                  detectorMode === 'comparative'
                    ? 'mc-button mc-btn-green'
                    : 'mc-button bg-[#161616]'
                }`}
              >
                <span>{t('comparative_mode')}</span>
                <span className="text-[7.5px] font-normal text-gray-400 lowercase">4 parallel engines</span>
              </button>
            </div>
            <p className="font-mono text-[8.5px] text-gray-400">
              {detectorMode === 'individual' 
                ? (language === 'pt' ? 'Foco de alta precisão em um único visor principal.' : 'High precision focus in a single main display.')
                : t('comparative_desc')}
            </p>
          </div>
        </div>

        {/* Biome Presets Switcher Frame (Now Mob Search and Sample Gallery) */}
        <div className="w-full lg:w-2/5 bg-[#111111] p-6 border border-[#333333] relative">
          <div className="corner-bracket-tl"></div>
          <div className="corner-bracket-tr"></div>
          <div className="corner-bracket-bl"></div>
          <div className="corner-bracket-br"></div>

          <h3 className="font-display text-base text-secondary uppercase font-bold tracking-wider mb-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-secondary" />
            <span>{language === 'pt' ? 'Imagens de Teste' : 'Test Sample Search'}</span>
          </h3>
          <p className="font-sans text-xs text-gray-400 leading-normal mb-4 font-normal">
            {language === 'pt'
              ? 'Pesquise por classe de mob ou sorteie aleatoriamente para simular detecções com o dataset real:'
              : 'Search by mob class or roll randomly to simulate real-world dataset detections:'}
          </p>

          {/* Search Inputs Row */}
          <div className="space-y-3 relative">
            <div className="flex gap-2 relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={language === 'pt' ? 'Ex: creeper, zombie, skeleton...' : 'E.g. creeper, zombie, skeleton...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-[#161616] border border-[#333333] text-white font-mono text-xs px-3.5 py-2 focus:outline-none focus:border-primary transition-all rounded-none placeholder-gray-600"
                />
                
                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a1a] border-2 border-[#333333] z-50 max-h-40 overflow-y-auto divide-y divide-[#222] shadow-2xl">
                    {sampleClasses
                      .filter(cls => !searchQuery || cls.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setSearchQuery(cls);
                            setShowSuggestions(false);
                            fetchSamples(cls);
                          }}
                          className="w-full text-left px-3 py-2 font-mono text-xs text-gray-300 hover:bg-[#222222] hover:text-primary transition-all flex justify-between items-center"
                        >
                          <span>{cls}</span>
                          <span className="text-[9px] text-gray-500 font-normal uppercase">mob class</span>
                        </button>
                      ))}
                    {sampleClasses.filter(cls => !searchQuery || cls.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="px-3 py-2.5 text-gray-500 font-mono text-[10px]">
                        {language === 'pt' ? 'Nenhum mob correspondente' : 'No matching mobs'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  fetchSamples(searchQuery);
                }}
                disabled={isFetchingSamples}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'pt' ? 'BUSCAR' : 'FIND'}</span>
              </button>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                  fetchSamples('');
                }}
                disabled={isFetchingSamples}
                className="px-3.5 py-2 bg-[#222222] border border-[#333333] hover:border-primary hover:text-primary text-gray-300 font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                title={language === 'pt' ? 'Escolher aleatório' : 'Pick random'}
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>{language === 'pt' ? 'SORTEAR' : 'ROLL'}</span>
              </button>
            </div>

            {/* Click-away overlay to close suggestions */}
            {showSuggestions && (
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setShowSuggestions(false)}
              />
            )}
          </div>

          {/* Sample Images Gallery */}
          <div className="mt-5 border-t border-[#222222] pt-4 min-h-[120px] flex flex-col justify-center">
            {isFetchingSamples ? (
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                  {language === 'pt' ? 'PROCURANDO AMOSTRAS...' : 'FETCHING SAMPLES...'}
                </span>
              </div>
            ) : samples.length > 0 ? (
              <div className="space-y-3">
                <span className="font-mono text-[8.5px] text-gray-500 uppercase tracking-widest block">
                  {language === 'pt' ? 'CLIQUE EM UMA MINIATURA PARA DETECTAR:' : 'CLICK A THUMBNAIL TO DETECT:'}
                </span>
                <div className="grid grid-cols-4 gap-2.5">
                  {samples.map((sample, sIdx) => {
                    const isCurrentDownloading = isDownloadingSample === sample.url;
                    // Format the file name elegantly (e.g. frame_008072.jpg -> FRM_008072)
                    const formattedName = sample.name
                      ? sample.name.replace(/\.[^/.]+$/, "").replace(/^frame_/, "FRM_")
                      : `IMG_${sIdx + 1}`;
                    return (
                      <div
                        key={sIdx}
                        onClick={() => handleSampleClick(sample)}
                        className={`group relative aspect-square bg-[#131313] border border-[#2d2d2d] hover:border-primary cursor-pointer overflow-hidden transition-all flex flex-col justify-between p-2.5 ${
                          isScanning || isDownloadingSample ? 'opacity-60 cursor-not-allowed' : ''
                        } hover:shadow-[0_0_15px_rgba(238,195,12,0.15)]`}
                      >
                        {/* Upper part: Icon and Name */}
                        <div className="flex flex-col items-center justify-center flex-grow gap-1.5 pt-1">
                          <Camera className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors group-hover:animate-pulse" />
                          <span className="font-mono text-[8px] text-gray-400 group-hover:text-white transition-colors tracking-wider uppercase font-bold text-center block max-w-full truncate">
                            {formattedName}
                          </span>
                        </div>

                        {/* Hover Overlay indicator */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="font-mono text-[8px] font-bold text-primary bg-[#111111] border border-primary/40 px-1.5 py-0.5 tracking-wider">
                            {language === 'pt' ? 'ESCANEAR' : 'SCAN'}
                          </span>
                        </div>
                        
                        {/* Bottom classes list */}
                        <div className="w-full flex flex-wrap gap-0.5 justify-center mt-1">
                          {sample.classes?.slice(0, 2).map((cls) => (
                            <span 
                              key={cls}
                              className="font-mono text-[7px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-none uppercase block truncate max-w-full font-bold"
                              title={cls}
                            >
                              {cls}
                            </span>
                          ))}
                        </div>

                        {/* Local Download / Loading Indicator Overlay */}
                        {isCurrentDownloading && (
                          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1.5 p-1 text-center">
                            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                            <span className="font-mono text-[7px] text-primary uppercase font-bold tracking-wider">
                              {language === 'pt' ? 'CARREGANDO' : 'LOADING'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 font-mono text-[10px]">
                {language === 'pt' 
                  ? 'Nenhum cenário de teste encontrado. Tente buscar por outro mob!' 
                  : 'No test scenarios found. Try searching for another mob!'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Analysis Screen Viewport */}
      {true && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* LEFT: Tactical Viewport Frame */}
          <div className={`${detectorMode === 'comparative' && comparativeData ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-6`}>
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
                <h2 className="font-display text-lg text-white font-bold uppercase tracking-wider">{language === 'pt' ? 'Visor Optico Principal' : 'Main Optical Viewport'}</h2>
              </div>
            </div>

            {/* CONDITIONAL CANVAS RENDER */}
            {!selectedImage ? (
              /* Empty State: Drag & Drop Zone */
              <div 
                onClick={apiStatus !== 'offline' ? triggerUploadClick : undefined}
                onDragOver={apiStatus !== 'offline' ? handleDragOver : undefined}
                onDrop={apiStatus !== 'offline' ? handleDrop : undefined}
                className={`scan-frame w-full aspect-video flex flex-col items-center justify-center relative overflow-hidden bg-[#111111] border-2 border-dashed ${
                  apiStatus === 'offline' 
                    ? 'border-red-500/30 cursor-not-allowed bg-red-950/5' 
                    : 'border-[#333333] hover:border-primary/50 cursor-pointer hover:bg-black/20'
                } transition-all`}
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
                {apiStatus === 'offline' ? (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-12 h-12 bg-red-950/60 border-2 border-red-500 flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000000]">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-red-400 uppercase tracking-wider">{language === 'pt' ? 'API FORA DO AR' : 'API OFFLINE'}</h3>
                    <p className="font-sans text-xs text-gray-400 max-w-sm leading-relaxed">
                      {language === 'pt' 
                        ? 'O detector optico esta indisponivel no momento. Os uploads foram temporariamente desativados.'
                        : 'The optical detector is currently unavailable. Uploads have been temporarily disabled.'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-t-[#555555] border-l-[#555555] border-r-[#111111] border-b-[#111111] flex items-center justify-center mx-auto shadow-[4px_4px_0px_#000000]">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">{language === 'pt' ? 'ARRASTE E SOLTE A CAPTURA' : 'DRAG AND DROP SCREENSHOT'}</h3>
                    <p className="font-sans text-xs text-gray-400 max-w-sm leading-relaxed">
                      {language === 'pt'
                        ? 'Arraste uma imagem aqui ou clique para navegar nos seus arquivos locais.'
                        : 'Drag an image here or click to browse your local files.'}
                    </p>
                  </div>
                )}
              </div>
            ) : detectorMode === 'comparative' && comparativeData && !isScanning ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
                {/* Left side: Viewports (occupied 8/9 cols on large screens) */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                  {expandedMethod ? (
                    <div className="space-y-4">
                      {/* Expanded View Top Control bar */}
                      <div className="flex items-center justify-between bg-[#161616] p-3 border border-[#222222]">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-primary animate-pulse" />
                          <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
                            {language === 'pt' ? 'MÉTODO SELECIONADO:' : 'SELECTED METHOD:'}{' '}
                            <span className="text-primary">
                              {expandedMethod === 'sam' && 'YOLO + SAM (DEEP LEARNING)'}
                              {expandedMethod === 'otsu' && 'OTSU (CLASSICAL)'}
                              {expandedMethod === 'hsv' && 'HSV (COLOR FILTER)'}
                              {expandedMethod === 'grabcut' && 'GRABCUT (FOREGROUND)'}
                              {expandedMethod === 'watershed' && 'WATERSHED (CLASSICAL)'}
                            </span>
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedMethod(null)}
                          className="px-3 py-1.5 mc-button text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                        >
                          {language === 'pt' ? 'Ver Todos os Métodos' : 'View All Methods'}
                        </button>
                      </div>

                      {/* Big Viewport */}
                      <div className="w-full aspect-video border border-[#333333] shadow-lg relative overflow-hidden bg-black">
                        {renderViewport(
                          comparativeData[expandedMethod] || { width: 800, height: 450, detections: [] }, 
                          expandedMethod, 
                          expandedMethod === 'sam' ? 'YOLO + SAM (DEEP LEARNING)' :
                          expandedMethod === 'otsu' ? 'OTSU (CLASSICAL)' :
                          expandedMethod === 'hsv' ? 'HSV (COLOR FILTER)' :
                          expandedMethod === 'grabcut' ? 'GRABCUT (FOREGROUND)' : 'WATERSHED (CLASSICAL)',
                          true
                        )}
                      </div>

                      {/* Thumbnail Selector / Navigation below */}
                      <div className="space-y-2">
                        <span className="font-mono text-[8.5px] text-gray-500 uppercase tracking-widest block">
                          {language === 'pt' ? 'SELECIONE OUTRO MÉTODO PARA COMPARAR / EDITAR:' : 'SELECT ANOTHER METHOD TO COMPARE / EDIT:'}
                        </span>
                        <div className="grid grid-cols-5 gap-2">
                          {(['sam', 'otsu', 'hsv', 'grabcut', 'watershed'] as const).map((methodKey) => {
                            const isCurrent = expandedMethod === methodKey;
                            const label = methodKey === 'sam' ? 'SAM' :
                                          methodKey === 'otsu' ? 'OTSU' :
                                          methodKey === 'hsv' ? 'HSV' :
                                          methodKey === 'grabcut' ? 'GRABCUT' : 'WATERSHED';
                            const color = methodKey === 'sam' ? 'border-[#EEC30C]' :
                                          methodKey === 'otsu' ? 'border-sky-500' :
                                          methodKey === 'hsv' ? 'border-emerald-500' :
                                          methodKey === 'grabcut' ? 'border-rose-500' : 'border-amber-500';
                            return (
                              <button
                                key={methodKey}
                                onClick={() => setExpandedMethod(methodKey)}
                                className={`p-2 font-mono text-[9px] font-bold uppercase border transition-all cursor-pointer ${
                                  isCurrent 
                                    ? `${color} bg-[#1a1a1a] text-white shadow-[0_0_8px_rgba(238,195,12,0.15)]` 
                                    : 'border-[#222222] bg-[#111111] text-gray-400 hover:border-[#444444] hover:text-white'
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {renderViewport(comparativeData.sam || { width: 800, height: 450, detections: [] }, 'sam', 'YOLO + SAM (DEEP LEARNING)', true)}
                      {renderViewport(comparativeData.otsu || { width: 800, height: 450, detections: [] }, 'otsu', 'OTSU (CLASSICAL)', false)}
                      {renderViewport(comparativeData.hsv || { width: 800, height: 450, detections: [] }, 'hsv', 'HSV (COLOR FILTER)', false)}
                      {renderViewport(comparativeData.grabcut || { width: 800, height: 450, detections: [] }, 'grabcut', 'GRABCUT (FOREGROUND)', false)}
                      {renderViewport(comparativeData.watershed || { width: 800, height: 450, detections: [] }, 'watershed', 'WATERSHED (CLASSICAL)', false)}
                    </div>
                  )}
                </div>

                {/* Right side: Parameters box (matches height with viewport on lg/xl) */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <div className="bg-[#111111] p-5 border border-[#333333] relative h-full flex flex-col justify-between">
                    <div className="corner-bracket-tl"></div>
                    <div className="corner-bracket-tr"></div>
                    <div className="corner-bracket-bl"></div>
                    <div className="corner-bracket-br"></div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#222222] pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-primary animate-pulse" />
                          <span className="font-display text-[9px] text-primary font-bold uppercase tracking-wider">
                            {expandedMethod 
                              ? `${language === 'pt' ? 'PARÂMETROS:' : 'PARAMETERS:'} ${expandedMethod.toUpperCase()}`
                              : (language === 'pt' ? 'PARAMETROS DA API CLASSICA' : 'CLASSIC API PARAMETERS')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {onViewMethodDetails && (
                            <button
                              type="button"
                              onClick={() => {
                                onViewMethodDetails(expandedMethod || 'sam');
                              }}
                              className="font-mono text-[8px] bg-primary/20 hover:bg-primary border border-primary/30 text-primary hover:text-black px-2 py-0.5 uppercase flex items-center gap-1 cursor-pointer transition-all font-bold"
                            >
                              <Info className="w-2.5 h-2.5" />
                              <span>{language === 'pt' ? 'Como Funciona?' : 'How It Works?'}</span>
                            </button>
                          )}
                          {expandedMethod && (
                            <span className="font-mono text-[7px] bg-[#222222] text-gray-400 px-1.5 py-0.5 border border-[#333333]">
                              {language === 'pt' ? 'FOCADO' : 'FOCUSED'}
                            </span>
                          )}
                        </div>
                      </div>

                      {expandedMethod === 'sam' ? (
                        <div className="p-3 bg-[#111111] border border-primary/20 text-[8.5px] font-mono leading-relaxed text-gray-400 space-y-2">
                          <p className="text-primary font-bold">YOLOv8 + Segment Anything (SAM)</p>
                          <p>
                            {language === 'pt'
                              ? 'Este método utiliza Redes Neurais Convolucionais profundas (Deep Learning) para segmentação automática de altíssima fidelidade. Não requer parametrização clássica de visão computacional.'
                              : 'This method leverages Deep Convolutional Neural Networks (Deep Learning) for automatic ultra-high-fidelity segmentation. No classic computer vision parameter tuning required.'}
                          </p>
                          <p className="text-gray-500 text-[8px]">
                            {language === 'pt'
                              ? 'Ajuste o Filtro de Confidência do Sensor abaixo para filtrar os mobs identificados.'
                              : 'Adjust the Sensor Confidence Filter below to filter identified mobs.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(!expandedMethod || expandedMethod === 'otsu' || expandedMethod === 'hsv' || expandedMethod === 'grabcut' || expandedMethod === 'watershed') && (
                            <div className="space-y-4">
                              {/* 1. margin_ratio */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[9px]">
                                  <span className="font-mono text-gray-300 font-bold uppercase tracking-wide">
                                    margin_ratio <span className="text-[7.5px] text-gray-500 font-normal">({language === 'pt' ? 'todos' : 'all'})</span>
                                  </span>
                                  <span className="font-mono text-primary font-bold">{marginRatio.toFixed(2)}</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0.0" 
                                  max="1.0" 
                                  step="0.05"
                                  value={marginRatio} 
                                  onChange={(e) => setMarginRatio(parseFloat(e.target.value))}
                                  className="w-full accent-primary bg-[#222222] h-2 border border-[#333333] cursor-pointer appearance-none"
                                />
                                <span className="font-mono text-[7.5px] text-gray-500 block leading-tight">
                                  {language === 'pt' ? 'Margem extra para o recorte do enquadramento' : 'Extra framing margin scale'}
                                </span>
                              </div>

                              {/* 2. poly_epsilon */}
                              <div className="space-y-1 pt-2 border-t border-[#222222]/20">
                                <div className="flex items-center justify-between text-[9px]">
                                  <span className="font-mono text-gray-300 font-bold uppercase tracking-wide">
                                    poly_epsilon <span className="text-[7.5px] text-gray-500 font-normal">({language === 'pt' ? 'todos' : 'all'})</span>
                                  </span>
                                  <span className="font-mono text-primary font-bold">{polyEpsilon.toFixed(1)}</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0.1" 
                                  max="10.0" 
                                  step="0.1"
                                  value={polyEpsilon} 
                                  onChange={(e) => setPolyEpsilon(parseFloat(e.target.value))}
                                  className="w-full accent-primary bg-[#222222] h-2 border border-[#333333] cursor-pointer appearance-none"
                                />
                                <span className="font-mono text-[7.5px] text-gray-500 block leading-tight">
                                  {language === 'pt' ? 'Simplificacao de vertices (maior = poligono reto)' : 'Simplifies geometry (higher = straighter)'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 3. grabcut_iterations */}
                          {(!expandedMethod || expandedMethod === 'grabcut') && (
                            <div className="space-y-1 border-t border-[#222222]/40 pt-2">
                              <div className="flex items-center justify-between text-[9px]">
                                <span className="font-mono text-[#F43F5E] font-bold uppercase tracking-wide">
                                  grabcut_iterations <span className="text-[7.5px] text-gray-500 font-normal">({language === 'pt' ? 'só GrabCut' : 'GrabCut only'})</span>
                                </span>
                                <span className="font-mono text-[#F43F5E] font-bold">{grabcutIterations}</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" 
                                max="20" 
                                step="1"
                                value={grabcutIterations} 
                                onChange={(e) => setGrabcutIterations(parseInt(e.target.value))}
                                className="w-full accent-[#F43F5E] bg-[#222222] h-2 border border-[#333333] cursor-pointer appearance-none"
                              />
                              <span className="font-mono text-[7.5px] text-gray-500 block leading-tight">
                                {language === 'pt' ? 'Iteracoes do otimizador de foreground' : 'Foreground segmenter processing cycles'}
                              </span>
                            </div>
                          )}

                          {/* 4. hsv_threshold */}
                          {(!expandedMethod || expandedMethod === 'hsv') && (
                            <div className="space-y-1 border-t border-[#222222]/40 pt-2">
                              <div className="flex items-center justify-between text-[9px]">
                                <span className="font-mono text-secondary font-bold uppercase tracking-wide">
                                  hsv_threshold <span className="text-[7.5px] text-gray-500 font-normal">({language === 'pt' ? 'só HSV' : 'HSV only'})</span>
                                </span>
                                <span className="font-mono text-secondary font-bold">{hsvThreshold.toFixed(1)}</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.1" 
                                max="10.0" 
                                step="0.1"
                                value={hsvThreshold} 
                                onChange={(e) => setHsvThreshold(parseFloat(e.target.value))}
                                className="w-full accent-secondary bg-[#222222] h-2 border border-[#333333] cursor-pointer appearance-none"
                              />
                              <span className="font-mono text-[7.5px] text-gray-500 block leading-tight">
                                {language === 'pt' ? 'Filtro de saturacao/matiz (menor = sensivel)' : 'Color filter sensitivity (lower = sensitive)'}
                              </span>
                            </div>
                          )}

                          {/* 5. watershed_fg_ratio */}
                          {(!expandedMethod || expandedMethod === 'watershed') && (
                            <div className="space-y-1 border-t border-[#222222]/40 pt-2">
                              <div className="flex items-center justify-between text-[9px]">
                                <span className="font-mono text-amber-500 font-bold uppercase tracking-wide">
                                  watershed_fg_ratio <span className="text-[7.5px] text-gray-500 font-normal">({language === 'pt' ? 'só Watershed' : 'Watershed only'})</span>
                                </span>
                                <span className="font-mono text-amber-500 font-bold">{watershedFgRatio.toFixed(2)}</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.01" 
                                max="0.99" 
                                step="0.01"
                                value={watershedFgRatio} 
                                onChange={(e) => setWatershedFgRatio(parseFloat(e.target.value))}
                                className="w-full accent-amber-500 bg-[#222222] h-2 border border-[#333333] cursor-pointer appearance-none"
                              />
                              <span className="font-mono text-[7.5px] text-gray-500 block leading-tight">
                                {language === 'pt' ? 'Fator de separacao de pixels watershed' : 'Watershed pixel separation constraint'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!expandedMethod && (
                      <div className="text-center pt-2 mt-4 border-t border-[#222222]/40">
                        <span className="font-mono text-[7.5px] text-gray-500 italic block leading-normal">
                          {language === 'pt' 
                            ? 'DICA: Clique em qualquer imagem de método para ampliá-la e focar apenas nos seus parâmetros!'
                            : 'TIP: Click any method viewport to amplify it and focus on its specific parameters!'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* SVG Interactive Canvas Container */
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
                {(() => {
                  if (!selectedImage || !apiData || isScanning) return null;

                  // Dynamic viewBox calculation for zoom
                  let viewBoxVal = `0 0 ${apiData.width} ${apiData.height}`;
                  if (zoomedIndex !== null && apiData.detections[zoomedIndex]) {
                    const d = apiData.detections[zoomedIndex];
                    const x1 = d.box[0];
                    const y1 = d.box[1];
                    const x2 = d.box[2];
                    const y2 = d.box[3];
                    const boxW = x2 - x1;
                    const boxH = y2 - y1;
                    
                    // Calculate zoom box with padding
                    const paddingX = Math.max(35, boxW * 0.35);
                    const paddingY = Math.max(35, boxH * 0.35);
                    
                    const zoomX = Math.max(0, x1 - paddingX);
                    const zoomY = Math.max(0, y1 - paddingY);
                    const zoomW = Math.min(apiData.width - zoomX, boxW + paddingX * 2);
                    const zoomH = Math.min(apiData.height - zoomY, boxH + paddingY * 2);
                    
                    viewBoxVal = `${zoomX} ${zoomY} ${zoomW} ${zoomH}`;
                  }

                  return (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <motion.svg 
                        viewBox={viewBoxVal}
                        layout
                        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
                        className="w-full h-full object-contain select-none"
                      >
                        <defs>
                          <filter id="threshold-filter-main">
                            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" />
                            <feComponentTransfer>
                              <feFuncR type="discrete" tableValues="0 1" />
                              <feFuncG type="discrete" tableValues="0 1" />
                              <feFuncB type="discrete" tableValues="0 1" />
                            </feComponentTransfer>
                          </filter>
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
                          {viewMode === 'threshold' && (
                            <mask id="threshold-mask-main">
                              <rect x="0" y="0" width={apiData.width} height={apiData.height} fill="black" />
                              {apiData.detections.map((d, i) => {
                                if (d.confidence * 100 < confidenceThreshold) return null;
                                const hasPolygon = d.polygon && d.polygon.length > 0;
                                if (hasPolygon) {
                                  return (
                                    <polygon 
                                      key={i} 
                                      points={d.polygon.map(p => `${p[0]},${p[1]}`).join(' ')} 
                                      fill="white" 
                                    />
                                  );
                                } else {
                                  return (
                                    <rect
                                      key={i}
                                      x={d.box[0]}
                                      y={d.box[1]}
                                      width={d.box[2] - d.box[0]}
                                      height={d.box[3] - d.box[1]}
                                      fill="white"
                                    />
                                  );
                                }
                              })}
                            </mask>
                          )}
                        </defs>

                        {/* Black Background for Threshold Mode */}
                        {viewMode === 'threshold' && (
                          <rect 
                            x="0" 
                            y="0" 
                            width={apiData.width} 
                            height={apiData.height} 
                            fill="black" 
                          />
                        )}

                        {/* Ground Image / White Silhouette in Threshold Mode */}
                        {viewMode === 'threshold' ? (
                          <rect 
                            x="0" 
                            y="0" 
                            width={apiData.width} 
                            height={apiData.height} 
                            fill="white" 
                            mask="url(#threshold-mask-main)"
                          />
                        ) : (
                          <image 
                            href={selectedImage} 
                            width={apiData.width} 
                            height={apiData.height} 
                          />
                        )}

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
                          const isZoomed = zoomedIndex === i;

                          return (
                            <g 
                              key={i} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomedIndex(zoomedIndex === i ? null : i);
                              }}
                              className="cursor-pointer group/det"
                            >
                              {/* Full-box click target with transparent fill to catch mouse events */}
                              <rect
                                x={d.box[0]}
                                y={d.box[1]}
                                width={d.box[2] - d.box[0]}
                                height={d.box[3] - d.box[1]}
                                fill="#000000"
                                fillOpacity={0}
                                pointerEvents="all"
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZoomedIndex(zoomedIndex === i ? null : i);
                                }}
                              />

                              {/* 1. Draw Segmentation Contour */}
                              {hasPolygon && (viewMode === 'overlay' || viewMode === 'highlight' || viewMode === 'threshold') && (
                                <polygon
                                  points={d.polygon.map(p => `${p[0]},${p[1]}`).join(' ')}
                                  fill={viewMode === 'threshold' ? '#ffffff' : (viewMode === 'highlight' ? 'none' : `${color}4D`)}
                                  stroke={viewMode === 'threshold' ? '#ffffff' : color}
                                  strokeWidth={isZoomed ? "4" : "3"}
                                  className="transition-all duration-200 group-hover/det:stroke-[4px]"
                                />
                              )}

                              {/* 2. Draw Classic Bounding Box */}
                              {(viewMode === 'bbox' || (!hasPolygon && (viewMode === 'overlay' || viewMode === 'highlight' || viewMode === 'threshold'))) && (
                                <rect
                                  x={d.box[0]}
                                  y={d.box[1]}
                                  width={d.box[2] - d.box[0]}
                                  height={d.box[3] - d.box[1]}
                                  fill={viewMode === 'threshold' ? '#ffffff' : 'none'}
                                  stroke={viewMode === 'threshold' ? '#ffffff' : color}
                                  strokeWidth={isZoomed ? "3" : "2"}
                                  className="transition-all duration-200 group-hover/det:stroke-[3px]"
                                />
                              )}

                              {/* 3. Label Tag above target */}
                              {viewMode !== 'highlight' && viewMode !== 'threshold' && (
                                <g>
                                  <rect
                                    x={d.box[0]}
                                    y={Math.max(0, d.box[1] - 22)}
                                    width={calculateTextWidth(translateMob(d.class), d.confidence)}
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
                                    {translateMob(d.class)} {Math.round(d.confidence * 100)}%
                                  </text>
                                </g>
                              )}

                              {/* 4. Target Lock On Indicator HUD (Only shown when zoomed) */}
                              {isZoomed && (
                                <g className="animate-pulse">
                                  {/* Outer bounding corners or crosshair */}
                                  <rect
                                    x={d.box[0] - 10}
                                    y={d.box[1] - 10}
                                    width={d.box[2] - d.box[0] + 20}
                                    height={d.box[3] - d.box[1] + 20}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                  />
                                  <text
                                    x={d.box[2] + 12}
                                    y={d.box[1] + 15}
                                    fill={color}
                                    fontSize="9"
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                    className="uppercase font-mono tracking-widest fill-current drop-shadow-md"
                                  >
                                    TARGET_LOCK
                                  </text>
                                </g>
                              )}
                            </g>
                          );
                        })}
                      </motion.svg>

                      {zoomedIndex !== null && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedIndex(null);
                          }}
                          className="absolute top-4 right-4 bg-primary hover:bg-emerald-400 text-black font-mono text-[9px] px-2.5 py-1.5 border border-primary font-bold transition-all flex items-center gap-1 cursor-pointer z-10 uppercase tracking-wider shadow-lg"
                        >
                          <span>Visão Global [ESC]</span>
                        </button>
                      )}

                      {errorMessage && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 border border-red-500/30 p-3 text-red-300 font-mono text-[10px] uppercase flex gap-2 items-center">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TACTICAL ZOOM INFO PANEL */}
            {zoomedIndex !== null && apiData && apiData.detections[zoomedIndex] && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-[#111111] p-5 border-l-4 border-primary border border-y-[#333333] border-r-[#333333] relative space-y-4"
              >
                <div className="corner-bracket-tr"></div>
                <div className="corner-bracket-br"></div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <h3 className="font-display text-sm font-bold text-white tracking-wider uppercase">
                      TELEMETRIA DE ALVO TRANCADO
                    </h3>
                  </div>
                  <button 
                    onClick={() => setZoomedIndex(null)}
                    className="font-mono text-[9px] text-gray-500 hover:text-white uppercase underline cursor-pointer"
                  >
                    RESTAURAR VISAO GLOBAL [ESC]
                  </button>
                </div>

                {(() => {
                  const d = apiData.detections[zoomedIndex];
                  const color = getClassColor(d.class);
                  const w = Math.round(d.box[2] - d.box[0]);
                  const h = Math.round(d.box[3] - d.box[1]);
                  const area = w * h;
                  const distanceEst = language === 'pt'
                    ? (area > 50000 ? 'MUITO PROXIMO (< 5m)' : area > 15000 ? 'DISTANCIA MEDIA (5m - 15m)' : 'DISTANTE (> 15m)')
                    : (area > 50000 ? 'VERY CLOSE (< 5m)' : area > 15000 ? 'MEDIUM DISTANCE (5m - 15m)' : 'DISTANT (> 15m)');
                  
                  // Tactical combat advices based on mob class
                  let tacticalAdvice = language === 'pt' 
                    ? 'Firme posição e analise os padrões de aproximação.'
                    : 'Hold position and analyze approach patterns.';
                  if (d.class.toLowerCase().includes('creeper')) {
                    tacticalAdvice = language === 'pt'
                      ? 'ALERTA DE FUSÍVEL! Use combate à distância (Arco/Besta) ou afaste-se rápido se ele começar a chiar.'
                      : 'FUSE ALERT! Use ranged combat (Bow/Crossbow) or step back quickly if it starts hissing.';
                  } else if (d.class.toLowerCase().includes('zumbi') || d.class.toLowerCase().includes('zombie')) {
                    tacticalAdvice = language === 'pt'
                      ? 'Lento porém persistente. Ataques de recuo (knockback) limpam o perímetro facilmente.'
                      : 'Slow but persistent. Knockback attacks clear the perimeter easily.';
                  } else if (d.class.toLowerCase().includes('esqueleto') || d.class.toLowerCase().includes('skeleton')) {
                    tacticalAdvice = language === 'pt'
                      ? 'Atirador de elite. Avance com Escudo levantado ou ataque de forma rápida pelas costas.'
                      : 'Elite marksman. Advance with Shield raised or attack quickly from behind.';
                  } else if (d.class.toLowerCase().includes('aranha') || d.class.toLowerCase().includes('spider') || d.class.toLowerCase().includes('cave_spider')) {
                    tacticalAdvice = language === 'pt'
                      ? 'Altamente ágil. Ataque de cima ou levante sua guarda para bloquear o pulo frontal.'
                      : 'Highly agile. Attack from above or raise your guard to block the frontal leap.';
                  }

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-[#161616] p-3 border border-[#222222]">
                          <span className="text-[8px] text-gray-500 block uppercase font-mono">{t('entity_lbl')}</span>
                          <span className="text-white text-xs font-bold uppercase font-mono" style={{ color: color }}>
                            {translateMob(d.class)}
                          </span>
                        </div>
                        <div className="bg-[#161616] p-3 border border-[#222222]">
                          <span className="text-[8px] text-gray-500 block uppercase font-mono">{t('signature_lbl')}</span>
                          <span className="text-white text-xs font-bold font-mono">
                            {w}x{h} px
                          </span>
                        </div>
                        <div className="bg-[#161616] p-3 border border-[#222222]">
                          <span className="text-[8px] text-gray-500 block uppercase font-mono">{t('approach_lbl')}</span>
                          <span className="text-primary text-[10px] font-bold font-mono">
                            {distanceEst}
                          </span>
                        </div>
                        <div className="bg-[#161616] p-3 border border-[#222222]">
                          <span className="text-[8px] text-gray-500 block uppercase font-mono">{t('confidence_lbl')}</span>
                          <span className="text-secondary text-xs font-bold font-mono">
                            {Math.round(d.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-black/40 border border-[#222222] space-y-1">
                        <span className="text-[8px] text-red-400 block uppercase font-mono font-bold">{t('recommendation')}</span>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">
                          {tacticalAdvice}
                        </p>
                      </div>

                      <div className="flex gap-3 justify-end pt-1">
                        <button
                          onClick={() => {
                            if (onViewMobDetails) onViewMobDetails(d.class);
                          }}
                          className="px-4 py-2 mc-button mc-btn-green text-[10px] font-bold uppercase tracking-wider"
                        >
                          {t('open_wiki')}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Real-time Computer Vision Control Panel */}
            <div className="bg-[#111111] p-6 border border-[#333333] space-y-6 relative">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>
              
              <div className="flex items-center gap-2 border-b border-[#222222] pb-3">
                <Layers className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">{language === 'pt' ? 'Modos de Visualizacao & Pipeline' : 'View Modes & Pipeline'}</span>
              </div>

              {/* View Modes Selector (Modos de Visualização) */}
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block">
                  {language === 'pt' ? 'Alternar Visualizacao' : 'Toggle View Mode'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setViewMode('bbox')}
                    className={`px-3 py-2.5 text-[10px] font-bold transition-all ${
                      viewMode === 'bbox'
                        ? 'mc-button mc-btn-green'
                        : 'mc-button'
                    }`}
                  >
                    {language === 'pt' ? 'CAIXAS ENQUADRADAS' : 'BOUNDING BOXES'}
                  </button>
                  <button
                    onClick={() => setViewMode('highlight')}
                    className={`px-3 py-2.5 text-[10px] font-bold transition-all ${
                      viewMode === 'highlight'
                        ? 'mc-button mc-btn-green'
                        : 'mc-button'
                    }`}
                  >
                    {language === 'pt' ? 'FOCO / DESTAQUE (SPOTLIGHT)' : 'SPOTLIGHT'}
                  </button>
                  <button
                    onClick={() => setViewMode('overlay')}
                    className={`px-3 py-2.5 text-[10px] font-bold transition-all ${
                      viewMode === 'overlay'
                        ? 'mc-button mc-btn-green'
                        : 'mc-button'
                    }`}
                  >
                    {language === 'pt' ? 'MASCARA COLORIDA (OVERLAY)' : 'COLOR OVERLAY'}
                  </button>
                  <button
                    onClick={() => setViewMode('threshold')}
                    className={`px-3 py-2.5 text-[10px] font-bold transition-all ${
                      viewMode === 'threshold'
                        ? 'mc-button mc-btn-green'
                        : 'mc-button'
                    }`}
                  >
                    {language === 'pt' ? 'MASCARA BINARIA' : 'BINARY MASK'}
                  </button>
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="bg-[#161616] p-4 border border-[#222222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-400 uppercase block tracking-wider">{language === 'pt' ? 'FILTRO DE CONFIDENCIA DO SENSOR' : 'SENSOR CONFIDENCE FILTER'}</span>
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
                <span className="font-mono text-[8px] text-gray-500 block">{language === 'pt' ? 'Esconde deteccoes abaixo desta probabilidade de acerto' : 'Hides detections below this probability threshold'}</span>
              </div>

              {/* Classical Parameters Sliders (Minecraft Theme) */}
              {/* REMOVED FROM BOTTOM - MOVED SIDE-BY-SIDE WITH COMPARATIVE VIEWPORTS ABOVE */}
            </div>
          </div>

          {/* RIGHT: Legend, Telemetry, and Actions */}
          <div className={`${detectorMode === 'comparative' && comparativeData ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-6`}>
            <div className="bg-[#111111] p-6 border border-[#333333] relative">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <h3 className="font-display text-base text-secondary font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{language === 'pt' ? 'Legenda do Radar de Mobs' : 'Mob Radar Legend'}</span>
              </h3>

              {activeScanResult && apiData ? (
                <div className="space-y-6 font-mono">
                  
                  {/* Legend inventory slots */}
                  <div className="space-y-3">
                    {apiData.detections.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-xs font-mono border border-dashed border-[#333] p-4 uppercase">
                        {language === 'pt' ? 'Nenhum mob detectado nesta captura.' : 'No mobs detected in this capture.'}
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
                            onClick={() => setZoomedIndex(zoomedIndex === idx ? null : idx)}
                            className={`p-3 cursor-pointer border space-y-2.5 transition-all group/legend relative overflow-hidden ${
                              zoomedIndex === idx 
                                ? 'bg-primary/10 border-primary' 
                                : 'bg-[#161616] border-[#222222] hover:bg-[#1f1f1f] hover:border-primary/50'
                            }`}
                            title="Clique para dar zoom no Mob e ver detalhes"
                          >
                            {/* Visual Indicator tab for active target */}
                            {zoomedIndex === idx && (
                              <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary"></div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div 
                                  className="w-3 h-3 border"
                                  style={{ backgroundColor: color, borderColor: color }}
                                />
                                <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                                  zoomedIndex === idx ? 'text-primary' : 'text-white group-hover/legend:text-primary'
                                }`}>
                                  {translateMob(d.class)}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-primary font-bold">{Math.round(d.confidence * 100)}% {language === 'pt' ? 'CONFIANCA' : 'CONFIDENCE'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 border-t border-[#222222]/60 pt-2 font-mono">
                              <div>
                                <span className="text-gray-500 uppercase block text-[8px]">{language === 'pt' ? 'Enquadramento Box' : 'Bounding Box'}</span>
                                <span className="text-white">[{d.box.map(Math.round).join(', ')}]</span>
                              </div>
                              <div>
                                <span className="text-gray-500 uppercase block text-[8px]">{language === 'pt' ? 'Pontos Poligono' : 'Polygon Points'}</span>
                                <span className="text-primary font-bold">
                                  {hasPolygon ? `${d.polygon.length} ${language === 'pt' ? 'vertices' : 'vertices'}` : (language === 'pt' ? 'Sem mascara' : 'No mask')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="w-full bg-[#222222] h-1 mt-1">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${d.confidence * 100}%` }}
                              />
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center justify-between border-t border-[#222222]/60 pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onViewMobDetails) {
                                    onViewMobDetails(d.class);
                                  }
                                }}
                                className="px-2 py-1 bg-black/80 hover:bg-primary hover:text-black border border-[#333] hover:border-primary font-mono text-[8.5px] text-gray-400 hover:font-bold transition-all uppercase cursor-pointer flex items-center gap-1"
                              >
                                <span>{t('open_wiki_short')}</span>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZoomedIndex(zoomedIndex === idx ? null : idx);
                                }}
                                className={`px-2 py-1 border font-mono text-[8.5px] font-bold transition-all uppercase cursor-pointer flex items-center gap-1 ${
                                  zoomedIndex === idx 
                                    ? 'bg-primary text-black border-primary' 
                                    : 'bg-black text-gray-400 border-[#333] hover:border-primary hover:text-primary'
                                }`}
                              >
                                <span>{zoomedIndex === idx ? t('global_view') : t('focus_target')}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#222222] pt-4 text-xs">
                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[10px]">{language === 'pt' ? 'GRAU DE RISCO' : 'RISK LEVEL'}</span>
                      <span className={`text-sm font-bold ${
                        activeScanResult.threatLevel === 'CRITICO' ? 'text-red-500' :
                        activeScanResult.threatLevel === 'ALTO' ? 'text-amber-500' : 'text-primary'
                      }`}>{activeScanResult.threatLevel === 'CRITICO' && language === 'en' ? 'CRITICAL' : activeScanResult.threatLevel === 'ALTO' && language === 'en' ? 'HIGH' : activeScanResult.threatLevel}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block uppercase tracking-wider text-[10px]">{language === 'pt' ? 'TOTAL CATALOGADO' : 'TOTAL CATALOGED'}</span>
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
                      <span>{language === 'pt' ? 'EXPORTAR JSON' : 'EXPORT JSON'}</span>
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
                      {language === 'pt' ? 'LIMPAR' : 'CLEAR'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600 text-xs tracking-wider uppercase">
                  {language === 'pt' ? 'AGUARDANDO PROCESSO DO SCANNER...' : 'WAITING FOR SCANNER PROCESS...'}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
