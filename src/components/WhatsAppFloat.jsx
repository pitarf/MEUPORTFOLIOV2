import React from 'react';
import { motion } from 'framer-motion';
// Substituído o ícone genérico MessageCircle pelo logotipo oficial do WhatsApp
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Componente do Botão Flutuante de Atendimento via WhatsApp
 * Utiliza o logotipo oficial do WhatsApp com acabamento de alta qualidade e animações suaves.
 */
const WhatsAppFloat = () => {
    const handleWhatsAppClick = () => {
        const phoneNumber = '5521966149077';
        const message = 'Olá! Gostaria de saber mais sobre os serviços da Rafael Pita Solutions.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <motion.button
            onClick={handleWhatsAppClick}
            aria-label="Atendimento via WhatsApp"
            title="Fale conosco no WhatsApp"
            className="whatsapp-float group w-16 h-16 bg-[#25D366] hover:bg-[#20ba5a] rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_35px_rgba(37,211,102,0.65)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
        >
            {/* Logotipo oficial do WhatsApp em alta resolução com acabamento circular contrastado */}
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <WhatsAppIcon className="w-8 h-8" useImage={true} alt="WhatsApp Oficial" />
            </div>
        </motion.button>
    );
};

export default WhatsAppFloat;