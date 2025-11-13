"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-10">
        {/* Text Section (Sekarang order-1 di Desktop, order-2 di Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          // ⭐️ PERUBAHAN: Teks menjadi order-1 di desktop
          className="flex-1 space-y-6 order-2 md:order-1 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 ">
            Tentang Yayasan Khazanah Kebajikan
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Yayasan Khazanah Kebajikan (YKK) Palembang merupakan lembaga sosial
            keagamaan yang mengasuh dan mendidik anak-anak yatim serta kaum
            dhuafa. Kami berfokus pada bidang sosial, pendidikan, dan ekonomi
            umat dengan menanamkan budaya tahajud, kajian Al-Qur’an, serta
            semangat berbagi melalui zakat dan sedekah.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Didirikan sejak tahun 2015, YKK berkomitmen untuk melahirkan
            generasi yang kuat iman, berilmu tinggi, dan berakhlak mulia.
          </p>
          {/* Div untuk centering tombol di mobile */}
          <div className="flex justify-center md:justify-start">
            <Button
              asChild
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-lg transition duration-300"
            >
              <Link href="/tentang">Selengkapnya</Link>
            </Button>
          </div>
        </motion.div>

        {/* Image Section (Sekarang order-2 di Desktop, order-1 di Mobile) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          // ⭐️ PERUBAHAN: Gambar menjadi order-2 di desktop
          className="flex-1 flex justify-center items-center order-1 md:order-2"
        >
          <div className="relative p-6 bg-white rounded-3xl shadow-2xl">
            <Image
              src="/images/about/icon.jpg"
              alt="Yayasan Khazanah Kebajikan"
              // Ukuran mobile (default) dan di-override di desktop
              width={250}
              height={250}
              className="object-contain rounded-2xl md:w-[350px] md:h-[350px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
