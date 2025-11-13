import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang" },
    { name: "Program", href: "/program" },
    { name: "Galeri", href: "/galeri" },
    { name: "Berita", href: "/berita" },
    { name: "Kontak", href: "/kontak" },
    { name: "admin", href: "/dashboard" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-blue-800 to-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Grid 4 kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-white/10 pb-10">
          {/* 🔹 Logo & Deskripsi */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              Khazanah <span className="text-blue-200">Kebajikan</span>
            </h3>
            <p className="text-blue-100 leading-relaxed text-sm">
              Yayasan pendidikan Islam yang berkomitmen membangun generasi
              berilmu dan berakhlak mulia melalui pendidikan yang berlandaskan
              nilai-nilai kebajikan.
            </p>
          </div>

          {/* 🔹 Navigasi */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🔹 Kontak */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>Jl. Contoh No. 45, Palembang</li>
              <li>Telp: (0711) 555-6789</li>
              <li>Email: info@khazanahkebajikan.or.id</li>
            </ul>
          </div>

          {/* 🔹 Media Sosial */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">
            Yayasan Khazanah Kebajikan
          </span>
          . Semua Hak Dilindungi.
        </div>
      </div>

      {/* Efek dekorasi */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </footer>
  );
}
