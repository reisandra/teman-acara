import { createClient } from '@supabase/supabase-js'

// URL dan Anon Key dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return user
}