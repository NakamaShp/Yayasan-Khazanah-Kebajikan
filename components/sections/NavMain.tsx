"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Beranda", href: "/" },
  { name: "Tentang Kami", href: "/tentang" },
  {
    name: "Program",
    href: "#",
    dropdown: true,
    subItems: [
      { name: "Program Beasiswa", href: "#" },
      { name: "Program Sosial", href: "#" },
      { name: "Program Santri", href: "#" },
    ],
  },
  { name: "Galeri", href: "/galeri" },
  { name: "Berita", href: "/berita" },
  { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250); // delay 250ms sebelum dropdown ditutup
  };

  return (
    <header className="px-4 sm:px-10 fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/50 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center md:px-8 py-3">
        {/* 🔹 Logo */}
        <Link href="/" className="flex items-center gap-2">
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
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.dropdown ? (
                <>
                  <div
                    className={`flex items-center gap-1 font-medium cursor-pointer transition-colors ${
                      pathname === item.href
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                    <ChevronDown
                      className={`w-4 h-4 mt-[1px] transition-transform ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* 🔹 Dropdown Menu */}
                  <div
                    className={`absolute left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                      activeDropdown === item.name
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible"
                    }`}
                  >
                    <div className="flex flex-col">
                      {item.subItems?.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* 🔹 Button CTA */}
        <div className="hidden md:block">
          <Button className="bg-blue-700 text-white hover:bg-blue-800 rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
            Donasi Sekarang
          </Button>
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
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name}>
                  <span className="block py-2 px-3 text-gray-700 font-medium">
                    {item.name}
                  </span>
                  <div className="flex flex-col ml-4 mt-1 border-l border-gray-200">
                    {item.subItems?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
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
              )
            )}

            <Button className="mt-3 bg-blue-700 text-white hover:bg-blue-800 rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
              Donasi Sekarang
            </Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
