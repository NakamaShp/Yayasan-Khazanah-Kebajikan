"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Users } from "lucide-react";

const programs = [
  {
    icon: <Heart className="w-8 h-8 text-blue-600" />,
    title: "Program Sosial",
    desc: "Memberdayakan masyarakat dhuafa melalui kegiatan berbagi, santunan yatim, dan bakti sosial.",
    link: "/program/sosial",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    title: "Program Pendidikan",
    desc: "Pembinaan santri dalam bidang tahsin, tahfidz, dan pendidikan umum yang berkarakter Islami.",
    link: "/program/pendidikan",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: "Program Pemberdayaan",
    desc: "Pelatihan kewirausahaan dan ekonomi kreatif untuk mendukung kemandirian umat.",
    link: "/program/pemberdayaan",
  },
];

export default function ProgramPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-10"
        >
          Program Unggulan Kami
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-lg rounded-2xl p-8 text-left border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-5">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-5">{item.desc}</p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={item.link}>Selengkapnya</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
