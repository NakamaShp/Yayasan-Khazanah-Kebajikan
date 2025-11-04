"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type FormData = {
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  kartu_keluarga?: File | null;
  ktp?: File | null;
  foto_depan_rumah?: File | null;
  foto_dapur?: File | null;
  foto_wc?: File | null;
  foto_4x3?: File | null;
  foto_4x4?: File | null;
};

export default function FormPendaftaran() {
  const [formData, setFormData] = useState<FormData>({
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    kartu_keluarga: null,
    ktp: null,
    foto_depan_rumah: null,
    foto_dapur: null,
    foto_wc: null,
    foto_4x3: null,
    foto_4x4: null,
  });

  const [preview, setPreview] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("pendaftaran");
    if (saved) setFormData(JSON.parse(saved));
  }, []);


  useEffect(() => {
    localStorage.setItem("pendaftaran", JSON.stringify(formData));
  }, [formData]);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      const url = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, [name]: url }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Upload file ke Supabase
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: _data, error } = await supabase.storage
      .from("berkas_pendaftaran")
      .upload(`${path}/${fileName}`, file);

    if (error) throw error;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/berkas_pendaftaran/${path}/${fileName}`;
  };

  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        alert("Silakan login terlebih dahulu");
        return;
      }

      const uploadPaths = [
        "kartu_keluarga",
        "ktp",
        "foto_depan_rumah",
        "foto_dapur",
        "foto_wc",
        "foto_4x3",
        "foto_4x4",
      ] as const;

      const uploadedFiles: Partial<
        Record<(typeof uploadPaths)[number], string>
      > = {};

      for (const key of uploadPaths) {
        const file = formData[key];
        if (file) {
          uploadedFiles[key] = await uploadFile(file, key);
        }
      }

      await supabase.from("pendaftaran_santri").insert([
        {
          user_id: user.id,
          ...formData,
          ...uploadedFiles,
        },
      ]);

      alert("Pendaftaran berhasil!");
      localStorage.removeItem("pendaftaran");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengupload data");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Helper: cek apakah file berupa gambar
  const isImage = (fileName: string): boolean => {
    const imageExt = ["jpg", "jpeg", "png", "gif", "bmp"];
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    return imageExt.includes(ext);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 space-y-10 border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Form Pendaftaran Santri
        </h2>
        <p className="text-center text-gray-500">
          Lengkapi data dan unggah berkas yang diminta dengan benar.
        </p>

        {/* 🧾 Data Diri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            ["nama_lengkap", "tempat_lahir", "tanggal_lahir", "alamat"] as const
          ).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                name={field}
                type={field === "tanggal_lahir" ? "date" : "text"}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-400 p-3 rounded-lg outline-none transition"
              />
            </div>
          ))}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kelamin
          </label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* 📎 Upload File */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "kartu_keluarga", label: "Kartu Keluarga" },
            { name: "ktp", label: "KTP" },
            { name: "foto_depan_rumah", label: "Foto Depan Rumah" },
            { name: "foto_dapur", label: "Foto Dapur Rumah" },
            { name: "foto_wc", label: "Foto WC Rumah" },
            { name: "foto_4x3", label: "Foto 4x3" },
            { name: "foto_4x4", label: "Foto 4x4" },
          ].map((fileField) => (
            <div key={fileField.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {fileField.label}{" "}
                <span className="text-gray-500 text-xs">
                  (Format: JPG, PNG, PDF, DOCX)
                </span>
              </label>
              <input
                type="file"
                name={fileField.name}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={handleChange}
                className="block w-full text-sm border border-gray-300 rounded-lg p-2 bg-gray-50"
              />

              {preview[fileField.name] && (
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(preview[fileField.name], "_blank")
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <span>📂</span> Lihat File
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Mengunggah..." : "Kirim Pendaftaran"}
        </button>
      </form>
    </div>
  );
}
