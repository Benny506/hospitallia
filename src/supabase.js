import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tiwuhxljzjknkvplrxrg.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpd3VoeGxqemprbmt2cGxyeHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTQ3MTksImV4cCI6MjA4Mzk3MDcxOX0.HrNFt9TEvtwQZs1kVtTX4iyfV9rFKS2s-EtRJgfnSEE'
// Note: In a real app, use import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
