"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"; // Tambah import useRouter untuk refresh

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
// TAMBAH IMPORT DIALOG DARI SHADCN/UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// TAMBAH IMPORT UNTUK FORM EDIT DI DALAM MODAL
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";

import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
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

// ====================================================================================================
// KOMPONEN UTAMA: TableBerita
// ====================================================================================================
export default function TableBerita() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter(); // Gunakan useRouter untuk refresh data

  const [beritas, setBeritas] = useState<Berita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [q, setQ] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortDescriptor>({
    column: "created_at",
    direction: "desc",
  });

  // --- STATE UNTUK MODAL UPDATE ---
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

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
  const fetchBerita = async () => {
    setLoading(true);
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBerita();
    // Pastikan semua dependencies yang digunakan di `fetchBerita` masuk ke array ini.
    // Karena kita menghapus useCallback, kita harus menentukan dependencies di sini.
  }, [searchQuery, sort, supabase]); // Gunakan fetchBerita sebagai dependensi

  // --- 3. Handlers ---
  const handleSort = (columnName: "judul" | "created_at") => {
    setSort((prevSort) => {
      if (prevSort.column === columnName) {
        return {
          column: columnName,
          direction: prevSort.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        column: columnName,
        direction: "desc",
      };
    });
  };

  const handleDelete = async (id: string, judul: string) => {
    const { error } = await supabase.from("berita").delete().match({ id });

    if (error) {
      console.error("Delete error:", error);
      toast.error(`Gagal menghapus "${judul}". Cek izin RLS/GRANT DELETE.`);
    } else {
      toast.success(`Berita "${judul}" berhasil dihapus.`);
      // Optimistic UI: Hapus dari state lokal
      setBeritas((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Handler untuk membuka modal dan mengisi data
  const openUpdateModal = (berita: Berita) => {
    setSelectedBerita(berita);
    setIsUpdateModalOpen(true);
  };

  // Handler setelah update berhasil dari modal
  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false); // Tutup modal
    fetchBerita(); // Ambil data terbaru
    toast.success("Berita berhasil diperbarui!");
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
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
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
                      {typeof it.thumbnail === "string" &&
                      it.thumbnail.startsWith("http") ? (
                        <Image
                          src={it.thumbnail}
                          alt={it.judul}
                          width={80}
                          height={50}
                          className="rounded-md border object-cover"
                          onError={(e) => {
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
                          {/* 1. View */}
                          <Link href={`/berita/${it.slug}`} target="_blank">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat (Public)
                            </DropdownMenuItem>
                          </Link>
                          {/* 2. Edit (UBAH MENJADI TOMBOL PEMBUKA MODAL) */}
                          <DropdownMenuItem
                            onSelect={() => openUpdateModal(it)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
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
      {/* --- MODAL UPDATE BERITA --- */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Berita</DialogTitle>
            <DialogDescription>
              Perbarui informasi untuk berita ID: {selectedBerita?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBerita && (
            <UpdateBeritaForm
              initialData={selectedBerita}
              onUpdateSuccess={handleUpdateSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

// ====================================================================================================
// KOMPONEN BARU: UpdateBeritaForm (Dipindahkan dari EditBeritaPage)
// ====================================================================================================
interface UpdateFormProps {
  initialData: Berita;
  onUpdateSuccess: () => void;
}

const UpdateBeritaForm: React.FC<UpdateFormProps> = ({
  initialData,
  onUpdateSuccess,
}) => {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // State untuk form
  const [judul, setJudul] = useState(initialData.judul ?? "");
  const [isi, setIsi] = useState(initialData.isi ?? "");
  const [kategori, setKategori] = useState(initialData.kategori ?? "");
  const [penulis, setPenulis] = useState(initialData.penulis ?? "");
  const [isUnggulan, setIsUnggulan] = useState(
    initialData.is_unggulan ?? false
  );
  const [tanggal, setTanggal] = useState<Date | undefined>(
    initialData.tanggal ? new Date(initialData.tanggal) : undefined
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.thumbnail ?? null
  );
  const [oldThumbnail, setOldThumbnail] = useState<string | null>(
    initialData.thumbnail ?? null
  );

  const [isSaving, setIsSaving] = useState(false);

  // Perbarui state saat initialData berubah (saat modal dibuka untuk berita yang berbeda)
  useEffect(() => {
    setJudul(initialData.judul ?? "");
    setIsi(initialData.isi ?? "");
    setKategori(initialData.kategori ?? "");
    setPenulis(initialData.penulis ?? "");
    setIsUnggulan(initialData.is_unggulan ?? false);
    setTanggal(initialData.tanggal ? new Date(initialData.tanggal) : undefined);
    setOldThumbnail(initialData.thumbnail ?? null);
    setPreviewUrl(initialData.thumbnail ?? null);
    setThumbnail(null); // Reset file upload
  }, [initialData]);

  // Handler file gambar baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setThumbnail(null);
    setPreviewUrl(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handler submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !judul ||
      !isi ||
      !kategori ||
      !penulis ||
      !(thumbnail || oldThumbnail)
    ) {
      toast.error("Semua field dan gambar wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      let urlFinal = oldThumbnail;

      // 1. UPLOAD GAMBAR BARU JIKA ADA
      if (thumbnail) {
        const slug = generateSlug(judul);
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const bucketName = "berita-images"; // Tentukan nama bucket
        const filePath = `berita/${fileName}`; // Path yang benar di dalam bucket

        // --- Pengecekan dan Penghapusan Thumbnail Lama (Solusi Error 2445) ---
        // Cek apakah URL lama benar-benar URL public Supabase storage
        if (oldThumbnail && oldThumbnail.includes(`/${bucketName}/`)) {
          // Ekstrak path file yang perlu dihapus (semua setelah nama bucket)
          // Contoh: public/berita-images/berita/file-lama.jpg
          const pathParts = oldThumbnail.split(`/${bucketName}/`);
          if (pathParts.length > 1) {
            // Path yang didapatkan adalah 'berita/file-lama.jpg'
            const oldFilePath = pathParts[1];

            const { error: removeError } = await supabase.storage
              .from(bucketName)
              // Remove membutuhkan array path relatif dari root bucket
              .remove([oldFilePath]);

            if (removeError) {
              // Biasanya tidak perlu melempar error di sini, cukup log saja
              console.warn(
                "Gagal menghapus file lama di storage:",
                removeError
              );
            }
          }
        }
        // --- Akhir Pengecekan ---

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, thumbnail, { upsert: true });
        if (uploadError) throw uploadError;

        // Dapatkan URL Public baru (Supabase.co/storage/v1/object/public/...)
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        if (!urlData) throw new Error("Gagal mendapatkan public URL gambar.");
        urlFinal = urlData.publicUrl;
      }

      // 2. UPDATE DATA DI TABLE
      const updateData = {
        judul,
        slug: generateSlug(judul),
        isi,
        thumbnail: urlFinal,
        kategori,
        penulis,
        tanggal: tanggal ? tanggal.toISOString() : null,
        is_unggulan: isUnggulan,
      };

      // id diambil dari initialData.id
      const { error: updateError } = await supabase
        .from("berita")
        .update(updateData)
        .eq("id", initialData.id); // PENTING: Menggunakan ID yang benar

      if (updateError) {
        // Cek error RLS/permission
        console.error("Update Error:", updateError);
        throw new Error(
          `Gagal Update. Cek Izin RLS/GRANT. Error: ${updateError.message}`
        );
      }

      onUpdateSuccess(); // Panggil handler sukses untuk menutup modal & refresh data
    } catch (err: unknown) {
      let msg = "Terjadi kesalahan tidak diketahui";
      if (err instanceof Error) msg = err.message;
      toast.error(`Gagal menyimpan: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
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
              accept="image/*"
            />
            {(previewUrl || oldThumbnail) && (
              <div className="mt-4 space-y-2">
                <Label>Preview Gambar</Label>
                {/* Gunakan key untuk memastikan Image me-render ulang saat URL berubah */}
                <Image
                  key={previewUrl || oldThumbnail}
                  src={previewUrl || oldThumbnail!}
                  alt="Preview thumbnail"
                  className="w-full max-w-xs rounded-md border object-cover"
                  width={150}
                  height={100}
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
                  type="button"
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
            <Label htmlFor="is_unggulan">Jadikan Berita Unggulan?</Label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onUpdateSuccess()}
          disabled={isSaving}
        >
          Tutup
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
};
