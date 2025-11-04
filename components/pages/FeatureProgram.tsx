"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Sparkles, Star, Zap } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-blue-500" />,
    title: "Program Unggulan",
    desc: "Menyediakan berbagai program unggulan untuk pengembangan santri.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Star className="w-8 h-8 text-blue-500" />,
    title: "Fasilitas Modern",
    desc: "Dilengkapi sarana dan prasarana terbaik untuk menunjang pembelajaran.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-500" />,
    title: "Pembinaan Karakter",
    desc: "Fokus pada akhlak, kedisiplinan, dan kemandirian santri.",
    color: "from-sky-500 to-blue-500",
  },
];

export default function FeatureSection() {
  return (
    <section
      id="program"
      className="w-full py-20 xl:px-50 lg:px-20 md:px-20 sm:px-10 px-6 2xl:px-20"
    >
      <div className="max-w-6xl mx-auto px-20 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Program <span className="text-primary">Unggulan Kami</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Kami berkomitmen menghadirkan pengalaman belajar terbaik untuk
          membentuk santri yang berilmu dan berakhlak mulia.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((item, i) => (
          <Card
            key={i}
            className={`relative overflow-hidden hover:scale-[1.03] transition-all duration-300 rounded-2xl shadow-md border border-blue-100 hover:shadow-blue-200/70`}
          >
            {/* Background gradient lembut */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`}
            />
            <CardHeader className="relative z-10 flex flex-col items-center space-y-3 py-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100">
                {item.icon}
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 text-gray-600 text-center pb-8 px-4">
              {item.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
