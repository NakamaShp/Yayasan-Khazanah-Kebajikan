"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface Berita {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  created_at: string;
}

export default function BeritaSection() {
  const [berita, setBerita] = useState<Berita[]>([]);

  useEffect(() => {
    const fetchBerita = async () => {
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setBerita(data);
    };
    fetchBerita();
  }, []);

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Berita Terbaru
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {berita.map((item) => (
          <Link
            href={`/berita/${item.slug}`}
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
          >
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
              width={400}
              height={300}
            />
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.excerpt}</p>
            <span className="text-sm text-blue-600 mt-3 block">
              Lihat Selengkapnya →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
