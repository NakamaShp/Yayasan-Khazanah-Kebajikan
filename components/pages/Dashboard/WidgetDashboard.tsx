"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Newspaper, Star, CalendarClock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import Link from "next/link";

// Tipe data berita
interface RecentBerita {
  id: string;
  judul: string;
  penulis: string | null;
  created_at: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true, locale: indonesianLocale });
  }
  return format(date, "d MMM yyyy", { locale: indonesianLocale });
};

const getInitials = (name?: string | null) => {
  if (!name) return "A";
  const names = name.trim().split(/\s+/);
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0].slice(0, 2).toUpperCase();
};

export default function WidgetDashboard() {
  const supabase = createSupabaseBrowserClient();

  const [totalCount, setTotalCount] = useState(0);
  const [unggulanCount, setUnggulanCount] = useState(0);
  const [bulanIniCount, setBulanIniCount] = useState(0);
  const [recentBerita, setRecentBerita] = useState<RecentBerita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        totalResult,
        unggulanResult,
        bulanIniResult,
        recentResult,
      ] = await Promise.allSettled([
        supabase.from("berita").select("*", { count: "exact", head: true }),
        supabase.from("berita").select("*", { count: "exact", head: true }).eq("is_unggulan", true),
        supabase.from("berita").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth),
        supabase
          .from("berita")
          .select("id, judul, penulis, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setTotalCount(totalResult.status === "fulfilled" ? totalResult.value.count ?? 0 : 0);
      setUnggulanCount(unggulanResult.status === "fulfilled" ? unggulanResult.value.count ?? 0 : 0);
      setBulanIniCount(bulanIniResult.status === "fulfilled" ? bulanIniResult.value.count ?? 0 : 0);
      setRecentBerita(
        recentResult.status === "fulfilled" && Array.isArray(recentResult.value.data)
          ? recentResult.value.data
          : []
      );
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const today = format(new Date(), "eeee, d MMMM yyyy", { locale: indonesianLocale });

  if (loading) return <div>Loading...</div>;

   return (
    <div id="dashboard" className="space-y-8">
      {/* Welcome Widget */}
      <Card className="bg-gradient-to-r from-indigo-100 via-purple-50 to-white shadow-xl rounded-2xl border border-indigo-100 hover:shadow-2xl transition-all duration-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-3xl font-black text-indigo-700 drop-shadow">
                Selamat Datang, Admin!
              </CardTitle>
              <CardDescription className="text-indigo-500 font-medium mt-2">
                Berikut adalah ringkasan singkat untuk hari ini,
                <span className="font-bold text-purple-500 ml-1">{today}</span>.
              </CardDescription>
            </div>
            <Avatar className="h-12 w-12 shadow-lg ring-2 ring-indigo-300">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
      </Card>

      {/* Statistik Widget Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group bg-white/90 border border-indigo-50 shadow-xl rounded-xl px-2 py-4 hover:bg-indigo-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Total Berita</CardTitle>
            <Newspaper className="h-6 w-6 text-indigo-500 group-hover:scale-110 transition-all" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-700">{totalCount}</div>
            <p className="text-xs text-slate-500 mt-2">Total semua artikel yang dipublikasi</p>
          </CardContent>
        </Card>
        <Card className="group bg-white/90 border border-yellow-50 shadow-xl rounded-xl px-2 py-4 hover:bg-yellow-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Berita Unggulan</CardTitle>
            <Star className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-all" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-yellow-500">{unggulanCount}</div>
            <p className="text-xs text-slate-500 mt-2">Artikel yang ditandai sebagai unggulan</p>
          </CardContent>
        </Card>
        <Card className="group bg-white/90 border border-purple-50 shadow-xl rounded-xl px-2 py-4 hover:bg-purple-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Berita Bulan Ini</CardTitle>
            <CalendarClock className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-all" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-purple-700">+{bulanIniCount}</div>
            <p className="text-xs text-slate-500 mt-2">Artikel baru di bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent News Widget */}
      <Card className="bg-white/90 border border-indigo-50 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-indigo-700">
            Aktivitas Berita Terbaru
          </CardTitle>
          <CardDescription className="text-slate-500">
            5 berita terakhir yang ditambahkan ke sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentBerita.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada berita.</p>
          ) : (
            <div className="space-y-4">
              {recentBerita.map((berita) => (
                <div
                  key={berita.id}
                  className="flex items-center gap-3 bg-slate-100 rounded-lg p-2 hover:bg-indigo-100 transition-all duration-200"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-indigo-200">
                    <AvatarFallback>{getInitials(berita.penulis)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-none line-clamp-1 text-slate-700">
                      {berita.judul}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {berita.penulis ?? "Admin"} • {formatDate(berita.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/admin/berita" className="w-full">
            <Button
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-400 to-yellow-300 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition flex gap-2 items-center"
            >
              <Newspaper className="h-5 w-5" />
              Kelola Semua Berita
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
