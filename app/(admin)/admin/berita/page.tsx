"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Berita {
  id: string;
  judul: string;
  kategori: string;
  penulis: string;
  isi: string;
  is_unggulan: boolean;
  thumbnail: string;
  created_at: string;
}

export default function AdminBeritaList() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("berita")
        .select(
          "id, judul, penulis, kategori, isi, thumbnail, is_unggulan, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setBerita(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Yakin ingin menghapus berita ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("berita").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus berita!");
    } else {
      toast.success("Berita berhasil dihapus!");
      setBerita((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <section className="p-4 md:p-8 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Manajemen Berita</h1>
        <Link href="/admin/berita/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Tambah Berita
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border ">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : berita.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              Belum ada berita.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Isi Berita</TableHead>

                  <TableHead className="hidden md:table-cell">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {berita.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell className="font-medium">
                      {item.penulis}
                    </TableCell>
                    <TableCell className="font-medium">{item.isi}</TableCell>

                    <TableCell className="hidden md:table-cell">
                      {item.created_at.slice(0, 10)}
                    </TableCell>
                    <TableCell className="flex justify-end gap-3">
                      <Link
                        href={`/admin/berita/edit/${item.id}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" /> <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> <span>Hapus</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
