import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const { toast } = useToast();

    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSession = useCallback(async (session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setIsAdmin(currentUser?.email === 'rafael@rafaelpitaoficial.com.br');
        setLoading(false);
    }, []);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            handleSession(session);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                handleSession(session);
            }
        );

        return () => subscription.unsubscribe();
    }, [handleSession]);

    const signUp = useCallback(async (email, password, options) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Sign up Failed",
                description: error.message || "Something went wrong",
            });
        }

        return { error };
    }, [toast]);

    const signIn = useCallback(async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Sign in Failed",
                description: error.message || "Something went wrong",
            });
        }

        return { error };
    }, [toast]);

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast({
                variant: "destructive",
                title: "Sign out Failed",
                description: error.message || "Something went wrong",
            });
        }

        return { error };
    }, [toast]);

    const updateUser = useCallback(async (data) => {
        const { error } = await supabase.auth.updateUser({
            data: data
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.message,
            });
        } else {
            toast({
                title: "Profile Updated",
                description: "Your profile information has been updated successfully.",
            });
            // Refresh session to get updated data
            const { data: { session } } = await supabase.auth.getSession();
            handleSession(session);
        }
        return { error };
    }, [toast, handleSession]);

    const updatePassword = useCallback(async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Password Update Failed",
                description: error.message,
            });
        } else {
            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
        }
        return { error };
    }, [toast]);

    const value = useMemo(() => ({
        user,
        session,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
        updateUser,
        updatePassword,
    }), [user, session, loading, isAdmin, signUp, signIn, signOut, updateUser, updatePassword]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};