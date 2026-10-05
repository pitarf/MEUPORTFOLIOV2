import { createClient } from '@supabase/supabase-js';

const getEnvVal = (key, fallback) => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
            return import.meta.env[key];
        }
    } catch {}
    try {
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
    } catch {}
    return fallback;
};

const supabaseUrl = getEnvVal('VITE_SUPABASE_URL', 'https://placeholder-url.supabase.co');
const supabaseAnonKey = getEnvVal('VITE_SUPABASE_ANON_KEY', 'placeholder-key');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
