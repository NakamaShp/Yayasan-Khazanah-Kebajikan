"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Berita {
  id: string;
  judul: string;
  slug: string;

  isi?: string;
  thumbnail?: string;
  kategori?: string;
  is_unggulan?: boolean;
  penulis?: string;
  tanggal?: string;
  created_at?: string;
}

export default function BeritaPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [beritas, setBeritas] = useState<Berita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI states
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState<string>("Semua");
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  // Fetch berita
  useEffect(() => {
    let mounted = true;
    const fetchBerita = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch berita error:", error);
        setBeritas([]);
      } else if (mounted) {
        setBeritas(data ?? []);
      }
      setLoading(false);
    };

    fetchBerita();

    return () => {
      mounted = false;
    };
  }, []);

  // kategori list derived from data
  const kategoriList = useMemo(() => {
    const setKat = new Set<string>();
    beritas.forEach((b) => {
      if (b.kategori) setKat.add(b.kategori);
    });
    return ["Semua", ...Array.from(setKat)];
  }, [beritas]);

  // filtered results
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return beritas.filter((b) => {
      if (kategori !== "Semua" && b.kategori !== kategori) return false;
      if (!s) return true;
      return (
        (b.judul ?? "").toLowerCase().includes(s) ||

        (b.isi ?? "").toLowerCase().includes(s)
      );
    });
  }, [beritas, q, kategori]);

  // featured and latest lists
  const featured = useMemo(
    () => filtered.filter((b) => b.is_unggulan).slice(0, 3),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <main className="py-12 px-6 md:px-12 lg:px-20">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Berita</h1>
        <p className="text-muted-foreground">
          Berita unggulan & berita terbaru dari yayasan.
        </p>
      </header>

      {/* Controls */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex gap-3 w-full md:w-auto">
          <Input
            placeholder="Cari judul atau ringkasan..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="min-w-0"
          />
          <Select
            value={kategori}
            onValueChange={(val) => {
              setKategori(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter kategori" />
            </SelectTrigger>
            <SelectContent>
              {kategoriList.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Menampilkan</span>
          <Badge variant="outline">{filtered.length} hasil</Badge>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold mb-4">Berita Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((it) => (
              <Card key={it.id} className="h-full hover:shadow-lg transition">
                <CardHeader className="p-0">
                  {it.thumbnail && typeof it.thumbnail === 'string' && (it.thumbnail.startsWith('http') || it.thumbnail.startsWith('/')) ? (
                    <div className="h-44 w-full relative overflow-hidden rounded-t-md">
                      <Image
                        src={it.thumbnail}
                        alt={it.judul}
                        width={200}
                        height={100}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-slate-100 rounded-t-md flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <h3 className="text-lg font-bold line-clamp-2">
                      {it.judul}
                    </h3>
                   
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-muted-foreground">
                      {it.penulis ? `${it.penulis} • ` : ""}
                      {it.tanggal
                        ? new Date(it.tanggal).toLocaleDateString("id-ID")
                        : ""}
                    </div>
                    <Badge variant="secondary">Unggulan</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/berita/${it.slug}`} className="w-full">
                    <Button variant="ghost" className="w-full">
                      Baca Selengkapnya →
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Latest list (grid) */}
      <section className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Berita Terbaru</h2>

        {loading ? (
          <div className="py-12 text-center">Memuat berita...</div>
        ) : paginated.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Tidak ada berita.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((it) => (
              <Card
                key={it.id}
                className="group hover:shadow-lg transition h-full flex flex-col"
              >
                <div className="overflow-hidden rounded-t-md">
                  {it.thumbnail ? (
                    <Image
                      src={it.thumbnail}
                      alt={it.judul}
                      width={200}
                      height={100}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-44 w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <CardContent className="flex-1">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                      {it.judul}
                    </h3>
                    
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {it.penulis ? `${it.penulis} • ` : ""}
                    {it.tanggal
                      ? new Date(it.tanggal).toLocaleDateString("id-ID")
                      : ""}
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

        {/* Pagination */}
        <div className="max-w-7xl mx-auto mt-8 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="mr-2 w-4 h-4" /> Sebelumnya
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Berikutnya <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
