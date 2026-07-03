import React, { createContext, useContext, useState, useEffect } from 'react';
import { MobEntity } from '../types';

type Language = 'pt' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateMob: (mobName: string) => string;
  getTranslatedMobDetails: (entity: MobEntity) => MobEntity;
  removeAccents: (str: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Detailed mob translations (name, description, behavior, drops, type)
const detailedMobTranslations: { 
  [key: string]: { 
    name: { pt: string; en: string };
    type: { pt: string; en: string };
    description: { pt: string; en: string };
    behavior: { pt: string; en: string };
    drops: { pt: string[]; en: string[] };
  } 
} = {
  'cave_spider': {
    name: { pt: 'Aranha da Caverna', en: 'Cave Spider' },
    type: { pt: 'Hostil', en: 'Hostile' },
    description: { 
      pt: 'Variante menor e azulada da aranha comum, encontrada em poços de minas abandonados. Seus ataques infligem veneno altamente prejudicial.',
      en: 'A smaller, blue-tinted variant of the common spider found in abandoned mineshafts. Its attacks inflict highly dangerous poison.'
    },
    behavior: {
      pt: 'Ataca pulando no jogador. Consegue passar por aberturas estreitas de 1x1 ou meio bloco de altura. Escala paredes verticais e teias.',
      en: 'Attacks by jumping at the player. Can fit through tight 1x1 or half-block gaps. Scales vertical walls and cobwebs freely.'
    },
    drops: {
      pt: ['Linha (0-2)', 'Olho de Aranha (0-1)'],
      en: ['String (0-2)', 'Spider Eye (0-1)']
    }
  },
  'creeper': {
    name: { pt: 'Creeper', en: 'Creeper' },
    type: { pt: 'Hostil', en: 'Hostile' },
    description: { 
      pt: 'Criatura silenciosa e furtiva que se aproxima do jogador e explode, destruindo blocos e causando dano massivo de área.',
      en: 'A silent and stealthy creature that sneaks up on players and explodes, destroying blocks and causing massive area damage.'
    },
    behavior: {
      pt: 'Aproxima-se sem emitir som de passos. Produz um som de pavio ("ssss") 1.5 segundos antes de detonar. Desiste da detonação se o jogador se afastar.',
      en: 'Approaches without footsteps. Hisses ("ssss") 1.5 seconds before detonating. Cancels detonation if the player moves away.'
    },
    drops: {
      pt: ['Pólvora (0-2)', 'Disco de Música (se morto por esqueleto)'],
      en: ['Gunpowder (0-2)', 'Music Disc (if killed by skeleton)']
    }
  },
  'enderman': {
    name: { pt: 'Enderman', en: 'Enderman' },
    type: { pt: 'Neutro', en: 'Neutral' },
    description: { 
      pt: 'Criatura alta, escura e de braços longos capaz de se teletransportar e recolher certos tipos de blocos.',
      en: 'A tall, dark, long-limbed creature capable of teleporting and picking up certain blocks.'
    },
    behavior: {
      pt: 'Neutro até que um jogador olhe diretamente para seus olhos a até 64 blocos de distância, ou o ataque. Sofre dano ao entrar em contato com água.',
      en: 'Neutral until looked at directly in the eyes from up to 64 blocks away, or attacked. Takes damage from water contact.'
    },
    drops: {
      pt: ['Pérola do Fim (0-1)'],
      en: ['Ender Pearl (0-1)']
    }
  },
  'skeleton': {
    name: { pt: 'Esqueleto', en: 'Skeleton' },
    type: { pt: 'Ataque à Distância', en: 'Ranged' },
    description: { 
      pt: 'Atirador esquelético rápido armado com um arco. Queima sob a luz direta do sol e foge ativamente de lobos domesticados.',
      en: 'A fast skeletal archer armed with a bow. Burns under direct sunlight and actively flees from tamed wolves.'
    },
    behavior: {
      pt: 'Mantém distância do jogador enquanto atira flechas rápidas. Move-se lateralmente para desviar de contra-ataques. Procura sombra durante o dia.',
      en: 'Maintains distance while firing rapid arrows. Moves sideways to dodge attacks. Seeks shade during daytime.'
    },
    drops: {
      pt: ['Osso (0-2)', 'Flecha (0-2)', 'Arco Danificado (raro)'],
      en: ['Bone (0-2)', 'Arrow (0-2)', 'Damaged Bow (rare)']
    }
  },
  'slime': {
    name: { pt: 'Slime', en: 'Slime' },
    type: { pt: 'Hostil', en: 'Hostile' },
    description: { 
      pt: 'Cubo verde gelatinoso que salta pelo bioma de pântano ou chunks específicas subterrâneas. Quando morto, divide-se em frações menores.',
      en: 'A gelatinous green cube that hops around swamp biomes or specific underground slime chunks. Divides into smaller slimes when killed.'
    },
    behavior: {
      pt: 'Salta em direção ao jogador para causar dano por contato. Apenas tamanhos médios e grandes causam dano. Move-se de forma independente.',
      en: 'Hops toward players to deal contact damage. Only medium and large sizes deal damage. Moves independently.'
    },
    drops: {
      pt: ['Bola de Slime (0-2)'],
      en: ['Slimeball (0-2)']
    }
  },
  'spider': {
    name: { pt: 'Aranha', en: 'Spider' },
    type: { pt: 'Hostil', en: 'Hostile' },
    description: { 
      pt: 'Aranha gigante ágil capaz de escalar paredes e saltar sobre os inimigos. É hostil apenas em níveis baixos de iluminação.',
      en: 'An agile, giant spider that can scale walls and leap onto enemies. Hostile only at low light levels.'
    },
    behavior: {
      pt: 'Hostil em níveis de luz abaixo de 7. Neutra sob luz do dia a menos que seja atacada. Consegue escalar paredes verticais livremente.',
      en: 'Hostile at light levels below 7. Neutral in daylight unless attacked. Can climb vertical walls freely.'
    },
    drops: {
      pt: ['Linha (0-2)', 'Olho de Aranha (raro)'],
      en: ['String (0-2)', 'Spider Eye (rare)']
    }
  },
  'zombie': {
    name: { pt: 'Zumbi', en: 'Zombie' },
    type: { pt: 'Hostil', en: 'Hostile' },
    description: { 
      pt: 'Monstro comum que persegue jogadores, aldeões e tartarugas à vista. Queima sob a luz direta do sol.',
      en: 'A common monster that pursues players, villagers, and turtles on sight. Burns under direct sunlight.'
    },
    behavior: {
      pt: 'Move-se de forma lenta mas persistente em direção ao alvo. Capaz de derrubar portas de madeira em dificuldades difíceis.',
      en: 'Moves slowly but persistently toward targets. Capable of breaking down wooden doors on Hard difficulty.'
    },
    drops: {
      pt: ['Carne Podre (0-2)', 'Cenoura (raro)', 'Batata (raro)', 'Lingote de Ferro (raro)'],
      en: ['Rotten Flesh (0-2)', 'Carrot (rare)', 'Potato (rare)', 'Iron Ingot (rare)']
    }
  },
  'iron_golem': {
    name: { pt: 'Golem de Ferro', en: 'Iron Golem' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Defensor maciço construído de blocos de ferro para proteger aldeões contra incursões de criaturas hostis e invasores.',
      en: 'A massive defender built from iron blocks to protect villagers from raids and hostile creatures.'
    },
    behavior: {
      pt: 'Patrulha as vilas e ataca monstros hostis ao alcance automaticamente. Não sofre dano de quedas livres. Pode ser reparado com lingotes.',
      en: 'Patrols villages and automatically attacks hostile monsters on sight. Immune to fall damage. Can be repaired with iron ingots.'
    },
    drops: {
      pt: ['Lingote de Ferro (3-5)', 'Rosa (0-2)'],
      en: ['Iron Ingot (3-5)', 'Poppy (0-2)']
    }
  },
  'wolf': {
    name: { pt: 'Lobo', en: 'Wolf' },
    type: { pt: 'Neutro', en: 'Neutral' },
    description: { 
      pt: 'Canídeo domesticável que vaga em matilhas por florestas e biomas de taiga selvagens. Pode ser domesticado fornecendo ossos.',
      en: 'A tameable canine that roams in packs through forests and wild taiga biomes. Can be tamed by feeding bones.'
    },
    behavior: {
      pt: 'Ataca ovelhas e esqueletos selvagens. Se atacado em estado natural, toda a matilha ao redor se torna hostil contra o agressor.',
      en: 'Attacks sheep and wild skeletons. If attacked in the wild, the entire nearby pack becomes hostile towards the attacker.'
    },
    drops: {
      pt: [],
      en: []
    }
  },
  'cat': {
    name: { pt: 'Gato', en: 'Cat' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Felino domesticável encontrado habitando vilas e cabanas de bruxas. Espanta creepers e fantasmas voadores.',
      en: 'A tameable feline found in villages and witch huts. Scares away creepers and flying phantoms.'
    },
    behavior: {
      pt: 'Evita jogadores correndo rápido a menos que seja atraído com peixes crus. Adora sentar sobre camas e baús de armazenamento.',
      en: 'Avoids players by running fast unless lured with raw fish. Loves to sit on beds and storage chests.'
    },
    drops: {
      pt: ['Linha (0-2)'],
      en: ['String (0-2)']
    }
  },
  'chicken': {
    name: { pt: 'Galinha', en: 'Chicken' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Ave passiva e comum que põe ovos e fornece penas de flecha e carne de frango. Bate asas para anular danos de quedas.',
      en: 'A common passive bird that lays eggs and provides arrow feathers and chicken meat. Flaps wings to negate fall damage.'
    },
    behavior: {
      pt: 'Vaga sem rumo pelo cenário. Produz ovos férteis em intervalos de 5 a 10 minutos. Segue jogadores que seguram sementes agrícolas.',
      en: 'Wanders aimlessly. Lays fertile eggs every 5 to 10 minutes. Follows players holding crop seeds.'
    },
    drops: {
      pt: ['Frango Cru (1)', 'Pena (0-2)'],
      en: ['Raw Chicken (1)', 'Feather (0-2)']
    }
  },
  'cow': {
    name: { pt: 'Vaca', en: 'Cow' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Grande mamífero passivo criado por fazendeiros. Fornece leite infinitamente se ordenhado utilizando baldes vazios.',
      en: 'A large passive mammal kept by farmers. Provides infinite milk if milked with an empty bucket.'
    },
    behavior: {
      pt: 'Foge assustada ao sofrer danos físicos. Pode ser procriada oferecendo trigo dourado. Segue jogadores portando trigo.',
      en: 'Flees in panic when taking physical damage. Can be bred with golden wheat. Follows players holding wheat.'
    },
    drops: {
      pt: ['Couro (0-2)', 'Bife Cru (1-3)'],
      en: ['Leather (0-2)', 'Raw Beef (1-3)']
    }
  },
  'frog': {
    name: { pt: 'Sapo', en: 'Frog' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Anfíbio passivo e saltador que habita biomas de pântano e manguezal úmidos. Capaz de produzir blocos brilhantes froglight.',
      en: 'A hopping passive amphibian that inhabits humid swamp and mangrove swamp biomes. Capable of producing glowing froglight blocks.'
    },
    behavior: {
      pt: 'Salta e nada ativamente. Ataca slimes e cubos de magma pequenos usando sua língua elástica, engolindo-os instantaneamente.',
      en: 'Hops and swims actively. Attacks small slimes and magma cubes with its elastic tongue, swallowing them instantly.'
    },
    drops: {
      pt: [],
      en: []
    }
  },
  'horse': {
    name: { pt: 'Cavalo', en: 'Horse' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Montaria veloz e majestosa que pode ser equipada com armaduras metálicas de cavalo. Domado tentando montá-lo.',
      en: 'A fast, majestic mount that can be equipped with metal horse armor. Tamed by repeatedly mounting it.'
    },
    behavior: {
      pt: 'Vaga comendo capim selvagem. Capaz de realizar saltos altos para superar obstáculos de terreno e colinas íngremes.',
      en: 'Wanders around eating wild grass. Capable of jumping high to overcome terrain obstacles and steep hills.'
    },
    drops: {
      pt: ['Couro (0-2)'],
      en: ['Leather (0-2)']
    }
  },
  'pig': {
    name: { pt: 'Porco', en: 'Pig' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Animal passivo clássico que pode ser cavalgado controladamente se equipado com sela e guiado com cenoura no palito.',
      en: 'A classic passive animal that can be ridden if equipped with a saddle and guided with a carrot on a stick.'
    },
    behavior: {
      pt: 'Atraído e reproduzido utilizando cenouras ou beterrabas da horta. Se atingido por relâmpago, transmuta-se em Piglin Zumbificado.',
      en: 'Attracted and bred using carrots or garden beets. If struck by lightning, transforms into a Zombified Piglin.'
    },
    drops: {
      pt: ['Costeleta de Porco Crua (1-3)'],
      en: ['Raw Porkchop (1-3)']
    }
  },
  'sheep': {
    name: { pt: 'Ovelha', en: 'Sheep' },
    type: { pt: 'Passivo', en: 'Passive' },
    description: { 
      pt: 'Animal passivo de lã fofa que consome grama para regenerar seu revestimento. Pode ser tosada usando tesouras comuns.',
      en: 'A fluffy wool-bearing passive animal that eats grass to regrow its coat. Can be shorn using shears.'
    },
    behavior: {
      pt: 'Passa a maior tempo pastando. Pode ter sua lã pintada artificialmente usando qualquer um dos 16 corantes.',
      en: 'Spends most of its time grazing. Its wool can be dyed artificially using any of the 16 colors.'
    },
    drops: {
      pt: ['Lã (1-3)', 'Cordeiro Cru (1-2)'],
      en: ['Wool (1-3)', 'Raw Mutton (1-2)']
    }
  },
  'witch': {
    name: { pt: 'Bruxa', en: 'Witch' },
    type: { pt: 'Hostil', en: 'Hostile' },
    description: {
      pt: 'Bruxa isolada preparando poções ácidas. Risco severo de envenenamento e dano mágico.',
      en: 'An isolated witch brewing acid potions. Severe risk of poisoning and magical splash damage.'
    },
    behavior: {
      pt: 'Arremessa poções de dano, lentidão, fraqueza e veneno contra o jogador. Bebe poções de cura e resistência ao fogo para se proteger.',
      en: 'Throws splash potions of harming, slowness, weakness, and poison at players. Drinks healing and fire resistance potions to protect itself.'
    },
    drops: {
      pt: ['Frasco de Vidro (0-2)', 'Pó de Pedra Luminosa (0-2)', 'Redstone (0-2)', 'Pólvora (0-2)', 'Açúcar (0-2)', 'Olho de Aranha (0-2)', 'Vara de Madeira (0-2)'],
      en: ['Glass Bottle (0-2)', 'Glowstone Dust (0-2)', 'Redstone (0-2)', 'Gunpowder (0-2)', 'Sugar (0-2)', 'Spider Eye (0-2)', 'Stick (0-2)']
    }
  }
};

const mobTranslations: { [key: string]: { pt: string; en: string } } = {
  'cave_spider': { pt: 'Aranha da Caverna', en: 'Cave Spider' },
  'creeper': { pt: 'Creeper', en: 'Creeper' },
  'enderman': { pt: 'Enderman', en: 'Enderman' },
  'skeleton': { pt: 'Esqueleto', en: 'Skeleton' },
  'esqueleto': { pt: 'Esqueleto', en: 'Skeleton' },
  'slime': { pt: 'Slime', en: 'Slime' },
  'spider': { pt: 'Aranha', en: 'Spider' },
  'aranha': { pt: 'Aranha', en: 'Spider' },
  'zombie': { pt: 'Zumbi', en: 'Zombie' },
  'zumbi': { pt: 'Zumbi', en: 'Zombie' },
  'iron_golem': { pt: 'Golem de Ferro', en: 'Iron Golem' },
  'wolf': { pt: 'Lobo', en: 'Wolf' },
  'cat': { pt: 'Gato', en: 'Cat' },
  'chicken': { pt: 'Galinha', en: 'Chicken' },
  'cow': { pt: 'Vaca', en: 'Cow' },
  'frog': { pt: 'Sapo', en: 'Frog' },
  'horse': { pt: 'Cavalo', en: 'Horse' },
  'pig': { pt: 'Porco', en: 'Pig' },
  'sheep': { pt: 'Ovelha', en: 'Sheep' },
  'witch': { pt: 'Bruxa', en: 'Witch' }
};

const dictionary: { [key: string]: { pt: string; en: string } } = {
  // Navigation Header
  'nav_detector': { pt: 'DETECTOR', en: 'DETECTOR' },
  'nav_bestiary': { pt: 'ENTIDADES', en: 'BESTIARY' },
  'nav_stats': { pt: 'ESTATISTICAS', en: 'STATISTICS' },
  'nav_how_it_works': { pt: 'COMO FUNCIONA', en: 'HOW IT WORKS' },
  'nav_creators': { pt: 'CRIADORES', en: 'CREATORS' },
  'logged_in_as': { pt: 'Logado como:', en: 'Logged in as:' },
  'logout': { pt: 'Deseja deslogar da conta YOLOCraft?', en: 'Do you want to log out of the YOLOCraft account?' },
  'enter_email': { pt: 'Digite seu e-mail de explorador:', en: 'Enter your explorer email:' },
  'access_panel': { pt: 'ACESSAR PAINEL', en: 'ACCESS PANEL' },
  'logout_btn': { pt: 'DESCONECTAR', en: 'LOG OUT' },
  
  // Home Bento Section
  'bento1_title': { pt: 'Analise Espacial Avancada', en: 'Advanced Spatial Analysis' },
  'bento1_desc': { 
    pt: 'Nosso algoritmo do YOLOCraft detecta múltiplos mobs mesmo em áreas de densa folhagem ou cavernas profundas. Receba feedback em tempo real com probabilidade de drops de pólvora, teia, flechas ou carne podre de pixels brutos filtrados do HUD.',
    en: 'Our YOLOCraft algorithm detects multiple mobs even in dense foliage or deep caverns. Receive real-time feedback with probability of gunpowder, string, arrows, or rotten flesh drops from raw pixels filtered by HUD.'
  },
  'bento2_title': { pt: 'Previsao de Auto-Loot', en: 'Auto-Loot Prediction' },
  'bento2_desc': {
    pt: 'Preveja os espólios de drops potenciais com base nos encantamentos atuais do jogador e variantes de mobs detectadas a até 16 chunks de distância.',
    en: 'Predict potential loot drops based on player current enchantments and detected mob variants up to 16 chunks away.'
  },
  
  // Scan History
  'scan_history': { pt: 'Varreduras Recentes', en: 'Recent Scans' },
  'scan_history_sub': { pt: 'Histórico das últimas sondas ativas de Redstone', en: 'History of the latest active Redstone probes' },
  'view_all_reports': { pt: 'Ver Todos Relatórios →', en: 'View All Reports →' },
  'clear_history': { pt: 'Limpar Histórico', en: 'Clear History' },
  'no_history': { pt: 'Nenhuma varredura recente encontrada.', en: 'No recent scans found.' },
  
  // Quick Stats Feet
  'stats_mobs': { pt: 'Mobs Escaneados', en: 'Mobs Scanned' },
  'stats_accuracy': { pt: 'Precisao de Deteccao', en: 'Detection Accuracy' },
  'stats_time': { pt: 'Tempo de Inferencia', en: 'Inference Time' },

  // Detector Panel Main Screen
  'single_mode': { pt: 'MODO INDIVIDUAL', en: 'SINGLE MODE' },
  'comparative_mode': { pt: 'MODO COMPARATIVO', en: 'COMPARATIVE MODE' },
  'comparative_desc': { pt: 'Compare o pipeline YOLO + SAM em tempo real contra 3 métodos clássicos de visão computacional (Otsu, HSV, GrabCut).', en: 'Compare the YOLO + SAM pipeline in real-time against 3 classic computer vision methods (Otsu, HSV, GrabCut).' },
  'engines_running': { pt: 'EXECUTANDO 4 ENGINES EM PARALELO...', en: 'EXECUTING 4 ENGINES IN PARALLEL...' },
  'det_title': { pt: 'DETECTOR OPTICO YOLO-VOXEL', en: 'YOLO-VOXEL OPTICAL DETECTOR' },
  'det_subtitle': { pt: 'SISTEMA INTEGRADO DE RASTREAMENTO E RECONHECIMENTO DE ENTIDADES EM CHUNKS', en: 'INTEGRATED CHUNK ENTITY TRACKING & RECOGNITION SYSTEM' },
  'server_status': { pt: 'Status do Servidor:', en: 'Server Status:' },
  'server_simulated': { pt: 'SIMULADO OFFLINE (RAPIDO)', en: 'SIMULATED OFFLINE (FAST)' },
  'server_real': { pt: 'SERVIDOR EM NUVEM REAL', en: 'REAL CLOUD SERVER' },
  'select_image': { pt: 'SELECIONE UMA CAPTURA DE TELA DE ENTRADA DO MINECRAFT', en: 'SELECT A MINECRAFT INPUT SCREENSHOT' },
  'choose_file': { pt: 'Escolher Arquivo', en: 'Choose File' },
  'drag_drop': { pt: 'ou arraste e solte a imagem aqui', en: 'or drag & drop the image here' },
  'format_tip': { pt: 'Suporta PNG, JPG até 10MB. Idealmente contendo mobs visíveis do Minecraft.', en: 'Supports PNG, JPG up to 10MB. Ideally containing visible Minecraft mobs.' },
  'conf_threshold': { pt: 'Limiar de Confianca', en: 'Confidence Threshold' },
  'view_mode': { pt: 'Modo de Visualizacao', en: 'View Mode' },
  'view_spotlight': { pt: 'Destaque Spotlight', en: 'Spotlight Highlight' },
  'view_overlay': { pt: 'Sobreposicao Total', en: 'Full Overlay' },
  'view_bbox': { pt: 'Apenas Caixas', en: 'Boxes Only' },
  'live_mode': { pt: 'Modo de Varredura Continua (Simulacao em Tempo Real)', en: 'Continuous Scanning Mode (Real-time Simulation)' },
  'activate_live': { pt: 'ATIVAR VARREDURA AO VIVO', en: 'ACTIVATE LIVE SCANNING' },
  'deactivate_live': { pt: 'DESATIVAR VARREDURA AO VIVO', en: 'DEACTIVATE LIVE SCANNING' },
  'recommendation': { pt: 'RECOMENDACAO TATICA', en: 'TACTICAL RECOMMENDATION' },
  'open_wiki': { pt: 'ABRIR WIKI COMPLETA →', en: 'OPEN FULL WIKI →' },
  'open_wiki_short': { pt: 'ABRIR WIKI', en: 'OPEN WIKI' },
  'focus_target': { pt: 'FOCAR ALVO', en: 'FOCUS TARGET' },
  'global_view': { pt: 'Visao Global [ESC]', en: 'Global View [ESC]' },
  'target_locked': { pt: 'TELEMETRIA DE ALVO TRANCADO', en: 'LOCKED TARGET TELEMETRY' },
  'restore_global': { pt: 'RESTAURAR VISAO GLOBAL [ESC]', en: 'RESTORE GLOBAL VIEW [ESC]' },
  'entity_lbl': { pt: 'Entidade', en: 'Entity' },
  'signature_lbl': { pt: 'Assinatura de Area', en: 'Area Signature' },
  'approach_lbl': { pt: 'Aproximacao Est.', en: 'Est. Distance' },
  'confidence_lbl': { pt: 'Confidencia', en: 'Confidence' },
  'processing': { pt: 'PROCESSANDO IMAGEM ATRAVES DO PIPELINE DE REDSTONE...', en: 'PROCESSING IMAGE THROUGH REDSTONE PIPELINE...' },
  'no_mobs': { pt: 'Nenhum mob detectado nesta chunk.', en: 'No mobs detected in this chunk.' },
  'error_processing': { pt: 'Erro ao processar imagem:', en: 'Error processing image:' },
  'custom_upload_title': { pt: 'MODULO CARREGADO PELO EXPLORADOR', en: 'MODULE UPLOADED BY EXPLORER' },

  // Bestiary / Encyclopedia Section
  'enc_title': { pt: 'ENCICLOPEDIA DE ENTIDADES', en: 'BESTIARY OF ENTITIES' },
  'enc_subtitle': { pt: 'A Rede Neural YOLO-VOXEL catalogou as seguintes entidades com base no treinamento de Redstone. A precisão de segmentação é validada através de 40.000 quadros de voxels únicos no bioma Overworld.', en: 'The YOLO-VOXEL Neural Network has cataloged the following entities based on Redstone training. Segmentation accuracy is validated across 40,000 unique voxel frames in the Overworld biome.' },
  'temperament': { pt: 'Temperamento', en: 'Temperament' },
  'accuracy_lbl': { pt: 'Confiavel YOLO', en: 'YOLO Confidence' },
  'desc_system': { pt: 'DESCRICAO DO SISTEMA', en: 'SYSTEM DESCRIPTION' },
  'behavior_obs': { pt: 'COMPORTAMENTO OBSERVADO', en: 'OBSERVED BEHAVIOR' },
  'drops_possible': { pt: 'DROPS POSSIVEIS', en: 'POTENTIAL DROPS' },
  'entity_props': { pt: 'PROPRIEDADES DA ENTIDADE', en: 'ENTITY PROPERTIES' },
  'close_logs': { pt: 'FECHAR LOGS', en: 'CLOSE LOGS' },
  'data_analysis': { pt: 'ANALISE DE DADOS', en: 'DATA ANALYSIS' },
  'no_drops': { pt: 'Nenhum drop registrado.', en: 'No drops recorded.' },
  'classification': { pt: 'Classificacao:', en: 'Classification:' },
  'accuracy_card': { pt: 'Confiabilidade YOLO:', en: 'YOLO Confidence:' },

  // Stats Panel
  'stats_title': { pt: 'Painel Estatistico de Varreduras', en: 'Historical Scan Statistics' },
  'stats_subtitle': { pt: 'Acompanhe o tráfego de entidades catalogadas pelas suas sondas analíticas. Escolha e clique em qualquer registro do banco de dados local para re-escanear no visor óptico principal do detector.', en: 'Monitor the traffic of entities cataloged by your analytical probes. Select and click any record from the local database to re-scan in the main optical display of the detector.' },
  'accuracy_general': { pt: 'Precisao Geral', en: 'General Accuracy' },
  'threats_avoided': { pt: 'Ameacas Evitadas', en: 'Threats Avoided' },
  'chunks_mapped': { pt: 'Chunks Mapeadas', en: 'Chunks Mapped' },
  'loop_state': { pt: 'Estado do Loop', en: 'Loop State' },
  'stable': { pt: 'ESTAVEL', en: 'STABLE' },
  'archive_title': { pt: 'Arquivo Historico de Chunks Analisadas', en: 'Historical Archive of Analyzed Chunks' },
  'table_id_lbl': { pt: 'IDENTIFICADOR', en: 'IDENTIFIER' },
  'table_time_lbl': { pt: 'HORARIO DA SONDA', en: 'PROBE TIMESTAMP' },
  'table_depth_lbl': { pt: 'PROFUNDIDADE', en: 'DEPTH' },
  'table_threat_lbl': { pt: 'NIVEL DE CRITICIDADE', en: 'THREAT LEVEL' },
  'table_conf_lbl': { pt: 'CONFIABILIDADE', en: 'CONFIDENCE' },
  'table_action_lbl': { pt: 'ACAO', en: 'ACTION' },
  're_analyze': { pt: 'RE-ANALISAR', en: 'RE-ANALYZE' },
  'delete_scan': { pt: 'Excluir', en: 'Delete' },

  // Threat levels
  'threat_critical': { pt: 'CRÍTICO', en: 'CRITICAL' },
  'threat_high': { pt: 'ALTO', en: 'HIGH' },
  'threat_medium': { pt: 'MÉDIO', en: 'MEDIUM' },
  'threat_low': { pt: 'BAIXO', en: 'LOW' },

  // Temperaments
  'temp_passive': { pt: 'Pacífico (Passivo)', en: 'Peaceful (Passive)' },
  'temp_passive_desc': { pt: 'Não ataca o jogador sob nenhuma circunstância.', en: 'Does not attack the player under any circumstances.' },
  'temp_neutral': { pt: 'Neutro', en: 'Neutral' },
  'temp_neutral_desc': { pt: 'Ataca apenas se for provocado ou atacado primeiro.', en: 'Attacks only if provoked or attacked first.' },
  'temp_hostile': { pt: 'Hostil', en: 'Hostile' },
  'temp_hostile_desc': { pt: 'Ataca o jogador imediatamente ao avistá-lo.', en: 'Attacks the player immediately on sight.' },
  'temp_range': { pt: 'Hostil (À Distância)', en: 'Hostile (Ranged)' },
  'temp_range_desc': { pt: 'Dispara projéteis contra o jogador à distância.', en: 'Fires projectiles at the player from a distance.' },
  'temp_default': { pt: 'Comportamento padrão.', en: 'Default behavior.' },

  // Footer
  'footer_desc': { pt: 'YOLOCraft - Detector Óptico Redstone de Redes Neurais para exploração segura de chunks do Overworld.', en: 'YOLOCraft - Neural Network Redstone Optical Detector for safe exploration of Overworld chunks.' },
  'footer_copy': { pt: '© 2026 YOLOCraft Labs. Todos os direitos reservados. Feito com pixels puros e blocos de Redstone.', en: '© 2026 YOLOCraft Labs. All rights reserved. Crafted with pure pixels and Redstone blocks.' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('yolocraft_lang');
    return (saved === 'en' ? 'en' : 'pt') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('yolocraft_lang', lang);
  };

  const t = (key: string): string => {
    const entry = dictionary[key];
    if (!entry) return key;
    const val = entry[language] || entry['pt'];
    
    // List of keys to KEEP accents because they are rendered in font-sans (Inter)
    const keepAccentsKeys = [
      'bento1_desc',
      'bento2_desc',
      'enc_subtitle',
      'stats_subtitle',
      'footer_desc',
      'footer_copy',
      'temp_passive_desc',
      'temp_neutral_desc',
      'temp_hostile_desc',
      'temp_range_desc',
      'temp_default'
    ];
    
    if (language === 'pt' && !keepAccentsKeys.includes(key) && !key.endsWith('_desc')) {
      return val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return val;
  };

  const translateMob = (mobName: string): string => {
    const key = mobName.toLowerCase().trim();
    
    // Check if we have exact translation for this mob
    const entry = mobTranslations[key];
    let result = mobName;
    if (entry) {
      result = entry[language];
    } else {
      // Secondary matches (e.g. "zumbi #01" or "zombie #01" -> extract and match)
      for (const [mKey, trans] of Object.entries(mobTranslations)) {
        if (key.includes(mKey)) {
          const rest = mobName.toLowerCase().replace(mKey, '').toUpperCase().trim();
          const transValue = trans[language];
          result = rest ? `${transValue} ${rest}` : transValue;
          break;
        }
      }
    }

    if (language === 'pt') {
      return result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return result;
  };

  const getTranslatedMobDetails = (entity: MobEntity): MobEntity => {
    const trans = detailedMobTranslations[entity.id];
    if (!trans) return entity;
    
    const strip = (s: string) => language === 'pt' ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
    
    return {
      ...entity,
      name: strip(trans.name[language]),
      type: strip(trans.type[language]),
      description: trans.description[language],
      behavior: trans.behavior[language],
      drops: trans.drops[language].map(strip)
    };
  };

  const removeAccents = (str: string): string => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateMob, getTranslatedMobDetails, removeAccents }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
