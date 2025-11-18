"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/tentang" },
  { name: "Galeri", href: "/galeri" },
  { name: "Berita", href: "/berita" },
];

const ctaItems = [{ name: "Donasi", href: "/donasi" }];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="px-4 sm:px-10 fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/50 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between  md:px-8 py-3">
        {/* 🔹 Logo */}
        <Link href="/" className="flex items-start justify-start gap-2">
          <motion.span
            className="font-extrabold text-lg md:text-xl bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Yayasan Khazanah Kebajikan
          </motion.span>
        </Link>

        {/* 🔹 Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-medium transition-all duration-200 ${
                pathname === item.href
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 🔹 Button CTA */}
        <div className="hidden md:block">
          {ctaItems.map((i) => (
            <Link key={i.name} href={i.href}>
              <Button className="bg-orange-500 text-white hover:bg-orange-400 rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                Donasi Sekarang
              </Button>
            </Link>
          ))}
        </div>

        {/* 🔹 Hamburger Menu */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🔹 Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-gray-100 shadow-md"
        >
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-3 text-gray-700 font-medium rounded-md hover:bg-gray-50 ${
                  pathname === item.href ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            {ctaItems.map((i) => (
              <Link key={i.name} href={i.href} onClick={() => setIsOpen(false)}>
                <Button className="mt-3 bg-blue-700 text-white justify-center align-center-items hover:bg-blue-800 rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  Donasi Sekarang
                </Button>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
