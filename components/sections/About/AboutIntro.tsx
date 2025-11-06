"use client";

import { motion } from "framer-motion";

export default function AboutIntro() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Background blur */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-200/30 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-200/20 blur-3xl rounded-full -z-10" />

      <motion.div
        className="container mx-auto px-6 md:px-12 lg:px-20 text-center md:text-left"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 text-center">
          PROGRAM YAYASAN
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-justify">
          <span className="font-semibold text-blue-700">
            Yayasan Khazanah Kebajikan (YKK) Palembang
          </span>{" "}
          adalah lembaga sosial keagamaan yang mengasuh dan mendidik anak-anak
          yatim secara khusus dan kaum dhuafa. Yayasan Khazanah Kebajikan
          memiliki pondok pesantren yang bergerak dalam bidang sosial,
          pendidikan, dan ekonomi umat.
        </p>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-4xl mx-auto mt-6 text-justify">
          Ciri khas YKK adalah budaya sholat tahajud, kajian Al-Qur’an,
          penerimaan dan penyaluran zakat, shodaqoh, serta program usaha
          produktif bagi umat. Berdiri sejak{" "}
          <span className="font-semibold">Februari 2015</span>, yayasan ini
          dipimpin oleh:
        </p>

        <div className="mt-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 max-w-lg mx-auto border border-blue-100">
          <ul className="text-gray-700 space-y-2 text-left">
            <li>
              <strong>Ketua:</strong> Imron Taslim, S.P., M.Si., M.Pd
            </li>
            <li>
              <strong>Sekretaris:</strong> Arifin HS
            </li>
            <li>
              <strong>Bendahara:</strong> Masita Sutri, S.Pd
            </li>
          </ul>
        </div>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-4xl mx-auto mt-6 text-justify">
          Yayasan ini hadir sebagai bentuk kepedulian sosial untuk membantu
          kaum dhuafa memperoleh kehidupan yang layak melalui pendidikan formal
          dan non-formal — dari tingkat PAUD hingga SMA-IT — serta membentuk
          pribadi yang beriman, berilmu tinggi, dan berakhlak mulia.
        </p>
      </motion.div>
    </section>
  );
}
