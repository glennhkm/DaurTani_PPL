// Get Supabase URL from environment variable or use default for development
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dneeolvtrwklfmcseavo.supabase.co';

// Extract hostname from Supabase URL for Next.js image configuration
export const SUPABASE_HOSTNAME = SUPABASE_URL.replace('https://', '').split('/')[0]; 