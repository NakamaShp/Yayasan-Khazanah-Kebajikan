"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; 
export function GallerySection() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const fetchBerita = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("berita")
        .select("thumbnail")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching Images:", error);
        setImages([]);
      } else if (mounted && data) {
        // --- INI PERBAIKANNYA ---
        // 1. Ambil semua thumbnail
        const allThumbnails = data.map((item) => item.thumbnail);

        // 2. Filter hanya yang valid (bukan null, undefined, "", dan adalah string URL)
        const validImages = allThumbnails.filter(
          (thumbnail): thumbnail is string => // Type guard
            thumbnail &&
            typeof thumbnail === "string" &&
            (thumbnail.startsWith("http") || thumbnail.startsWith("/"))
        );
        
        setImages(validImages);
        // --- AKHIR PERBAIKAN ---
      }
      setLoading(false);
    };
    fetchBerita();

    return () => {
      mounted = false;
    };
  }, [supabase]); // Tambahkan supabase ke dependency array

  return (
    <section id="galeri" className="py-20 px-4 md:px-20">
      <div className="container mx-auto text-center">
        <div className="max-w-xl sm:max-w-6xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Galeri <span className="text-primary">Kegiatan Kami</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami berkomitmen menghadirkan pengalaman belajar terbaik untuk
            membentuk santri yang berilmu dan berakhlak mulia.
          </p>
        </div>

        <div className="max-w-full lg:max-w-full grid grid-cols-2 sm:grid-cols-3 gap-8">
          {/* Tampilkan Skeleton saat loading */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-64 rounded-2xl" />
            ))}

          {/* Tampilkan gambar setelah loading selesai */}
          {!loading &&
            images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-2xl shadow-lg bg-white cursor-pointer"
              >
                <Image
                  src={src} // src sekarang dijamin string yang valid
                  alt={`Galeri ${i + 1}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                  // (Opsional) Tambahkan fallback jika gambar 404
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </motion.div>
            ))}
          
          {/* Tampilkan pesan jika tidak ada gambar */}
          {!loading && images.length === 0 && (
            <p className="text-gray-600 col-span-full">
              Belum ada galeri untuk ditampilkan.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}