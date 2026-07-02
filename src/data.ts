import { MobEntity, ScanResult } from './types';

export const BESTIARY_ENTITIES: MobEntity[] = [
  {
    id: 'cave_spider',
    number: '#001 HOSTIL',
    name: 'Aranha da Caverna',
    type: 'Hostil',
    icon: 'visibility',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Cave_Spider_JE2_BE2.png',
    accuracy: 93.5,
    description: 'Variante menor e azulada da aranha comum, encontrada em poços de minas abandonados. Seus ataques infligem veneno altamente prejudicial.',
    behavior: 'Ataca pulando no jogador. Consegue passar por aberturas estreitas de 1x1 ou meio bloco de altura. Escala paredes verticais e teias.',
    drops: ['Linha (0-2)', 'Olho de Aranha (0-1)']
  },
  {
    id: 'creeper',
    number: '#002 HOSTIL',
    name: 'Creeper',
    type: 'Hostil',
    icon: 'warning',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Creeper_JE2_BE2.png',
    accuracy: 98.4,
    description: 'Criatura silenciosa e furtiva que se aproxima do jogador e explode, destruindo blocos e causando dano massivo de área.',
    behavior: 'Aproxima-se sem emitir som de passos. Produz um som de pavio ("ssss") 1.5 segundos antes de detonar. Desiste da detonação se o jogador se afastar.',
    drops: ['Pólvora (0-2)', 'Disco de Música (se morto por esqueleto)']
  },
  {
    id: 'enderman',
    number: '#003 NEUTRO',
    name: 'Enderman',
    type: 'Neutro',
    icon: 'bolt',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Enderman_JE2_BE2.png',
    accuracy: 88.6,
    description: 'Criatura alta, escura e de braços longos capaz de se teletransportar e recolher certos tipos de blocos.',
    behavior: 'Neutro até que um jogador olhe diretamente para seus olhos a até 64 blocos de distância, ou o ataque. Sofre dano ao entrar em contato com água.',
    drops: ['Pérola do Fim (0-1)']
  },
  {
    id: 'skeleton',
    number: '#004 ATAQUE À DISTÂNCIA',
    name: 'Esqueleto',
    type: 'Ataque à Distância',
    icon: 'target',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Skeleton_JE2_BE2.png',
    accuracy: 91.8,
    description: 'Atirador esquelético rápido armado com um arco. Queima sob a luz direta do sol e foge ativamente de lobos domesticados.',
    behavior: 'Mantém distância do jogador enquanto atira flechas rápidas. Move-se lateralmente para desviar de contra-ataques. Procura sombra durante o dia.',
    drops: ['Osso (0-2)', 'Flecha (0-2)', 'Arco Danificado (raro)']
  },
  {
    id: 'slime',
    number: '#005 HOSTIL',
    name: 'Slime',
    type: 'Hostil',
    icon: 'warning',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Slime_JE2_BE2.png',
    accuracy: 85.0,
    description: 'Cubo verde gelatinoso que salta pelo bioma de pântano ou chunks específicas subterrâneas. Quando morto, divide-se em frações menores.',
    behavior: 'Salta em direção ao jogador para causar dano por contato. Apenas tamanhos médios e grandes causam dano. Move-se de forma independente.',
    drops: ['Bola de Slime (0-2)']
  },
  {
    id: 'spider',
    number: '#006 HOSTIL',
    name: 'Aranha',
    type: 'Hostil',
    icon: 'visibility',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Spider_JE2_BE2.png',
    accuracy: 89.9,
    description: 'Aranha gigante ágil capaz de escalar paredes e saltar sobre os inimigos. É hostil apenas em níveis baixos de iluminação.',
    behavior: 'Hostil em níveis de luz abaixo de 7. Neutra sob luz do dia a menos que seja atacada. Consegue escalar paredes verticais livremente.',
    drops: ['Linha (0-2)', 'Olho de Aranha (raro)']
  },
  {
    id: 'zombie',
    number: '#007 HOSTIL',
    name: 'Zumbi',
    type: 'Hostil',
    icon: 'skull',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Zombie_JE2_BE2.png',
    accuracy: 94.2,
    description: 'Monstro comum que persegue jogadores, aldeões e tartarugas à vista. Queima sob a luz direta do sol.',
    behavior: 'Move-se de forma lenta mas persistente em direção ao alvo. Capaz de derrubar portas de madeira em dificuldades difíceis.',
    drops: ['Carne Podre (0-2)', 'Cenoura (raro)', 'Batata (raro)', 'Lingote de Ferro (raro)']
  },
  {
    id: 'iron_golem',
    number: '#008 PASSIVO',
    name: 'Golem de Ferro',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Iron_Golem_JE2_BE2.png',
    accuracy: 99.1,
    description: 'Defensor maciço construído de blocos de ferro para proteger aldeões contra incursões de criaturas hostis e invasores.',
    behavior: 'Patrulha as vilas e ataca monstros hostis ao alcance automaticamente. Não sofre dano de quedas livres. Pode ser reparado com lingotes.',
    drops: ['Lingote de Ferro (3-5)', 'Rosa (0-2)']
  },
  {
    id: 'wolf',
    number: '#009 NEUTRO',
    name: 'Lobo',
    type: 'Neutro',
    icon: 'bolt',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Wolf_JE3_BE2.png',
    accuracy: 87.5,
    description: 'Canídeo domesticável que vaga em matilhas por florestas e biomas de taiga selvagens. Pode ser domesticado fornecendo ossos.',
    behavior: 'Ataca ovelhas e esqueletos selvagens. Se atacado em estado natural, toda a matilha ao redor se torna hostil contra o agressor.',
    drops: []
  },
  {
    id: 'cat',
    number: '#010 PASSIVO',
    name: 'Gato',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Tuxedo_Cat_JE2_BE2.png',
    accuracy: 90.1,
    description: 'Felino domesticável encontrado habitando vilas e cabanas de bruxas. Espanta creepers e fantasmas voadores.',
    behavior: 'Evita jogadores correndo rápido a menos que seja atraído com peixes crus. Adora sentar sobre camas e baús de armazenamento.',
    drops: ['Linha (0-2)']
  },
  {
    id: 'chicken',
    number: '#011 PASSIVO',
    name: 'Galinha',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Chicken_JE2_BE2.png',
    accuracy: 95.3,
    description: 'Ave passiva e comum que põe ovos e fornece penas de flecha e carne de frango. Bate asas para anular danos de quedas.',
    behavior: 'Vaga sem rumo pelo cenário. Produz ovos férteis em intervalos de 5 a 10 minutos. Segue jogadores que seguram sementes agrícolas.',
    drops: ['Frango Cru (1)', 'Pena (0-2)']
  },
  {
    id: 'cow',
    number: '#012 PASSIVO',
    name: 'Vaca',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Cow_JE2_BE2.png',
    accuracy: 96.0,
    description: 'Grande mamífero passivo criado por fazendeiros. Fornece leite infinitamente se ordenhado utilizando baldes vazios.',
    behavior: 'Foge assustada ao sofrer danos físicos. Pode ser procriada oferecendo trigo dourado. Segue jogadores portando trigo.',
    drops: ['Couro (0-2)', 'Bife Cru (1-3)']
  },
  {
    id: 'frog',
    number: '#013 PASSIVO',
    name: 'Sapo',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Temperate_Frog_JE2_BE1.png',
    accuracy: 89.2,
    description: 'Anfíbio passivo e saltador que habita biomas de pântano e manguezal úmidos. Capaz de produzir blocos brilhantes froglight.',
    behavior: 'Salta e nada ativamente. Ataca slimes e cubos de magma pequenos usando sua língua elástica, engolindo-os instantaneamente.',
    drops: []
  },
  {
    id: 'horse',
    number: '#014 PASSIVO',
    name: 'Cavalo',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/White_Horse_JE2_BE2.png',
    accuracy: 91.0,
    description: 'Montaria veloz e majestosa que pode ser equipada com armaduras metálicas de cavalo. Domado tentando montá-lo.',
    behavior: 'Vaga comendo capim selvagem. Capaz de realizar saltos altos para superar obstáculos de terreno e colinas íngremes.',
    drops: ['Couro (0-2)']
  },
  {
    id: 'pig',
    number: '#015 PASSIVO',
    name: 'Porco',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/Pig_JE2_BE2.png',
    accuracy: 96.5,
    description: 'Animal passivo clássico que pode ser cavalgado controladamente se equipado com sela e guiado com cenoura no palito.',
    behavior: 'Atraído e reproduzido utilizando cenouras ou beterrabas da horta. Se atingido por relâmpago, transmuta-se em Piglin Zumbificado.',
    drops: ['Costeleta de Porco Crua (1-3)']
  },
  {
    id: 'sheep',
    number: '#016 PASSIVO',
    name: 'Ovelha',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://images.weserv.nl/?url=https://minecraft.wiki/images/White_Sheep_JE2_BE2.png',
    accuracy: 97.2,
    description: 'Animal passivo de lã fofa que consome grama para regenerar seu revestimento. Pode ser tosada usando tesouras comuns.',
    behavior: 'Passa a maior parte do tempo pastando. Pode ter sua lã pintada artificialmente usando qualquer um dos 16 corantes.',
    drops: ['Lã (1-3)', 'Cordeiro Cru (1-2)']
  }
];

export const RECENT_SCANS: ScanResult[] = [
  {
    id: 'scan_zombie_091',
    name: 'ZOMBIE_091',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU4cbKBq1hIF7cyUNV_zyWnWIEQaySARTs8p7tIenh-k1WL80ZiouTeoiFnyfr4E6CN4_LGXeWGhOW9XD9m62u53GM0BOVGDRjonHO9ZOFgg9ugMAe6Lg850G8dyrSg_dMu2gn-gRaogwa8lOaVZODq15jSG8cnxjtT_6-0odEl5Tixhe25jCsOhVBkTOV-Z4fcB2ZYNNRMyKgK50xj5DWqVZheaQGrjEvCQgXNcT7QZGOInLIDc3Z5Un0P6pB0B5FfaU2dUh-3EU',
    threatLevel: 'ALTO',
    entitiesCount: 1,
    timestamp: '2026-06-24 05:42',
    depth: '12m',
    boundingBoxes: [
      { label: 'ZUMBI', confidence: 91.2, top: 25, left: 35, width: 30, height: 60 }
    ],
    insight: 'Zumbi solitário detectado próximo à entrada da ravina. Risco de queda induzida por empurrão.'
  },
  {
    id: 'scan_enderman_42',
    name: 'ENDERMAN_42',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiR5T1-43FG01WUUpFPN1wOVpNX1Xuz-VFmuiueW8CvCtXMktrbzP0IQeSN3dd4daRxtPOfUDzAx200Rs5Tvm1PXRd5RUPOZOYM430AMJ2G8_gZthuZKdmXfq3sWSjxoXQqChufsTEK3hb0QhM-XaSSWtnxncWhttlUpI_nsLXiaoqLh7EkpHlMQvdW5CnMJuxkZRlbBDjaL7hn9c82NXiTFvz0UXmuupgmoqMCBfUAnjF_HLBNfXlqhEx2x8_vxqcglWmhfcu9yI',
    threatLevel: 'MÉDIO',
    entitiesCount: 1,
    timestamp: '2026-06-24 05:15',
    depth: '4m',
    boundingBoxes: [
      { label: 'ENDERMAN', confidence: 65.2, top: 15, left: 40, width: 20, height: 75, color: '#ffdcc4' }
    ],
    insight: 'Enderman ativo carregando um bloco de terra. Recomenda-se evitar contato visual direto.'
  },
  {
    id: 'scan_skeleton_11',
    name: 'SKELETON_11',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADtppedK-2d_Jrz2aLO-SIV6ACE5dq6hR71s6A2cBnqVOPTgCih8L8u4a7jRWgTaB-5d21Gu7Ql02nSVst39fdwhCCHA9u82oNaHgzAHykU0ha25VEJNkLZ5D9KaqQwJ_YN5LQDYtAtkvE3e8xFhI-QUe0WbXBfNVsfNZD9dH5CNVcp9gI49QXWkYXCi-TCgTFkJjYgPi0lZxVCADs92Ayz3acUNUuYO5WHbjRd3B0wNRyk7fygLPPNNLrT9BT1l0SBYjdVNFB7Eg',
    threatLevel: 'ALTO',
    entitiesCount: 1,
    timestamp: '2026-06-24 04:30',
    depth: '22m',
    boundingBoxes: [
      { label: 'ESQUELETO', confidence: 91.8, top: 30, left: 35, width: 28, height: 55 }
    ],
    insight: 'Esqueleto munido com arco encantado em área escura. Equipe um escudo antes do combate frontal.'
  },
  {
    id: 'scan_spider_05',
    name: 'SPIDER_05',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAabZ-ZJsz7EscC1_M3pC4FsSelrYdG0dxJckPj_eLLM0lSPNR4352woVxe79Y623U9e54M9LFiAfSDxQTfWeFDpRfTZq02SQvAHaRLyKOOTo4Gh4QSbouPg2llitzUiR6W4SEZQF6HIIUxJ9h4fqZisPMmhLIDn-IJcVjs2gX-khhswWgv0xI8xuF32-wCNJIpna7pVvhKy42gY_f6RPHDAimkKK13i_XNOKQFAdsKcSLd3TDEWDq-ry_poN1Lhniw1oNfm_QGfbI',
    threatLevel: 'MÉDIO',
    entitiesCount: 1,
    timestamp: '2026-06-24 03:10',
    depth: '8m',
    boundingBoxes: [
      { label: 'ARANHA', confidence: 89.9, top: 40, left: 25, width: 50, height: 45, color: '#edbd9a' }
    ],
    insight: 'Aranha escalando a face norte da caverna. Alta velocidade de aproximação iminente.'
  },
  {
    id: 'scan_golem_prime',
    name: 'GOLEM_PRIME',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbhathdGdChB9JeXg_dqsyf1qK2EaKVnGzKKrjIJxgAkkjPmy-sL2et6cYQzaaIlj1i8XeqwzZsszBtIvFU1GV1vBYFMYvwJDHuNGe1Kh1FlcG0im2ZCcRKEKMOjVVxBfflLexUMQDg2enmKsX1fryjGxK_hDW9PIGpH1lakiXs_JjKaVQeL1aDtJgYYc0HBdDVIT3JY5E8W9_MeSVFdLtHd2skN05vRQnYsysMGjp1FjphS0BBSUib4DR11mz91dEU4wq0t8linY',
    threatLevel: 'BAIXO',
    entitiesCount: 1,
    timestamp: '2026-06-24 02:45',
    depth: '0m',
    boundingBoxes: [
      { label: 'GOLEM_FERRO', confidence: 99.1, top: 20, left: 30, width: 40, height: 70, color: '#acc7ff' }
    ],
    insight: 'Golem de Ferro patrulhando a borda oeste da vila. Nenhum perigo para o operador.'
  },
  {
    id: 'scan_witch_scan',
    name: 'WITCH_SCAN',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrTVVlfotzoxA6bEcumh2Tkx9wZzvl1sZ3Ln5gNP-AE3zZFlncqP76IdmC-iZCi6WDXVZ5fjEguWgUVtFo89ox-IBtyCo7fXJ4lq7DWMtWkdRGuapIsQUDDOCwwGLYrhJ6Piew33sf-U4nKrF8G160J1pE4NEiPeNYGAdJLeSwF8Jbr4-7m0p0hacLLgMCfd8DIHn5PJHkC2S3M0IQv6JYsBTslNQ0GtGmDKD-JT_nfj90Y3wpdapwBTiVlLuoe6mtWoz9HWdr6a0',
    threatLevel: 'CRÍTICO',
    entitiesCount: 1,
    timestamp: '2026-06-24 01:20',
    depth: '14m',
    boundingBoxes: [
      { label: 'BRUXA', confidence: 84.7, top: 20, left: 35, width: 30, height: 65, color: '#ffb4ab' }
    ],
    insight: 'Bruxa isolada preparando poções ácidas. Risco severo de envenenamento e dano mágico.'
  }
];

export const STATIC_RESULTS_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoFtXB3ecId2yHp3ZsLWvATbeaLdKEODBwaGjredKrJB7VW0zxqPzFkY5Z0bjE9wkmjKCcYxp47yan5axan9OtOT_J4t8g8cM2e8YbKX2kqAJvHV7w9l2mbDgFMVhA6FbuX_oYpprLDcIWhjOfsl-yy0Mbg80O5Y8drJIjNCuQ1oWpHAveQeFD1cJBkUTMcrLx-F3K_7LS2sQKCveUybcQ2rOKHUuKCG96i4cFiu--oESKTuo24_cudWgVn9K0Hebfx86tS_L62bs';

export const RESULTS_SCREENSHOT_BOUNDING_BOXES = [
  { label: 'ZUMBI #01', confidence: 98.2, top: 20, left: 12, width: 20, height: 60, color: '#a5d564', icon: 'skull' },
  { label: 'ZUMBI #02', confidence: 94.5, top: 30, left: 45, width: 18, height: 50, color: '#a5d564', icon: 'skull' },
  { label: 'ARANHA #01', confidence: 88.1, top: 15, left: 68, width: 23, height: 35, color: '#edbd9a', icon: 'bug_report' }
];
