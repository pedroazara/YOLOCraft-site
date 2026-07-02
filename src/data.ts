import { MobEntity, ScanResult } from './types';

export const BESTIARY_ENTITIES: MobEntity[] = [
  {
    id: 'creeper',
    number: '#001 HOSTIL',
    name: 'Creeper',
    type: 'Hostil',
    icon: 'warning',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCudt0I21jloEGhhCks-8Tt2M6P3JYadNxJ5qjTrUsb-uc7WY0xBjJX5b2oF7Q1lyiGUzxAPYioIkapy3295zY4J3qEK2hnaDkL6-w-NSjqWjf1CVPy8ZvhPCt3N9tqSqQcWVK1JXKD1K5Gu9kBSTedp0HNgbHhlZlWG45Vy_lcpb2ETNYY5IDBr76G0EuxyKWgdePFXa_Vzbp_DsRT6LRL8zCl1uF3-5s4MzqAUuHN1aI4kXTVLkvEaKT0Gqrx2_y1fwqz-GvOLzc',
    accuracy: 98.4,
    description: 'Criatura silenciosa e furtiva que se aproxima do jogador e explode, destruindo blocos e causando dano massivo de área.',
    behavior: 'Aproxima-se sem emitir som de passos. Produz um som de pavio ("ssss") 1.5 segundos antes de detonar. Desiste da detonação se o jogador se afastar o suficiente.',
    drops: ['Pólvora (0-2)', 'Disco de Música (se morto por esqueleto)']
  },
  {
    id: 'zombie',
    number: '#002 HOSTIL',
    name: 'Zumbi',
    type: 'Hostil',
    icon: 'skull',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaLIhVNu2HMsz6c7Fby9KEUuMDBzNoEvqApixoS2cyBVcp4K4bPawdRarqdILcvJGRl7GIV9PiJcZiozzACiI-_xokrkATuADrFk689qfS_fmGUG7iDtDIawcZwJXSsVDg7jfFySRFZyAtTtzeZraeM1rhHiDjlFZfdRAHwaZgg1jxvHPdtvdQxbeLfgKCkDNOuK_2o4jtVrQxzEtQnQp8lb4zFRcvb7kR58Vij8iNtxEbcxgnbdkk6X8B6B6ujOFmGHSi13tapxg',
    accuracy: 94.2,
    description: 'Monstro comum que persegue jogadores, aldeões e filhotes de tartaruga à vista. Queima sob a luz direta do sol.',
    behavior: 'Move-se lentamente em direção ao alvo. Capaz de derrubar portas de madeira em dificuldades elevadas. Pode gerar reforços ao sofrer dano.',
    drops: ['Carne Podre (0-2)', 'Cenoura (raro)', 'Batata (raro)', 'Lingote de Ferro (raro)']
  },
  {
    id: 'skeleton',
    number: '#003 ATAQUE À DISTÂNCIA',
    name: 'Esqueleto',
    type: 'Ataque à Distância',
    icon: 'target',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAep18oRpg3KrM9oInMgEdyHA7Y0qgisaUYjLgblYYIl3Xt9Em2DBDwLtsjQNVzTITHb5XqdGZqkx6G6njmVJLNeQxGNSRFe4pUWXyS8rFKP470h5Die8uKbNHEBkS60jRI-dTPbJLdfID3pnsVYAqFYTOHOjs34pLzk3LUXK-Jp7TNowb-9SMFCyd9xzPkx85g6ZQbbg1bMmDre8fVuw9ZOlLa28h3jgrNizdZW5r7YrCs9YinUsVt0mfE8zRx41MThqh3YBW5PIM',
    accuracy: 91.8,
    description: 'Atirador esquelético rápido armado com um arco. Queima sob o sol e foge de cachorros domesticados.',
    behavior: 'Mantém distância do jogador enquanto atira flechas. Move-se de um lado para o outro para evitar contra-ataques. Procura sombra durante o dia.',
    drops: ['Osso (0-2)', 'Flecha (0-2)', 'Arco Danificado (raro)']
  },
  {
    id: 'enderman',
    number: '#004 NEUTRO',
    name: 'Enderman',
    type: 'Neutro',
    icon: 'bolt',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCjSZBk7NczUIYfUkixENHjK6D1QzeXbaeVj_RKCuaVE_K3oZMem9HiBPaAkNo1svpM62mUl2YF2UODe9fs_9c-gfYzjn9oAeO0IV-VwnM9zSuMvQQ2TpUYqS3GfSDTc1eYursqxe-NUQy-yDLnHFUV_Qe6XAUJTFiChHCKRh8TujHkc1Wp3RL9pXG4tBcb6Obpm3RkNxBDkx7abnSPDCYm7RNVXwOgNDDOFP4wy28jIu4AhVG_dgiVCunPDq_7lSSARKwkxHFe8',
    accuracy: 65.2,
    description: 'Criatura alta, escura e de braços longos capaz de se teletransportar e recolher certos tipos de blocos.',
    behavior: 'Neutro até que um jogador olhe diretamente para seus olhos a até 64 blocos de distância, ou o ataque. Sofre dano ao entrar em contato com água ou chuva.',
    drops: ['Pérola do Fim (0-1)']
  },
  {
    id: 'spider',
    number: '#005 HOSTIL',
    name: 'Aranha',
    type: 'Hostil',
    icon: 'visibility',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFF7kPIdMhwhp7Wpl512ulSlwWIuG10lBdTD8xws5QNVsZtkgfAyulsawd8zHlkDmFgW4LDfvN8uPGcCTotlqULYgkQYNdF_u5j75zGc0C1CXbjPSrud9gUYlgsUeP7MjOmRcm3_sdgy6lL2-fX1SrFjRX2o1R4qomq7YrdmoToZ_IFvemC5eslEhJ8Zlgq091M0XQzgFYdtPaaaogLw6zpL9xfSDcagrUShiUVvazcy4M95iwrznKntzP-t0y1gIN7Ng63ZogohY',
    accuracy: 89.9,
    description: 'Aranha gigante ágil capaz de escalar paredes e saltar sobre os inimigos. É hostil apenas no escuro.',
    behavior: 'Hostil em níveis de luz abaixo de 7. Neutra sob luz do dia ou tochas fortes, a menos que provocada. Capaz de ver através de blocos sólidos e escalar verticalmente.',
    drops: ['Linha (0-2)', 'Olho de Aranha (raro)']
  },
  {
    id: 'irongolem',
    number: '#006 PASSIVO',
    name: 'Golem de Ferro',
    type: 'Passivo',
    icon: 'shield',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWGi9v6KaktYgW2-s3OdTJLJ6ywfjl-tkpeTv5gsg0eEvK3Xk3qw6JGFRVCXcv4DyA61VCLqu2K4yO8fvNRBovd4O9ut3m_1QSnhH8-S0Iz_rcUZ1RylSF2XoCKO2YHwLA6FPHfJ1Z8Go2qtxplclAkBvGmIvaXwbXgKx0TDJTYtmgjnoXBLKKyJ1H2Ky48DN_Yplam6K3MlFG_JyBcof3A47Dv7xhC7ik-ULVTBz5Eg9tjgDMGk070OMaXhViUYYI-6QcxErDFi0',
    accuracy: 99.1,
    description: 'Defensor maciço construído para proteger aldeias contra incursões de criaturas hostis e invasores.',
    behavior: 'Ataca automaticamente monstros hostis ao alcance. Não sofre dano de queda. Pode ser reparado pelo jogador utilizando lingotes de ferro.',
    drops: ['Lingote de Ferro (3-5)', 'Rosa (0-2)']
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
