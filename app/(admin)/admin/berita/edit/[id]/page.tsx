"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function EditBeritaPage() {
  const { id } = useParams();
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState("Umum");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ Ambil data berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      if (data) {
        setJudul(data.judul);
        setSlug(data.slug);
        setIsi(data.isi);
        setKategori(data.kategori);
        setPreview(data.thumbnail);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Upload gambar ke storage
  const handleUploadImage = async () => {
    if (!thumbnail) return preview; // kalau tidak ganti gambar

    const fileExt = thumbnail.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `berita/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("berita-images")
      .upload(filePath, thumbnail);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Gagal mengupload gambar!");
      return preview;
    }

    const { data: urlData } = supabase.storage
      .from("berita-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // ✅ Update data ke Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await handleUploadImage();

    const { error } = await supabase
      .from("berita")
      .update({
        judul,
        slug,
        isi,
        thumbnail: imageUrl,
        kategori,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      console.error("Update error:", error);
      toast.error("Gagal memperbarui berita!");
    } else {
      toast.success("Berita berhasil diperbarui!");
      router.push("/admin/berita");
    }
  };

  return (
    <section className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Berita</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Judul */}
        <div>
          <label className="block text-sm font-semibold mb-1">Judul</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold mb-1">Slug</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        {/* Isi */}
        <div>
          <label className="block text-sm font-semibold mb-1">Isi Berita</label>
          <textarea
            className="w-full border p-2 rounded h-40"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-semibold mb-1">Kategori</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          />
        </div>

        {/* Thumbnail */}
        {preview && (
          <div>
            <label className="block text-sm font-semibold mb-1">Thumbnail Sekarang</label>
            <Image
              src={preview}
              alt="Thumbnail"
              width={160}
              height={160}
              className="rounded object-cover"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </section>
  );
}
