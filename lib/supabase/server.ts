// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// 1. Jadikan fungsi ini 'async'
export const createSupabaseServerClient = async () => {
  // 2. Gunakan 'await' untuk "membuka" Promise cookies
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // 3. 'cookieStore' sekarang adalah objek, bukan Promise
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Abaikan error (untuk ESLint, Anda bisa hapus 'error' jika mau)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Abaikan error
          }
        },
      },
    }
  );
};