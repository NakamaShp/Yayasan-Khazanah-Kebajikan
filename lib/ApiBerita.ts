import { supabase } from "./supabase";

export type Berita = {
  id: string;
  judul: string;
  slug: string;
  isi: string;
  kategori?: string;
  gambar?: string;
  is_unggulan?: boolean;
  created_at: string;
};

// 🔹 Ambil semua berita
export async function getAllBerita() {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Berita[];
}

// 🔹 Ambil berita unggulan
export async function getBeritaUnggulan() {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .eq("is_unggulan", true)
    .limit(3);

  if (error) throw error;
  return data as Berita[];
}

// 🔹 Ambil berita berdasarkan slug
export async function getBeritaBySlug(slug: string) {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data as Berita;
}

// 🔹 Tambah berita
export async function tambahBerita(berita: Omit<Berita, "id" | "created_at">) {
  const { error } = await supabase.from("berita").insert([berita]);
  if (error) throw error;
}

// 🔹 Update berita
export async function updateBerita(id: string, berita: Partial<Berita>) {
  const { error } = await supabase.from("berita").update(berita).eq("id", id);
  if (error) throw error;
}

// 🔹 Hapus berita
export async function hapusBerita(id: string) {
  const { error } = await supabase.from("berita").delete().eq("id", id);
  if (error) throw error;
}
