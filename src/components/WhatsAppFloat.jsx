import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
    const handleWhatsAppClick = () => {
        const phoneNumber = '5521966149077'; // Replace with actual WhatsApp number
        const message = 'Olá! Gostaria de saber mais sobre os serviços da Rafael Pita Solutions.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <motion.button
            onClick={handleWhatsAppClick}
            className="whatsapp-float w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 pulse-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        >
            <MessageCircle className="w-8 h-8 text-white" />
        </motion.button>
    );
};

export default WhatsAppFloat;