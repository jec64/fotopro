import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdyufnqgavbkprktkxqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeXVmbnFnYXZia3Bya3RreHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTkwMTAsImV4cCI6MjA4MTM3NTAxMH0.H5NCVyZtDOK1PaaAcNrB3iSNR5sUCC_OrnKE4O_Tb9s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);