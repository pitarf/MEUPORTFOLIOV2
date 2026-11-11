import React from 'react';
import { StoryArt, StoryArtProps } from './StoryArt';

export const StoryDelivery: React.FC = () => {
  const props: StoryArtProps = {
    nicheTag: 'DELIVERY • HAMBURGUERIA • GASTROBAR',
    nicheTagBg: 'rgba(249, 115, 22, 0.15)',
    nicheTagColor: '#FB923C',
    headlineNiche: 'VOCÊ TEM',
    headlineHighlight: 'DELIVERY OU HAMBURGUERIA',
    painText:
      'Pare de perder até 27% do faturamento em taxas de app. Tenha cardápio próprio e receba pedidos direto no seu WhatsApp.',
    imageSrc: 'captures/burger_mobile.png',
    imageOffsetY: -48,
    pill1: {
      icon: '🍔',
      title: 'Cardápio Próprio',
      subtitle: 'Com fotos reais e combos de alta conversão',
    },
    pill2: {
      icon: '💰',
      title: 'Taxa R$ 0,00',
      subtitle: '100% do lucro do seu restaurante no seu bolso',
    },
    pill3: {
      icon: '⚡',
      title: 'Pedido no WhatsApp',
      subtitle: 'Sem intermediários e atendimento imediato',
    },
    accentColor: '#F97316',
  };

  return <StoryArt {...props} />;
};

export const StoryBarbearia: React.FC = () => {
  const props: StoryArtProps = {
    nicheTag: 'BARBEARIA • SALÃO • ESTÉTICA',
    nicheTagBg: 'rgba(245, 158, 11, 0.15)',
    nicheTagColor: '#FBBF24',
    headlineNiche: 'VOCÊ TEM',
    headlineHighlight: 'BARBEARIA OU SALÃO',
    painText:
      'Clientes não querem esperar atendimento para saber preços. Mostre seus cortes e agende horários 24 horas por dia.',
    imageSrc: 'captures/barber_mobile.png',
    pill1: {
      icon: '💈',
      title: 'Tabela de Cortes',
      subtitle: 'Valores claros e fotos de trabalhos reais',
    },
    pill2: {
      icon: '📅',
      title: 'Agenda 24h sem Fila',
      subtitle: 'Agendamento rápido no WhatsApp',
    },
    pill3: {
      icon: '⭐',
      title: 'Google no Topo',
      subtitle: 'Clientes da sua região encontram você',
    },
    accentColor: '#F59E0B',
  };

  return <StoryArt {...props} />;
};

export const StoryClinica: React.FC = () => {
  const props: StoryArtProps = {
    nicheTag: 'CLÍNICA ODONTOLÓGICA • MÉDICOS • SAÚDE',
    nicheTagBg: 'rgba(14, 165, 233, 0.15)',
    nicheTagColor: '#38BDF8',
    headlineNiche: 'VOCÊ TEM',
    headlineHighlight: 'CLÍNICA OU CONSULTÓRIO',
    painText:
      'Mais de 84% dos pacientes buscam clínicas no Google antes de agendar. Passe autoridade e feche consultas particulares.',
    imageSrc: 'captures/dental_mobile.png',
    imageOffsetY: -35,
    pill1: {
      icon: '🩺',
      title: 'Autoridade Médica',
      subtitle: 'Tratamentos e diferenciais da clínica',
    },
    pill2: {
      icon: '📲',
      title: 'Consultas Particulares',
      subtitle: 'Direto no WhatsApp da sua recepção',
    },
    pill3: {
      icon: '📍',
      title: 'Google Maps 5★',
      subtitle: 'Destaque absoluto nas buscas da cidade',
    },
    accentColor: '#0EA5E9',
  };

  return <StoryArt {...props} />;
};

export const StoryAdvocacia: React.FC = () => {
  const props: StoryArtProps = {
    nicheTag: 'ADVOCACIA • CONTABILIDADE • CONSULTORIA',
    nicheTagBg: 'rgba(59, 130, 246, 0.15)',
    nicheTagColor: '#60A5FA',
    headlineNiche: 'VOCÊ TEM',
    headlineHighlight: 'ESCRITÓRIO OU ADVOCACIA',
    painText:
      'Clientes qualificados fecham com quem passa credibilidade no Google. Tenha sua página corporativa dentro das normas da OAB.',
    imageSrc: 'captures/legal_mobile.png',
    pill1: {
      icon: '⚖️',
      title: 'Autoridade Jurídica',
      subtitle: 'Áreas de atuação e ética profissional OAB',
    },
    pill2: {
      icon: '💼',
      title: 'Contato Qualificado',
      subtitle: 'Botão direto para análise de caso',
    },
    pill3: {
      icon: '🎯',
      title: 'Top 1 no Google',
      subtitle: 'Seja o primeiro advogado encontrado na comarca',
    },
    accentColor: '#3B82F6',
  };

  return <StoryArt {...props} />;
};
