"use client";

import React, { useMemo, useState } from "react";
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
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function BuatBeritaPage() {
  const router = useRouter();

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // --- State untuk Form Inputs ---
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [penulis, setPenulis] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<Date | undefined>(new Date());
  const [isUnggulan, setIsUnggulan] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Bersihkan file & preview lama (jika ada)
    setThumbnail(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Penting: Hapus URL lama dari memori
      setPreviewUrl(null);
    }

    // 2. Cek jika user memilih file baru
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 3. Simpan OBJEK FILE-nya
      setThumbnail(file);

      // 4. Buat URL preview sementara dan simpan
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // State untuk UI
  const [isLoading, setIsLoading] = useState(false);

  // --- Helper: Fungsi untuk membuat slug ---
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter non-alfanumerik
      .replace(/[\s_-]+/g, "-") // Ganti spasi/underscore dgn strip
      .replace(/^-+|-+$/g, ""); // Hapus strip di awal/akhir
  };

  // --- Handler: Fungsi saat form di-submit ---
  // --- Handler: Fungsi saat form di-submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi yang lebih baik
    if (!judul || !thumbnail || !isi || !kategori || !penulis) {
      toast.error("Semua field (termasuk gambar) wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Buat slug dan file path yang unik
      const slug = generateSlug(judul);
      // Tambahkan ekstensi file asli untuk keamanan & tipe MIME
      const fileExt = thumbnail.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      // Path di dalam bucket Supabase
      const filePath = `${fileName}`;

      // 2. UPLOAD FILE KE STORAGE
      //    Pastikan "berita-images" adalah nama bucket publik kamu
      const { error: uploadError } = await supabase.storage
        .from("berita-images") // Nama bucket kamu
        .upload(filePath, thumbnail); // Upload file mentahnya

      if (uploadError) {
        // Jika upload gagal, lempar error
        throw new Error(`Gagal upload thumbnail: ${uploadError.message}`);
      }

      // 3. DAPATKAN PUBLIC URL DARI FILE YANG BARU DIUPLOAD
      const { data: urlData } = supabase.storage
        .from("berita-images") // Nama bucket yang sama
        .getPublicUrl(filePath); // Dapatkan URL dari path file

      if (!urlData) {
        throw new Error("Gagal mendapatkan public URL gambar.");
      }

      const publicUrl = urlData.publicUrl;

      // 4. Siapkan data untuk dikirim ke tabel 'berita'
      //    (Gunakan URL, bukan objek file)
      const dataToInsert = {
        judul: judul,
        slug: slug,
        isi: isi,
        thumbnail: publicUrl, // <-- INI SOLUSINYA: Simpan URL-nya
        kategori: kategori,
        penulis: penulis,
        created_at: tanggal ? tanggal.toISOString() : null,
        is_unggulan: isUnggulan,
      };

      // 5. Kirim data (termasuk URL) ke tabel 'berita'
      const { error: insertError } = await supabase
        .from("berita")
        .insert(dataToInsert);

      if (insertError) {
        throw insertError; // Lempar error untuk ditangkap di 'catch'
      }

      // 6. Jika sukses
      toast.success("Berita berhasil ditambahkan!");
      router.push("/dashboard/berita");
      router.refresh();
    } catch (error: unknown) {
      // 7. Tangani error yang dilempar
      console.error("Error Membuat Berita", error);

      let errorMessage = "Terjadi kesalahan yang tidak diketahui";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(`Gagal menyimpan: ${errorMessage}`);
    } finally {
      // 8. Selalu matikan loading
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full py-12 px-2 md:px-6 lg:px-10">
      <div className="max-w-8xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Buat Berita Baru</h1>
          <p className="text-muted-foreground mb-6">
            Gunakan formulir di bawah ini untuk menambahkan berita baru.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Buat Berita Baru</CardTitle>
            <CardDescription>
              Isi formulir di bawah ini untuk menambahkan artikel berita baru.
            </CardDescription>
          </CardHeader>

          {/* Tag <form> akan membungkus CardContent dan CardFooter */}
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
                  <Label htmlFor="thumbnail">Gambar</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept="image/*"
                  />

                  {previewUrl && (
                    <div className="mt-4 space-y-2">
                      <Label>Preview Gambar Baru</Label>
                      {/* Gunakan <img> biasa, BUKAN <Image> dari Next.js, 
      karena ini adalah URL sementara (blob)
    */}
                      <Image
                        src={previewUrl}
                        alt="Preview thumbnail"
                        className="w-full max-w-xs rounded-md border object-cover"
                        width={100}
                        height={50}
                      />
                    </div>
                  )}
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
              <div className="space-y-2">
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
                    <PopoverContent className="w-auto ">
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
                  <Label htmlFor="is_unggulan">Jadikan Berita Unggulan?</Label>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Link href="/dashboard/berita" passHref>
                {" "}
                {/* Diubah juga untuk konsistensi */}
                <Button type="button" variant="outline" disabled={isLoading}>
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Berita"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
