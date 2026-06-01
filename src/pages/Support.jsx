import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const Support = () => {
    const { isAdmin } = useAuth();

    if (isAdmin) {
        return <Navigate to="/admin/support" replace />;
    }

    return <Navigate to="/contato" replace />;
};

export default Support;