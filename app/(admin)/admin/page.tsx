"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Newspaper, Users, Settings } from "lucide-react"

export default function AdminPage() {
  const stats = [
    { title: "Total Berita", value: 24, icon: Newspaper },
    { title: "Pengguna Aktif", value: 12, icon: Users },
    { title: "Kategori", value: 5, icon: Settings },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Selamat Datang, Admin 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-700">{stat.title}</CardTitle>
              <stat.icon className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-blue-600">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
