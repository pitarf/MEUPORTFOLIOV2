export interface PromoVideoProps {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  brandName?: string;
  tagline?: string;
  websiteUrl?: string;
  whatsappContact?: string;
}

export const defaultVideoProps: PromoVideoProps = {
  primaryColor: '#3B82F6',
  accentColor: '#10B981',
  backgroundColor: '#0B0F17',
  brandName: 'Rafael Pita Solutions',
  tagline: 'Sistemas Sob Medida & Landing Pages de Alta Conversão',
  websiteUrl: 'rafaelpitaoficial.com.br',
  whatsappContact: '(21) 96614-9077'
};
