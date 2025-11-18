"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface HeaderConfig {
  title: string;
  subtitle: string;
  breadcrumb: string[];
}

const headerConfig: Record<string, HeaderConfig> = {
  "/": {
    title: "Selamat Datang di Yayasan Khazanah Kebajikan",
    subtitle:
      "Menumbuhkan generasi berilmu, berkarakter, dan berakhlak mulia menuju masa depan yang lebih baik.",
    breadcrumb: ["Beranda"],
  },
  "/tentang": {
    title: "Tentang Khazanah Kebajikan",
    subtitle:
      "Lembaga pendidikan Islam yang menanamkan keseimbangan antara ilmu, akhlak, dan spiritualitas.",
    breadcrumb: ["Beranda", "Tentang"],
  },
  "/program": {
    title: "Program Unggulan",
    subtitle:
      "Mengembangkan potensi santri melalui pembelajaran holistik dan kegiatan inspiratif.",
    breadcrumb: ["Beranda", "Program"],
  },
  "/galeri": {
    title: "Galeri Kegiatan",
    subtitle:
      "Menelusuri momen penuh makna dalam setiap langkah pembelajaran dan pengabdian.",
    breadcrumb: ["Beranda", "Galeri"],
  },
  "/berita": {
    title: "Berita & Informasi",
    subtitle:
      "Dapatkan kabar terbaru seputar kegiatan dan prestasi santri kami.",
    breadcrumb: ["Beranda", "Berita"],
  },
  "/kontak": {
    title: "Hubungi Kami",
    subtitle:
      "Kami terbuka untuk pertanyaan, aspirasi, dan kolaborasi demi kemajuan pendidikan.",
    breadcrumb: ["Beranda", "Kontak"],
  },
  "/donasi": {
    title: "Ayo Berbagi Kebaikan",
    subtitle:
      "Setiap donasi Anda adalah investasi untuk melahirkan generasi santri yang berilmu, berakhlak, dan bermanfaat bagi umat.",
    breadcrumb: ["Beranda", "Donasi"],
  },
};

export default function HeaderPage() {
  const pathname = usePathname();
  const config = headerConfig[pathname] || headerConfig["/"];

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-500 to-blue-600 text-white pt-28 pb-32 md:pb-40">
      {/* Dekorasi lembut */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_80%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-10 left-[-50px] w-80 h-80 bg-blue-300/20 rounded-full blur-3xl opacity-40" />

      {/* Konten utama */}
      <div className="relative container mx-auto px-6 text-center max-w-3xl">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center items-center gap-2 text-sm md:text-base text-blue-100/90 mb-6"
        >
          {config.breadcrumb.map((crumb, i) => (
            <div key={i} className="flex items-center gap-2">
              {i === 0 && (
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  {crumb}
                </Link>
              )}
              {i > 0 && (
                <>
                  <ChevronRight className="w-4 h-4 text-blue-200" />
                  {i === config.breadcrumb.length - 1 ? (
                    <span className="font-semibold text-white">{crumb}</span>
                  ) : (
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      {crumb}
                    </Link>
                  )}
                </>
              )}
            </div>
          ))}
        </motion.nav>

        {/* Judul */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md"
        >
          {config.title}
        </motion.h1>

        {/* Subjudul */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-blue-50/90 text-base md:text-lg leading-relaxed font-medium"
        >
          {config.subtitle}
        </motion.p>

        {/* Garis aksen */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 h-[3px] w-24 mx-auto bg-white/80 rounded-full"
        />
      </div>
    </header>
  );
}
