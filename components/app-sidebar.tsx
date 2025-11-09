"use client"

import * as React from "react"
// 1. Import hook 'usePathname'
import { usePathname } from "next/navigation" 
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Newspaper,
  PieChart,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Ini adalah sample data Anda
const data = {
  user: {
    name: "Admin", // Ganti sesuai kebutuhan
    email: "admin@example.com",
    avatar: "/avatars/placeholder.png", // Ganti dengan placeholder atau avatar admin
  },
  teams: [
    {
      name: "Khazanah Kebajikan", // Sesuaikan
      logo: GalleryVerticalEnd,
      plan: "Admin",
    },
  ],
  // Data navigasi utama
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      href:" #dahsboard",
      icon: LayoutDashboard,
      // Hapus 'isActive' yang di-hardcode
    },
    {
      title: "Berita",
      url: "/dashboard/berita", // Ini adalah URL 'parent'
      icon: Newspaper,
      items: [
        {
          title: "Buat Berita",
          url: "/dashboard/berita/create", // Ini adalah 'child'
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings", // Beri URL yang valid
      icon: Settings2,
    },
  ],
  // Hapus data 'projects' jika tidak relevan
  projects: [
    {
      name: "Lihat Situs Publik",
      url: "/", // Link ke halaman utama publik
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 2. Dapatkan path URL saat ini
  const pathname = usePathname()

  // 3. Proses 'navMain' untuk menentukan 'isActive' secara dinamis
  const processedNavMain = React.useMemo(() => {
    
    // Logika untuk menemukan item yang paling cocok
    // Misal: URL = "/dashboard/berita/create"
    // "/dashboard" -> cocok
    // "/dashboard/berita" -> cocok (lebih spesifik)
    // "/dashboard/berita/create" -> tidak ada di nav, jadi '/dashboard/berita' adalah yg terbaik
    
    let bestMatchUrl = "";
    
    const checkUrls = (items: typeof data.navMain) => {
      items.forEach((item) => {
        // Cek apakah URL saat ini *dimulai dengan* URL item
        if (pathname.startsWith(item.url) && item.url.length > 0) {
          // Jika item ini lebih cocok (lebih panjang) dari bestMatch sebelumnya
          if (item.url.length > bestMatchUrl.length) {
            bestMatchUrl = item.url;
          }
        }
        // Rekursif cek sub-items jika ada
        if (item.items) {
           checkUrls(item.items.map(sub => ({...sub, icon: item.icon})));
        }
      });
    }
    
    checkUrls(data.navMain);

    // Buat ulang array dengan 'isActive' yang benar
    return data.navMain.map((item) => {
      // Item parent dianggap aktif jika URL-nya adalah bestMatch
      // ATAU jika salah satu anaknya adalah bestMatch
      const isParentActive = item.url === bestMatchUrl || 
        (item.items && item.items.some(sub => sub.url === bestMatchUrl));
        
      return {
        ...item,
        isActive: isParentActive,
        // Proses sub-items juga
        items: item.items ? item.items.map(subItem => ({
          ...subItem,
          isActive: subItem.url === bestMatchUrl
        })) : undefined
      };
    });
  }, [pathname]); // Akan dihitung ulang setiap kali URL (pathname) berubah

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* 4. Gunakan data yang sudah diproses */}
        <NavMain items={processedNavMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {/* 5. NavUser sekarang akan punya tombol Logout */}
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}