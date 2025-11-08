"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";

// Interface Berita (sama seperti sebelumnya)
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
  tanggal?: string; // Tanggal dari DB bisa string ISO
  created_at?: string;
}

// Props untuk halaman ini, akan menerima params dari Next.js
export default function EditBeritaPage({ params }: { params: { id: string } }) {

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();
  const { id } = params; // Ambil ID berita dari URL

  // --- State untuk Form Inputs ---
  const [judul, setJudul] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [penulis, setPenulis] = useState("");
  const [tanggal, setTanggal] = useState<Date | undefined>(undefined); // Default undefined
  const [isUnggulan, setIsUnggulan] = useState(false);
  const [originalSlug, setOriginalSlug] = useState(""); // Simpan slug asli

  // State untuk UI
  const [isLoading, setIsLoading] = useState(true); // Loading awal untuk fetch data
  const [isSaving, setIsSaving] = useState(false); // Loading saat menyimpan perubahan
  const [error, setError] = useState<string | null>(null); // Untuk menampilkan pesan error

  // --- 1. Fetch Data Berita saat komponen pertama kali di-mount ---
  useEffect(() => {
    const fetchBerita = async () => {
      setIsLoading(true);
      setError(null); // Reset error
      
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .eq("id", id) // Filter berdasarkan ID dari URL
        .single(); // Harusnya hanya ada 1 data

      if (error) {
        console.error("Error fetching berita for edit:", error);
        setError("Gagal memuat data berita. Mungkin berita tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      if (data) {
        // Isi form dengan data yang diambil
        setJudul(data.judul);
        setExcerpt(data.excerpt ?? "");
        setIsi(data.isi ?? "");
        setKategori(data.kategori ?? "");
        setPenulis(data.penulis ?? "");
        setTanggal(data.tanggal ? new Date(data.tanggal) : undefined);
        setIsUnggulan(data.is_unggulan ?? false);
        setOriginalSlug(data.slug); // Simpan slug asli untuk jaga-jaga
      }
      setIsLoading(false);
    };

    if (id) { // Pastikan ID ada sebelum fetch
      fetchBerita();
    }
  }, [id]); // Dependensi: jalankan ulang jika ID berubah

  // --- Helper: Fungsi untuk membuat slug (sama seperti sebelumnya) ---
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/[\s_-]+/g, "-") 
      .replace(/^-+|-+$/g, "");
  };

  // --- 2. Handler: Fungsi saat form di-submit untuk Update ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana
    if (!judul) {
      alert("Judul tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    setError(null); // Reset error saat menyimpan

    // Buat slug baru (jika judul berubah, slug juga bisa berubah)
    const newSlug = generateSlug(judul);

    // Siapkan data untuk di-update
    const dataToUpdate = {
      judul,
      slug: newSlug, // Gunakan slug baru
      excerpt,
      isi,
      kategori: kategori || null,
      penulis: penulis || null,
      tanggal: tanggal ? tanggal.toISOString() : null,
      is_unggulan: isUnggulan,
    };

    // Kirim ke Supabase untuk Update
    const { error } = await supabase
      .from("berita")
      .update(dataToUpdate)
      .eq("id", id); // PENTING: Update hanya berita dengan ID ini

    setIsSaving(false);

    if (error) {
      console.error("Error updating berita:", error);
      setError(`Gagal menyimpan perubahan: ${error.message}`);
      alert(`Gagal menyimpan perubahan: ${error.message}`);
    } else {
      alert("Berita berhasil diperbarui!");
      // Redirect kembali ke halaman tabel admin
      router.push("/admin/berita");
      router.refresh(); // Opsional: refresh router
    }
  };

  if (isLoading) {
    return (
      <main className="py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              Memuat data berita...
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="py-12 text-red-600">
              {error}
              <Button onClick={() => router.back()} className="mt-4">
                Kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Berita</CardTitle>
            <CardDescription>
              Perbarui informasi artikel berita ini.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Berita</Label>
                  <Input
                    id="judul"
                    placeholder="Judul artikel..."
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Ringkasan (Excerpt)</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Ringkasan singkat artikel..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isi">Isi Berita</Label>
                  <Textarea
                    id="isi"
                    placeholder="Tulis isi lengkap artikel di sini..."
                    value={isi}
                    onChange={(e) => setIsi(e.target.value)}
                    className="h-48"
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Input
                    id="kategori"
                    placeholder="Mis: Kegiatan, Donasi"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="penulis">Penulis</Label>
                  <Input
                    id="penulis"
                    placeholder="Nama penulis..."
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal Publikasi</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tanggal ? (
                          format(tanggal, "PPP", { locale: indonesianLocale })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tanggal}
                        onSelect={setTanggal}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is_unggulan"
                    checked={isUnggulan}
                    onCheckedChange={setIsUnggulan}
                  />
                  <Label htmlFor="is_unggulan">
                    Jadikan Berita Unggulan?
                  </Label>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()} // Tombol kembali
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}