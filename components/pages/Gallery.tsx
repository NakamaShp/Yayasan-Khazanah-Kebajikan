"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  "https://i.pinimg.com/736x/bf/f5/af/bff5af8dc803a912023d5315d69f28b6.jpg",
  "https://i.pinimg.com/736x/90/42/d3/9042d3de162f737752e6764892442482.jpg",
  "https://i.pinimg.com/1200x/07/e4/c1/07e4c14f428d534bd1f1a44014b940a3.jpg",
  "https://i.pinimg.com/1200x/c4/3f/a6/c43fa6303501abf15128550a0afcdce6.jpg",
  "https://i.pinimg.com/1200x/80/33/9d/80339dfab637d3a25620652dbdae8e4c.jpg",
  "https://i.pinimg.com/1200x/73/ff/53/73ff539c3fb80ec735c604ddc65707cc.jpg",
];

export function GallerySection() {
  return (
    <section id="galeri" className="py-20 px-4 md:px-20">
      <div className="container mx-auto text-center">
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Galeri <span className="text-primary">Kegiatan Kami</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami berkomitmen menghadirkan pengalaman belajar terbaik untuk
            membentuk santri yang berilmu dan berakhlak mulia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="overflow-hidden rounded-2xl shadow-lg bg-white cursor-pointer"
            >
              <Image
                src={src}
                alt={`Galeri ${i + 1}`}
                width={400}
                height={300}
                className="object-cover w-full h-64"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
