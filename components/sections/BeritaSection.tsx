// components/BeritaPreview.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Definisikan tipe Berita (ambil dari file BeritaPage Anda)
interface Berita {
  id: string;
  judul: string;
  slug: string;
  thumbnail?: string;
  penulis?: string;
  tanggal?: string; // Pastikan ini adalah nama kolom yang benar
}

export default function BeritaPreview() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [latestBerita, setLatestBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestBerita = async () => {
      setLoading(true);
      
      // Query HANYA 3 berita terbaru
      const { data, error } = await supabase
        .from("berita")
        .select("id, judul, slug, thumbnail, penulis, tanggal") // Ambil hanya yang perlu
        .order("created_at", { ascending: false })
        .limit(3); // <-- INI KUNCINYA

      if (error) {
        console.error("Fetch latest berita error:", error);
        setLatestBerita([]);
      } else {
        setLatestBerita(data ?? []);
      }
      setLoading(false);
    };

    fetchLatestBerita();
  }, [supabase]); // Jangan lupa tambahkan supabase di dependency array

  // Helper untuk format tanggal (sama seperti di kode Anda)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Invalid date:", e);
      return "";
    }
  };

  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section dengan Tombol */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Berita Terbaru</h2>
            <p className="text-muted-foreground mt-1">
              Ikuti kabar dan kegiatan terbaru dari kami.
            </p>
          </div>
          <Link href="/berita" passHref>
            <Button variant="outline" className="shrink-0">
              Lihat Semua Berita
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center text-muted-foreground">
            Memuat berita...
          </div>
        )}

        {/* Empty State */}
        {!loading && latestBerita.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Belum ada berita untuk ditampilkan.
          </div>
        )}

        {/* Grid Berita (Limit 3) */}
        {!loading && latestBerita.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestBerita.map((it) => (
              <Card
                key={it.id}
                className="group hover:shadow-lg transition h-full flex flex-col"
              >
                <div className="overflow-hidden rounded-t-md">
                  {it.thumbnail ? (
                    <Image
                      src={it.thumbnail}
                      alt={it.judul}
                      width={400} // Beri nilai lebih besar untuk grid 3 kolom
                      height={225} // Rasio 16:9
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <CardContent className="flex-1 pt-4">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                    {it.judul}
                  </h3>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {/* Menggunakan helper format tanggal */}
                    {it.penulis ? `${it.penulis} • ` : ""}
                    {formatDate(it.tanggal)} 
                  </div>
                  <Link href={`/berita/${it.slug}`}>
                    <Button variant="ghost" size="sm">
                      Baca →
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}