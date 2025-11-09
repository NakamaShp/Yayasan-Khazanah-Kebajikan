// lib/supabase/server.ts
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Membuat Supabase client menggunakan req dan res dari context Next.js Pages Router (API Route / getServerSideProps)
 * Harus dipanggil dengan argumen request dan response HTTP.
 */
export function createSupabaseServerClient(req: NextApiRequest, res: NextApiResponse) {
  return createPagesServerClient({ req, res });
}
