"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutSection() {
  return (
    <section id="tentang" className="py-24 px-20   overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-12">
        {/* Bagian kiri (teks) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Tentang <span className="text-primary">Khazanah Kebajikan</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Yayasan Khazanah Kebajikan merupakan lembaga pendidikan Islam yang
            berkomitmen membentuk generasi berilmu, berkarakter, dan berakhlak
            mulia. Kami berfokus pada pembelajaran yang seimbang antara ilmu
            pengetahuan, spiritualitas, dan nilai sosial.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dengan semangat kolaborasi dan keteladanan, kami menghadirkan
            lingkungan belajar yang menumbuhkan potensi santri agar siap menjadi
            generasi penerus bangsa yang unggul.
          </p>
        </motion.div>

        {/* Bagian kanan (elemen visual) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center relative"
        >
          <div className="relative w-72 h-72 md:w-80 md:h-80 bg-gradient-to-tr from-blue-500 to-blue-300 rounded-3xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />
            <Image
              src="/images/about-illustration.png"
              alt="Tentang Yayasan"
              fill
              className="object-cover opacity-90 mix-blend-overlay"
            />
          </div>
          <div className="absolute -bottom-8 -left-6 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-70" />
          <div className="absolute -top-10 -right-8 w-20 h-20 bg-blue-400 rounded-full blur-3xl opacity-60" />
        </motion.div>
      </div>
    </section>
  );
}
