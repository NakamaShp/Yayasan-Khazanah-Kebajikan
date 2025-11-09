"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
// UBAH IMPORT INI:
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
// HAPUS IMPORT LAMA: import { supabase } from "@/lib/supabase";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ArrowUpDown, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { toast, Toaster } from "sonner";
import Image from "next/image";

// Interface Berita
interface Berita {
  id: string;
  judul: string;
  slug: string;
  excerpt?: string;
  isi?: string;
  thumbnail?: string;
  kategori?: string;
  is_unggulan?: boolean;
  penulis?: string;
  tanggal?: string;
  created_at?: string;
}

// Tipe untuk sorting
type SortDescriptor = {
  column: "judul" | "created_at";
  direction: "asc" | "desc";
};

export default function TableBerita() {
  // BUAT INSTANCE SUPABASE DI SINI
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [beritas, setBeritas] = useState<Berita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [q, setQ] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortDescriptor>({
    column: "created_at",
    direction: "desc",
  });

  // --- 1. Debouncing ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(q);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [q]);

  // --- 2. Fetching Data ---
  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      // 'supabase' sekarang merujuk ke instance dari useMemo
      let query = supabase.from("berita").select("*");

      if (searchQuery) {
        query = query.or(
          `judul.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`
        );
      }
      query = query.order(sort.column, {
        ascending: sort.direction === "asc",
      });

      const { data, error } = await query;

      if (error) {
        console.error("Fetch admin berita error:", error);
        setBeritas([]);
      } else {
        setBeritas(data ?? []);
      }
      setLoading(false);
    };

    fetchBerita();
    // Tambahkan 'supabase' sebagai dependensi
  }, [searchQuery, sort, supabase]);

  // --- 3. Handlers ---
  const handleSort = (columnName: "judul" | "created_at") => {
    setSort((prevSort) => {
      // Jika kolom sama, balik arahnya
      if (prevSort.column === columnName) {
        return {
          column: columnName,
          direction: prevSort.direction === "asc" ? "desc" : "asc",
        };
      }
      // Jika kolom baru, set default ke 'desc'
      return {
        column: columnName,
        direction: "desc",
      };
    });
  };

  const handleDelete = async (id: string, judul: string) => {
    // 'supabase' sekarang merujuk ke instance dari useMemo
    const { error } = await supabase.from("berita").delete().match({ id });

    if (error) {
      console.error("Delete error:", error);
      toast.error(`Gagal menghapus "${judul}".`);
    } else {
      toast.success(`Berita "${judul}" berhasil dihapus.`);
      // Optimistic UI: Hapus dari state lokal
      setBeritas((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // --- 4. Render Komponen ---
  return (
    <main id="tableberita" className="py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Manajemen Berita
          </h1>
          <p className="text-muted-foreground">
            Kelola semua artikel berita yayasan.
          </p>
        </header>

        {/* Kontrol: Pencarian */}
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Cari judul atau ringkasan..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          {/* PERBAIKAN: Arahkan ke URL path yang benar */}
          <Link href="/dashboard/berita/create">
            <Button>Buat Berita Baru</Button>
          </Link>
        </div>

        {/* Tabel Data */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("judul")}>
                    Judul
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("created_at")}
                  >
                    Terakhir Di-upload
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : beritas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada berita ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                beritas.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.judul}</TableCell>
                    <TableCell>
                      {/* PERBAIKAN ERROR: 
                        Cek jika thumbnail adalah string DAN dimulai dengan 'http'.
                        Ini akan mencegah error jika nilainya null, undefined, atau "{}"
                      */}
                      {typeof it.thumbnail === "string" &&
                      it.thumbnail.startsWith("http") ? (
                        <Image
                          src={it.thumbnail}
                          alt={it.judul}
                          width={80} // Tentukan ukuran
                          height={50}
                          className="rounded-md border object-cover"
                          onError={(e) => {
                            // Sembunyikan gambar jika URL-nya error (mis: 404)
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          No Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{it.kategori ?? "-"}</TableCell>
                    <TableCell>{it.penulis ?? "-"}</TableCell>
                    <TableCell>
                      {it.created_at
                        ? new Date(it.created_at).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          {/* 1. View (ke halaman public) */}
                          <Link href={`/berita/${it.slug}`} target="_blank">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat (Public)
                            </DropdownMenuItem>
                          </Link>
                          {/* 2. Edit (ke halaman admin edit) */}
                          {/* PERBAIKAN: Arahkan ke URL path yang benar */}
                          <Link href={`/dashboard/berita/edit/${it.id}`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          {/* 3. Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Apakah Anda benar-benar yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Ini akan
                                  menghapus berita secara permanen:
                                  <br />
                                  <strong className="mt-2 block">
                                    {it.judul}
                                  </strong>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDelete(it.id, it.judul)}
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
