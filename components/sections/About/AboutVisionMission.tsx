"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AboutVisionMission() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-blue-50 via-white to-blue-100 overflow-hidden">
      <div className="absolute -top-10 left-10 w-[300px] h-[300px] bg-blue-200/30 blur-3xl rounded-full -z-10" />

      <motion.div
        className="container mx-auto px-6 md:px-12 lg:px-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-10">
          🌟 VISI & MISI YAYASAN
        </h2>

        {/* VISI */}
        <div className="bg-white/80 backdrop-blur-md border border-blue-100 shadow-lg rounded-3xl p-8 mb-12 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-amber-500 w-6 h-6" />
            VISI
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Menjadikan yayasan penggerak ibadah dan peningkatan ekonomi umat
            menuju masyarakat Islami yang adil, makmur, dan sejahtera dalam
            ridha Allah SWT.
          </p>
        </div>

        {/* MISI */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            "Membumikan Al-Qur’an dalam kehidupan bermasyarakat (Budaya Qur’an).",
            "Membudayakan gemar berderma (ZIS) dan sholat tahajud.",
            "Mengangkat harkat derajat kaum lemah.",
            "Mengembangkan sumber daya manusia beriman, bertaqwa, dan berilmu teknologi tinggi.",
            "Meningkatkan peran masyarakat dalam membangun ekonomi umat.",
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl border border-blue-100 shadow-md p-6 text-gray-700 text-left"
            >
              <p className="font-medium">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
