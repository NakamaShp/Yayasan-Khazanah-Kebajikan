"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ gunakan sonner, bukan useToast()

export default function CreateBeritaPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ Generate slug otomatis dari judul
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  // ✅ Upload gambar ke Supabase Storage
  const handleUploadImage = async () => {
    if (!thumbnail) return null;

    const fileExt = thumbnail.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `berita/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("berita-images")
      .upload(filePath, thumbnail);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Gagal mengunggah gambar! Periksa koneksi atau format file Anda.");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("berita-images")
      .getPublicUrl(filePath);

    return urlData?.publicUrl ?? null;
  };

  // ✅ Submit form berita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await handleUploadImage();

    const { error } = await supabase.from("berita").insert([
      {
        judul: title,
        slug,
        isi: content,
        thumbnail: imageUrl,
        kategori: "Umum",
        is_unggulan: false,
        penulis: "Admin",
        tanggal: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Insert error:", error);
      toast.error("Gagal menambah berita! Periksa kembali data yang Anda masukkan.");
    } else {
      toast.success("Berita berhasil ditambahkan 🎉");
      setTimeout(() => router.push("/admin/berita"), 1500);
    }
  };

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tambah Berita Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Judul */}
        <div>
          <label className="block text-sm font-semibold mb-1">Judul Berita</label>
          <input
            type="text"
            placeholder="Misal: Santri Baru Mulai Kegiatan Tahsin"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
            required
          />
        </div>

        {/* Slug Otomatis */}
        <div>
          <label className="block text-sm font-semibold mb-1">Slug Otomatis</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={slug}
            readOnly
          />
        </div>

        {/* Isi Berita */}
        <div>
          <label className="block text-sm font-semibold mb-1">Isi Berita</label>
          <textarea
            placeholder="Tulis isi berita di sini..."
            className="w-full border p-2 rounded h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Upload Thumbnail */}
        <div>
          <label className="block text-sm font-semibold mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Simpan Berita"}
        </button>
      </form>
    </section>
  );
}
