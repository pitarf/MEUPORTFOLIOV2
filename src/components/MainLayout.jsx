import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="pt-20">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    );
};

export default MainLayout;
