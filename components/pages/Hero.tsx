"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="py-20 relative flex flex-col items-center justify-center text-center  pt-24 pb-16 overflow-hidden"
    >
      {/* Konten teks utama dengan animasi */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Membangun Generasi{" "}
          <span className="text-primary">Berilmu dan Berakhlak Mulia</span>
        </h1>

        <motion.p
          className="text-gray-600 max-w-2xl mx-auto mb-8 text-base md:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          Yayasan Khazanah Kebajikan berkomitmen untuk mencetak santri yang
          berwawasan luas, berkarakter kuat, dan berakhlak mulia melalui
          pendidikan Islam terpadu.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.6,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 transition-all"
          >
            Daftar Sekarang
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 transition-all"
          >
            Pelajari Lebih Lanjut
          </Button>
        </motion.div>
      </motion.div>

      {/* Background motion untuk efek lembut */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-100/40 via-white to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
    </section>
  );
}
