import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
        );
    }

    // Em ambiente de desenvolvimento local (localhost), permite visualização imediata para testes e desenvolvimento
    if (!user && !import.meta.env.DEV) {
        return <Navigate to="/area-clientes" replace />;
    }

    if (adminOnly && !isAdmin && !import.meta.env.DEV) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;