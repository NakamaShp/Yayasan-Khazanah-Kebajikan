"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden flex flex-col items-center justify-center text-center py-20 md:py-32 bg-white"
    >
      {/* Ornamen blur modern */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-blue-200/40 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-300/30 blur-3xl rounded-full -z-10" />

      {/* Konten utama */}
      <motion.div
        className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Flex Container */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16">
          {/* 🟦 Bagian Teks */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-900">
              Membangun <span className="text-blue-700">Generasi Beriman</span>
              <br />
              dan <span className="text-amber-500">Berilmu Tinggi</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 mb-8">
              <span className="font-semibold text-blue-700">
                Yayasan Khazanah Kebajikan Palembang{" "}
              </span>
              berkomitmen mencetak santri yang kuat iman dan taqwanya, berakhlak
              mulia, serta berilmu pengetahuan tinggi untuk membangun masyarakat
              Islami yang makmur dan sejahtera dalam ridha Allah SWT.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                size="lg"
                className="bg-blue-700 text-white hover:bg-blue-800 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
              >
                Lihat Program Unggulan
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-700 text-blue-700 hover:bg-blue-50 rounded-full px-8 transition-all"
              >
                Tentang Yayasan
              </Button>
            </div>
          </motion.div>

          {/* 🟨 Bagian Gambar */}
          <motion.div
            className="flex-1 relative w-full flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-64 sm:w-80 md:w-full max-w-lg mx-auto">
              <Image
                src="/images/hero-santri.jpg"
                alt="Santri belajar di Yayasan Khazanah Kebajikan"
                width={700}
                height={500}
                priority
                className="rounded-3xl shadow-2xl object-cover"
              />
              {/* Floating Card */}
              <motion.div
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl shadow-lg p-2 sm:p-4 w-44 sm:w-56 "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <p className="text-xs sm:text-sm text-gray-700 font-semibold">
                  Santri & Dhuafa Berprestasi
                </p>
                <p className="text-base sm:text-lg font-bold text-blue-700">
                  100+ Jiwa
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
