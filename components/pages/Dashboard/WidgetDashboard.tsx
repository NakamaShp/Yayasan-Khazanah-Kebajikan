import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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
import {
  Newspaper,
  Star,
  CalendarClock,
  User,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import { useMemo } from "react";

// Interface untuk data yang kita fetch
interface RecentBerita {
  id: string;
  judul: string;
  penulis: string | null;
  created_at: string;
}

// Helper untuk format tanggal (Contoh: "2 jam lalu" atau "10 Nov 2025")
const formatDate = (dateString: string) => {

  const date = new Date(dateString);
  const now = new Date();
  // Jika kurang dari 7 hari, tampilkan format relatif (mis: 2 hari lalu)
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: indonesianLocale,
    });
  }
  // Jika lebih, tampilkan tanggal (mis: 10 Nov 2025)
  return format(date, "d MMM yyyy", { locale: indonesianLocale });
};

// Helper untuk mengambil inisial nama
const getInitials = (name?: string | null) => {
  if (!name) return "A"; // Admin default
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
};

/**
 * =======================
 * Halaman Dashboard (Server Component)
 * =======================
 */
export default async function WidgetDashboard() {
  const supabase = createSupabaseBrowserClient();
  
  // --- 1. Data Fetching ---
  // Kita akan fetch semua data secara paralel untuk performa
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    totalResult,
    unggulanResult,
    bulanIniResult,
    recentResult
  ] = await Promise.allSettled([
    // a. Hitung total berita
    supabase.from("berita").select("*", { count: "exact", head: true }),
    // b. Hitung berita unggulan
    supabase.from("berita").select("*", { count: "exact", head: true }).eq("is_unggulan", true),
    // c. Hitung berita bulan ini
    supabase.from("berita").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth),
    // d. Ambil 5 berita terbaru
    supabase.from("berita").select("id, judul, penulis, created_at").order("created_at", { ascending: false }).limit(5)
  ]);

  // --- 2. Proses Data ---
  // Kita gunakan 'allSettled' agar jika 1 query gagal, halaman tidak crash
  const totalCount = totalResult.status === 'fulfilled' ? (totalResult.value.count ?? 0) : 0;
  const unggulanCount = unggulanResult.status === 'fulfilled' ? (unggulanResult.value.count ?? 0) : 0;
  const bulanIniCount = bulanIniResult.status === 'fulfilled' ? (bulanIniResult.value.count ?? 0) : 0;
  const recentBerita: RecentBerita[] = recentResult.status === 'fulfilled' ? (recentResult.value.data as RecentBerita[] ?? []) : [];
  
  const today = format(now, "eeee, d MMMM yyyy", { locale: indonesianLocale });

  // --- 3. Render JSX ---
  return (
    <div className="space-y-6">
      
      {/* --- Widget 1: Selamat Datang --- */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Selamat Datang, Admin!</CardTitle>
              <CardDescription>
                Berikut adalah ringkasan singkat untuk hari ini, {today}.
              </CardDescription>
            </div>
            {/* Ganti "Admin" dengan nama user jika ada logic auth */}
            <Avatar>
              <AvatarFallback>AD</AvatarFallback> 
            </Avatar>
          </div>
        </CardHeader>
      </Card>

      {/* --- Widget 2: Statistik (KPI) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat Card: Total Berita */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Berita</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Total semua artikel yang dipublikasi
            </p>
          </CardContent>
        </Card>

        {/* Stat Card: Berita Unggulan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berita Unggulan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unggulanCount}</div>
            <p className="text-xs text-muted-foreground">
              Artikel yang ditandai sebagai unggulan
            </p>
          </CardContent>
        </Card>

        {/* Stat Card: Berita Bulan Ini */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berita Bulan Ini</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{bulanIniCount}</div>
            <p className="text-xs text-muted-foreground">
              Artikel baru di bulan ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Widget 3: Aktivitas Terbaru --- */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Berita Terbaru</CardTitle>
          <CardDescription>
            5 berita terakhir yang ditambahkan ke sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentBerita.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada berita.</p>
          ) : (
            <div className="space-y-4">
              {recentBerita.map((berita) => (
                <div key={berita.id} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{getInitials(berita.penulis)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none line-clamp-1">
                      {berita.judul}
                    </p>
                    <p className="text-sm text-muted-foreground">
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
            <Button variant="outline" className="w-full">
              <Newspaper className="mr-2 h-4 w-4" />
              Kelola Semua Berita
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}