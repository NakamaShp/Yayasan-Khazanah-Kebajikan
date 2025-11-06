"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AboutGoals() {
  const goals = [
    "Mengajak umat Islam agar melaksanakan Al-Qur’an dan sunnah Rasulullah.",
    "Melaksanakan kegiatan usaha untuk memakmurkan masjid dan musholla.",
    "Menyantuni anak piatu, yatim, dan fakir miskin.",
    "Meningkatkan harkat derajat kaum lemah.",
    "Berperan aktif membantu Negara dalam mencerdaskan kehidupan bangsa.",
  ];

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-blue-100 via-white to-blue-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-200/40 blur-3xl rounded-full -z-10" />

      <motion.div
        className="container mx-auto px-6 md:px-12 lg:px-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-10">
          🎯 TUJUAN YAYASAN
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {goals.map((goal, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="flex items-start gap-3 bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl shadow-md p-6 text-gray-700 text-left"
            >
              <CheckCircle2 className="text-blue-600 w-6 h-6 mt-1" />
              <p className="font-medium">{goal}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
