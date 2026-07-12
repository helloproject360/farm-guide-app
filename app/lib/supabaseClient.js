import { createClient } from "@supabase/supabase-js";

// Reads from Vercel environment variables
// (set in Vercel -> Settings -> Environment Variables):
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
// If they are not set yet, `supabase` is null and the app shows a
// "not connected" message instead of crashing.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
