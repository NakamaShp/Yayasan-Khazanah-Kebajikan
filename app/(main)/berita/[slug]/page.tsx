// app/berita/[slug]/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server"; // <-- Tetap dipakai untuk Komponen
import { createClient } from "@supabase/supabase-js"; // <-- BARU: Impor klien dasar
import Image from "next/image";
import { notFound } from "next/navigation";
import BeritaSidebar from "@/components/pages/Berita/BeritaSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

// Helper untuk format tanggal
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// =========================================================================
// KOMPONEN UTAMA (TIDAK BERUBAH)
// Ini dijalankan saat REQUEST TIME, jadi AMAN menggunakan createSupabaseServerClient
// =========================================================================
// app/(main)/berita/[slug]/page.tsx

// ... (semua import Anda)

interface Props {
  params: { slug: string };
}

// ... (fungsi formatDate Anda)

export default async function DetailBerita({ params }: Props) {
  
  // ===================================================================
  // PERBAIKAN: "Amankan" nilai slug SEBELUM await pertama
  // ===================================================================
  const slug = params.slug;
  // ===================================================================

  // Sekarang baru panggil await
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("berita")
    .select("*")
    .eq("slug", slug) // <-- GUNAKAN VARIABEL 'slug'
    .single();

  if (!data) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-8">
        <Link href="/berita" passHref>
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Kembali ke Semua Berita
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        {/* --- KOLOM KONTEN UTAMA --- */}
        <article className="lg:col-span-2">
          {/* ... (sisa kode Image, h1, div, dll.) ... */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.judul}</h1>
          {/* ... */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: data.isi }}
          />
        </article>

        {/* --- KOLOM SIDEBAR --- */}
        <div className="lg:col-span-1 mt-12 lg:mt-0">
          {/* GUNAKAN 'slug' DI SINI JUGA */}
          <BeritaSidebar currentSlug={slug} /> 
        </div>
      </div>
    </main>
  );
}

// ... (fungsi generateStaticParams Anda) ...