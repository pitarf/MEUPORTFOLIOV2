/**
 * Dados Completos e Suculentos da Hamburgueria Artesanal & Gastrobar
 * Modelo de Alta Conversao para Delivery Proprio e Salao Gastronomico.
 * Compativel com o motor de prospeccao ativa via CRM e Google Maps Scraper.
 */

export const defaultBurgerData = {
  id: 'iron-burger',
  slug: 'iron-burger',
  name: 'Iron Burger Artesanal',
  legalName: 'Iron Burger & Gastrobar Ltda',
  slogan: 'Hambúrguer de Verdade com Blend Angus 100% Grelhado no Fogo',
  tagline: 'Crosta perfeita, queijo derretido e pão brioche artesanal. Peça direto e fuja das taxas de app.',
  description:
    'Nascemos da obsessão por hambúrguer de verdade: carnes selecionadas 100% Angus moídas no dia, pão brioche de fermentação natural selado na manteiga de garrafa e molhos autorais defumados na brasa. Peça direto no nosso WhatsApp e receba quentinho em até 35 minutos.',
  rating: 4.9,
  reviewsCount: 528,
  ordersCount: '18.000+',
  avgDeliveryTime: '30 - 40 min',
  minOrder: 'R$ 25,00',
  freeDeliveryThreshold: 'R$ 80,00',
  standardDeliveryFee: 'R$ 6,00',
  discountDirectOrder: '15% OFF no primeiro pedido direto',

  contact: {
    phone: '(21) 98765-4321',
    whatsapp: '5521987654321',
    instagram: '@ironburger.artesanal',
    email: 'contato@ironburger.com.br',
    website: 'https://ironburger.com.br'
  },

  location: {
    address: 'Rua das Laranjeiras, 452',
    neighborhood: 'Laranjeiras',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22240-006',
    referencePoint: 'Próximo à Praça São Salvador',
    googleMapsUrl: 'https://maps.google.com/?q=Rua+das+Laranjeiras+452+Rio+de+Janeiro',
    deliveryRadius: 'Atendemos num raio de até 8 km',
    coveredNeighborhoods: [
      'Laranjeiras',
      'Flamengo',
      'Botafogo',
      'Catete',
      'Cosme Velho',
      'Glória',
      'Humaitá',
      'Urca'
    ]
  },

  schedules: {
    status: 'Chapa Quente / Aberto para Pedidos',
    isOpenNow: true,
    weekDays: 'Terça a Domingo',
    deliveryHours: '18h00 às 23h45',
    salonHours: '18h30 às 23h30',
    closedDay: 'Segunda-feira (descanso da equipe e defumação de insumos)'
  },

  badges: [
    { label: 'Blend 100% Angus', desc: 'Moído fresco diariamente' },
    { label: 'Brioche na Manteiga', desc: 'Fermentação natural 24h' },
    { label: 'Cheddar Inglês Melt', desc: 'Derretido no vapor da chapa' },
    { label: 'Entrega Térmica', desc: 'Chega sequinho e crocante' }
  ],

  stats: [
    { value: '18.000+', label: 'Burgers Entregues', sublabel: 'com excelência e ponto perfeito' },
    { value: '4.9 / 5.0', label: 'Nota Google Maps', sublabel: 'mais de 520 clientes avaliando' },
    { value: '35 min', label: 'Tempo Médio Delivery', sublabel: 'com embalagem térmica anti-impacto' },
    { value: 'Zero Taxas', label: 'Preço Justo no Zap', sublabel: 'cardápio sem ágio de 27% de app' }
  ],

  // Combos especiais de alta saida
  combos: [
    {
      id: 'combo-smash-duplo',
      title: 'Combo Smash Duplo Perfeito',
      badge: 'Mais Vendido',
      originalPrice: 58.90,
      price: 46.90,
      saveAmount: 12.00,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80',
      description: '2 discos de smash burger 90g com crosta ultra crocante, cheddar duplo derretido, cebola chapeada, pão brioche amanteigado + Batata Rústica Individual + Refrigerante lata ou água gelada.',
      includes: [
        '1x Double Smash Cheddar Melt',
        '1x Batata Rústica Individual com Páprica',
        '1x Bebida Lata 350ml à escolha',
        '1x Molho Secreto da Casa 40ml'
      ],
      tag: 'Economize R$ 12,00'
    },
    {
      id: 'combo-monster-angus',
      title: 'Combo Monster Angus Gastrobar',
      badge: 'Destaque do Chef',
      originalPrice: 69.90,
      price: 54.90,
      saveAmount: 15.00,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80',
      description: 'Nosso burger carro-chefe de 200g grelhado no fogo, queijo gouda cremoso, tiras generosas de bacon artesanal defumado em lenha de macieira, cebola caramelizada no pão brioche tostado + Batata Especial + Chopp Pilsen 500ml ou Refrigerante.',
      includes: [
        '1x Iron Monster Angus 200g',
        '1x Batata Rústica com Cheddar Melt e Bacon',
        '1x Chopp Pilsen Artesanal 500ml (ou Refrigerante)',
        '1x Maionese Trufada da Casa 40ml'
      ],
      tag: 'Economize R$ 15,00'
    },
    {
      id: 'combo-casal-gourmet',
      title: 'Combo Casal / Amigos em Dobro',
      badge: 'Ideal para 2 Pessoas',
      originalPrice: 118.00,
      price: 94.90,
      saveAmount: 23.10,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
      description: '2 Burgers Artesanais à sua escolha (Iron Monster ou Smash Duplo) + 1 Porção Grande de Batata Rústica Crocante com Bacon e Cheddar + 2 Bebidas Geladas + 2 Molhos especiais.',
      includes: [
        '2x Burgers Artesanais Premium à escolha',
        '1x Porção Compartilhada de Batatas com Cheddar e Bacon',
        '2x Bebidas (Refri lata ou Chopp artesanal)',
        '2x Molhos Autorais à escolha'
      ],
      tag: 'Economize R$ 23,10'
    }
  ],

  // Categorias do Cardapio
  menuCategories: [
    { id: 'todos', label: 'Cardápio Completo' },
    { id: 'smash', label: 'Smash Burgers' },
    { id: 'artesanais', label: 'Burgers Gourmet 200g' },
    { id: 'entradas', label: 'Entradas & Porções' },
    { id: 'sobremesas', label: 'Sobremesas & Shakes' },
    { id: 'bebidas', label: 'Chopps & Bebidas' }
  ],

  // Itens do Cardapio
  menuItems: [
    // SMASH BURGERS
    {
      id: 'item-smash-classic',
      category: 'smash',
      name: 'Classic Smash Bacon',
      badge: 'Favorito da Galera',
      price: 32.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Pão brioche dourado na manteiga de garrafa, dois discos de 80g smash com aquela crostinha perfeita prensada na chapa de ferro, queijo cheddar americano duplo, fatias de bacon crocante e maionese artesanal da casa.',
      highlights: ['Blend Angus 160g', 'Bacon Defumado', 'Cheddar Duplo'],
      isSpicy: false,
      isVegetarian: false
    },
    {
      id: 'item-smash-oklahoma',
      category: 'smash',
      name: 'Oklahoma Onion Smash',
      badge: 'Receita Tradicional',
      price: 31.90,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      description: 'Clássico americano onde finíssimas fatias de cebola são esmagadas diretamente contra a carne na chapa ultra quente, caramelizando na própria gordura do burger. Queijo prato duplo derretido e molho barbecue rústico.',
      highlights: ['Cebola Caramelizada na Chapa', 'Crosta Intensa', 'Molho Barbecue'],
      isSpicy: false,
      isVegetarian: false
    },
    {
      id: 'item-smash-trufado',
      category: 'smash',
      name: 'Smash Trufado Melt',
      badge: 'Edição Premium',
      price: 36.90,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
      description: 'Dois smashes 90g de pura carne Angus, blend de queijo estepe e mussarela fundida, cogumelos salteados na manteiga e maionese aromática com azeite de trufas brancas servido no pão brioche.',
      highlights: ['Azeite de Trufas', 'Cogumelos Salteados', 'Queijo Estepe'],
      isSpicy: false,
      isVegetarian: false
    },
    {
      id: 'item-smash-triple-cheese',
      category: 'smash',
      name: 'Triple Smash Cheddar Bomb',
      badge: 'Super Recheado',
      price: 39.90,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
      description: 'Para quem ama queijo sem moderação: 3 discos smash de 75g (225g de carne total), intercalados com 3 camadas generosas de queijo cheddar inglês derretido na cúpula com toque de cebola roxa bem fininha e picles artesanal.',
      highlights: ['3 Carnes Smash', '3x Cheddar Inglês', 'Picles da Casa'],
      isSpicy: false,
      isVegetarian: false
    },

    // BURGERS GOURMET 200g
    {
      id: 'item-iron-monster',
      category: 'artesanais',
      name: 'Iron Monster Angus 200g',
      badge: 'O Campeão de Vendas',
      price: 44.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Hambúrguer de 200g alto e suculento grelhado no ponto que você pedir. Acompanha queijo gouda maçaricado, geleia de pimenta defumada com bacon em cubos crocantes, rúcula fresca e pão australiano tostado.',
      highlights: ['Hambúrguer Alto 200g', 'Geleia de Pimenta & Bacon', 'Pão Australiano'],
      isSpicy: true,
      isVegetarian: false
    },
    {
      id: 'item-gorgonzola-rib',
      category: 'artesanais',
      name: 'Gorgonzola & Rib Supreme',
      badge: 'Defumado em Lenha',
      price: 47.90,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      description: 'Blend de costela Angus 200g assado na grelha, creme aveludado de queijo gorgonzola com toque de mel silvestre, anéis de cebola crispy super sequinhos e molho aioli de alho assado.',
      highlights: ['Blend de Costela 200g', 'Creme de Gorgonzola', 'Cebola Crispy Dourada'],
      isSpicy: false,
      isVegetarian: false
    },
    {
      id: 'item-brie-crispy',
      category: 'artesanais',
      name: 'Brie Imperial com Bacon Honey',
      badge: 'Toque Sofisticado',
      price: 49.90,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      description: 'Blend Angus 200g, fatia grossa de queijo brie legítimo derretido no maçarico, tiras de bacon glaceadas com mel e pimenta preta moída na hora, rúcula baby e pão brioche amanteigado.',
      highlights: ['Queijo Brie Francês', 'Bacon Honey Glazed', 'Pão Brioche Selado'],
      isSpicy: false,
      isVegetarian: false
    },
    {
      id: 'item-green-veggie',
      category: 'artesanais',
      name: 'Smoked Veggie Gastrobar',
      badge: 'Opção Vegetariana',
      price: 38.90,
      image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
      description: 'Hambúrguer artesanal de cogumelos Portobello com grão-de-bico defumado na fumaça líquida de macieira, queijo provolone derretido, tomate caqui assado, rúcula e molho de mostarda dijon e mel.',
      highlights: ['100% Cogumelos & Grãos', 'Provolone Derretido', 'Tomate Confitado'],
      isSpicy: false,
      isVegetarian: true
    },

    // ENTRADAS & PORÇÕES
    {
      id: 'item-batata-rustica-cheddar',
      category: 'entradas',
      name: 'Batata Rústica Cheddar & Bacon',
      badge: 'Porção Generosa',
      price: 29.90,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
      description: 'Batatas com corte rústico e casca crocante, temperadas com páprica defumada e alecrim fresco. Cobertas por um rio de creme de cheddar inglês cremoso e farofa crocante de bacon artesanal.',
      highlights: ['Para Compartilhar', 'Cheddar Genuíno', 'Farofa Crocante de Bacon'],
      isSpicy: false,
      isVegetarian: false
    },
    {
      id: 'item-dadinho-tapioca',
      category: 'entradas',
      name: 'Dadinhos de Tapioca com Queijo Coalho',
      badge: 'Acompanha Geleia',
      price: 26.90,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
      description: '12 dadinhos dourados e crocantes por fora, macios e elásticos por dentro com queijo de coalho do sertão. Acompanha nosso pote de geleia artesanal de pimenta agridoce.',
      highlights: ['12 Unidades', 'Queijo de Coalho Real', 'Geleia de Pimenta'],
      isSpicy: true,
      isVegetarian: true
    },
    {
      id: 'item-onion-rings',
      category: 'entradas',
      name: 'Onion Rings Empanadas na Cerveja IPA',
      badge: 'Super Crocantes',
      price: 24.90,
      image: 'https://images.unsplash.com/photo-1639024471285-0599a834b679?auto=format&fit=crop&w=800&q=80',
      description: 'Anéis grossos de cebola fresca mergulhados na massa leve à base de chopp artesanal IPA e farinha panko japonesa, fritas na hora. Acompanha molho aioli defumado.',
      highlights: ['Empanamento Panko', 'Massa de Chopp IPA', 'Molho Aioli Incluso'],
      isSpicy: false,
      isVegetarian: true
    },
    {
      id: 'item-coxinhas-costela',
      category: 'entradas',
      name: 'Coxinhas sem Massa de Costela Angus',
      badge: 'Receita Exclusiva',
      price: 32.90,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      description: '6 unidades feitas 100% com recheio de costela bovina desfiada que cozinhou por 8 horas com especiarias e queijo provolone, empanadas direto na farinha panko sem massa pesada.',
      highlights: ['Puro Recheio de Costela', 'Sem Massa Pesada', 'Cozimento de 8h'],
      isSpicy: false,
      isVegetarian: false
    },

    // SOBREMESAS & SHAKES
    {
      id: 'item-shake-doce-leite',
      category: 'sobremesas',
      name: 'Milkshake de Doce de Leite com Flor de Sal',
      badge: 'Irresistível 500ml',
      price: 24.90,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      description: 'Sorvete artesanal batido com autêntico doce de leite mineiro cremoso, borda da taça farta de doce de leite, chantilly fresco e uma pitada de flor de sal para equilibrar a doçura.',
      highlights: ['500ml', 'Doce de Leite Mineiro', 'Chantilly da Casa'],
      isSpicy: false,
      isVegetarian: true
    },
    {
      id: 'item-shake-nutella-lotus',
      category: 'sobremesas',
      name: 'Shake Nutella Pura & Biscoito Lotus',
      badge: 'Queridinho',
      price: 27.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Base de sorvete de baunilha de Madagascar batida com Nutella de verdade, farofa de biscoito caramelizado belga Lotus Biscoff e calda de chocolate belga morna.',
      highlights: ['Nutella Legítima', 'Biscoff Caramelizado', 'Calda Quente'],
      isSpicy: false,
      isVegetarian: true
    },
    {
      id: 'item-cookie-frigideira',
      category: 'sobremesas',
      name: 'Cookie de Frigideira com Sorvete',
      badge: 'Servido Quente',
      price: 23.90,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      description: 'Cookie tradicional com gotas de chocolate meio amargo assado na mini frigideira de ferro fundido, servido fumegante com uma bola de sorvete de baunilha derretendo por cima.',
      highlights: ['Assado na Hora', 'Chocolate Meio Amargo', 'Sorvete Cremoso'],
      isSpicy: false,
      isVegetarian: true
    },

    // BEBIDAS & CHOPPS
    {
      id: 'item-chopp-ipa',
      category: 'bebidas',
      name: 'Chopp Artesanal IPA 500ml',
      badge: 'Direto da Torneira',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80',
      description: 'Cerveja artesanal fresca com lúpulos nobres, aroma cítrico de maracujá e pinho, amargor limpo e equilibrado que harmoniza com a gordura saborosa do burger.',
      highlights: ['Copo 500ml Ultra Gelado', 'Lúpulo Cítrico Aromático', 'Harmonização Perfeita'],
      isSpicy: false,
      isVegetarian: true
    },
    {
      id: 'item-chopp-pilsen',
      category: 'bebidas',
      name: 'Chopp Pilsen Puro Malte 500ml',
      badge: 'Leve e Refrescante',
      price: 14.90,
      image: 'https://images.unsplash.com/photo-1538488881522-4321453a9927?auto=format&fit=crop&w=800&q=80',
      description: 'Chopp dourado brilhante, puro malte cevada com colarinho branco espesso e cremoso. Servido no copo trincando de gelado para brindar.',
      highlights: ['Puro Malte 100%', 'Colarinho Cremoso', 'Refrescância Máxima'],
      isSpicy: false,
      isVegetarian: true
    },
    {
      id: 'item-pink-lemonade',
      category: 'bebidas',
      name: 'Pink Lemonade Artesanal da Casa 400ml',
      badge: 'Sem Álcool',
      price: 12.90,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      description: 'Suco de limão siciliano espremido na hora com xarope artesanal de frutas vermelhas e água com gás gaseificada na casa. Refrescância pura com folhas de hortelã.',
      highlights: ['Limão Siciliano Natural', 'Frutas Vermelhas Frescas', 'Muito Gelo'],
      isSpicy: false,
      isVegetarian: true
    },
    {
      id: 'item-refrigerante-lata',
      category: 'bebidas',
      name: 'Refrigerante Lata 350ml',
      badge: 'Gela Rápido',
      price: 7.90,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      description: 'Coca-Cola Tradicional, Coca-Cola Zero Açúcar, Guaraná Antarctica ou Sprite lata servidos bem gelados.',
      highlights: ['Lata 350ml', 'Servido com Gelo e Limão'],
      isSpicy: false,
      isVegetarian: true
    }
  ],

  // Diferenciais do Gastrobar
  differentials: [
    {
      title: 'Blend 100% Angus Fresco',
      tag: 'Qualidade Inegociável',
      description: 'Nada de carne congelada de caixa. Nosso blend exclusivo de peito e acém Angus é moído diariamente na nossa cozinha, garantindo maciez, gordura balanceada e sabor que explode na mordida.',
      icon: 'Flame'
    },
    {
      title: 'Pão Brioche de Fermentação Natural',
      tag: 'Leveza & Maciez',
      description: 'Produzido por padeiro artesanal parceiro com fermentação lenta de 24 horas. É selado na manteiga de garrafa quente antes de receber o lanche, criando uma barreira impermeável que não desmancha.',
      icon: 'Sparkles'
    },
    {
      title: 'Cheddar Inglês Melt Verdadeiro',
      tag: 'Sem Amido ou Misturas',
      description: 'Usamos queijo de verdade fundido sob a cúpula de aço inoxidável com vapor de cerveja na própria chapa. O resultado é aquela cremosidade aveludada e dourada sem sabor artificial.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Embalagem Térmica Anti-Umidade',
      tag: 'Chega Crocante na Sua Mesa',
      description: 'Nossa caixa térmica autoral possui respiros milimétricos projetados para eliminar o excesso de vapor sem esfriar o lanche. O pão não fica encharcado e a batata se mantém crocante até a sua porta.',
      icon: 'PackageCheck'
    },
    {
      title: 'Sem Taxas Abusivas de Aplicativo',
      tag: 'Pedido Direto com Vantagem',
      description: 'Pedindo diretamente pelo nosso WhatsApp, você não paga os 27% que os apps cobram em cima do restaurante. Repassamos essa economia para você em combos mais baratos e porções generosas.',
      icon: 'TrendingUp'
    },
    {
      title: 'Grelhado no Fogo Vivo & Carvão',
      tag: 'Defumação Artesanal',
      description: 'Nossos burgers altos de 200g vão direto para a grelha com lascas de madeira de macieira, trazendo aquele aroma inconfundível de churrasco na brasa que nenhum fast-food consegue copiar.',
      icon: 'FlameKindling'
    }
  ],

  // Avaliacoes de Clientes Reais
  testimonials: [
    {
      id: 1,
      name: 'Matheus Albuquerque',
      role: 'Cliente Frequente de Sexta',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: 'Há 3 dias',
      comment: 'O melhor smash burger do Rio de Janeiro com folga. A crostinha da carne é surreal de crocante e o pão chega quentinho como se tivesse saído da chapa agora. Peço pelo WhatsApp e o motoboy chega em 25 minutos.',
      burgerOrdered: 'Combo Smash Duplo Perfeito'
    },
    {
      id: 2,
      name: 'Camila Vasconcellos',
      role: 'Local Guide Google • 42 avaliações',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: 'Há 1 semana',
      comment: 'O Iron Monster de 200g com aquela geleia de pimenta defumada é uma obra de arte. As batatas rústicas com cheddar e bacon chegam sequinhas e crocantes mesmo no delivery. Atendimento pelo Zap nota dez!',
      burgerOrdered: 'Iron Monster Angus 200g'
    },
    {
      id: 3,
      name: 'Rodrigo Medeiros',
      role: 'Vizinho do Bairro e Cliente Fiel',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      date: 'Há 2 semanas',
      comment: 'Paramos de pedir pelo iFood depois que conhecemos o canal direto deles no WhatsApp. Os combos saem muito mais em conta, a entrega é mais rápida e o chopp IPA vem trincando de gelado na embalagem térmica.',
      burgerOrdered: 'Combo Casal Gastrobar'
    }
  ],

  // Duvidas Frequentes (FAQ)
  faq: [
    {
      question: 'Como faço para pedir direto pelo WhatsApp?',
      answer: 'É muito simples e rápido: basta clicar em qualquer botão de pedido nesta página. Uma mensagem automática já vai ser pré-preenchida no seu WhatsApp. Nossa equipe responde na hora, confirma seus itens, endereço e forma de pagamento com você!'
    },
    {
      question: 'Qual é o tempo médio de entrega e taxa para a minha região?',
      answer: 'Nosso tempo médio de entrega fica entre 30 e 40 minutos em horários normais. Em dias de pico ou fins de semana, informamos a estimativa precisa no ato do pedido. A taxa varia de R$ 4 a R$ 8 para a nossa região de cobertura, e pedidos acima de R$ 80 contam com Entrega Grátis!'
    },
    {
      question: 'Quais formas de pagamento vocês aceitam na entrega e online?',
      answer: 'Aceitamos Pix (com chave automática e confirmação imediata), Cartões de Crédito e Débito (todas as principais bandeiras levadas pela máquina do entregador) e Vales Refeição/Alimentação (Alelo, Sodexo, Ticket Restaurante e Flash).'
    },
    {
      question: 'Os hambúrgueres chegam quentinhos e sem desmontar no trajeto?',
      answer: 'Sim! Esse é o nosso maior orgulho. Investimos em caixas térmicas com travas estruturadas e sistema de micro-respiro. Isso impede que o vapor amoleça o pão brioche e mantém o calor da chapa intacto até você abrir a caixa.'
    },
    {
      question: 'Posso pedir alterações nos lanches (tirar picles, ponto da carne, trocar molho)?',
      answer: 'Com certeza. Ao mandar a mensagem no WhatsApp, basta nos avisar sobre qualquer preferência ou restrição alimentar. Nossos burgers são preparados individualmente sob demanda para você.'
    },
    {
      question: 'Vocês têm opções vegetarianas no cardápio?',
      answer: 'Sim! Nosso Smoked Veggie é preparado com hambúrguer artesanal de cogumelos Portobello e grão-de-bico defumado na lenha, acompanhado de queijo derretido e molhos da casa. É tão saboroso quanto os de carne.'
    }
  ]
};

/**
 * Hamburguerias alternativas para testes e demonstracoes em outras cidades
 */
export const alternativeBurgerProfiles = [
  {
    ...defaultBurgerData,
    id: 'fogo-brasa-burger',
    slug: 'fogo-e-brasa',
    name: 'Fogo & Brasa Gastrobar',
    location: {
      ...defaultBurgerData.location,
      address: 'Av. Paulista, 1200',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      coveredNeighborhoods: ['Bela Vista', 'Jardins', 'Paraíso', 'Consolação', 'Pinheiros']
    },
    contact: {
      ...defaultBurgerData.contact,
      phone: '(11) 97766-5544',
      whatsapp: '5511977665544',
      instagram: '@fogoebrasa.burger'
    }
  }
];

/**
 * Retorna hamburgueria pelo slug
 * @param {string} slug
 * @returns {object|null}
 */
export function getBurgerBySlug(slug) {
  if (!slug) return defaultBurgerData;
  const cleanSlug = slug.toLowerCase().trim();
  if (cleanSlug === defaultBurgerData.slug || cleanSlug === 'demo') {
    return defaultBurgerData;
  }
  const found = alternativeBurgerProfiles.find((b) => b.slug === cleanSlug);
  return found || defaultBurgerData;
}

/**
 * Retorna hamburgueria padrao
 * @returns {object}
 */
export function getDefaultBurger() {
  return defaultBurgerData;
}
