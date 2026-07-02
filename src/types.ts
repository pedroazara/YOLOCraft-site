export type ActiveTab = 'detector' | 'entidades' | 'stats' | 'como-funciona';

export interface MobEntity {
  id: string;
  number: string;
  name: string;
  type: string; // e.g. "Hostil", "Ataque à Distância", "Neutro", "Passivo"
  icon: string; // material symbols icon name
  image: string;
  accuracy: number;
  description: string;
  behavior: string;
  drops: string[];
}

export interface BoundingBox {
  label: string;
  confidence: number;
  top: number; // percentage (0-100)
  left: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
  color?: string; // green, orange, etc.
}

export interface ScanResult {
  id: string;
  name: string;
  imageUrl: string;
  threatLevel: 'CRÍTICO' | 'MÉDIO' | 'ALTO' | 'BAIXO';
  entitiesCount: number;
  timestamp: string;
  depth: string;
  boundingBoxes: BoundingBox[];
  insight: string;
  // Dynamic API properties
  apiResponse?: ApiPredictResponse;
}

export interface ApiDetection {
  class: string;
  confidence: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  polygon: [number, number][]; // Array of [x, y] coordinates
}

export interface ApiPredictResponse {
  width: number;
  height: number;
  detections: ApiDetection[];
}
