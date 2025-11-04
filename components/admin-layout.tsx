"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  Bell,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Berita", href: "/admin/berita", icon: Newspaper },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <nav className="flex-1 mt-4 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5", isActive ? "text-blue-600" : "")}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <Separator />
        <div className="p-4">
          <Button variant="ghost" className="w-full justify-start text-red-600">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Sidebar (Mobile via Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="p-6 border-b flex items-center justify-between">
            <h1 className="text-lg font-bold text-blue-600">Admin Panel</h1>
          </div>
          <nav className="mt-4 flex flex-col space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 rounded-md transition",
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon
                    className={cn("w-5 h-5", isActive ? "text-blue-600" : "")}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <Separator className="my-3" />
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
            >
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Tombol hamburger hanya muncul di mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              className="md:hidden mr-1 rounded-xl bg-white shadow-sm hover:bg-gray-100 active:scale-95 transition-all duration-200 border border-gray-200"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>

            {/* Judul halaman — otomatis geser sedikit di mobile */}
            <h2 className="text-lg font-semibold text-gray-800 ml-1 md:ml-0">
              {menuItems.find((item) => item.href === pathname)?.name ||
                "Dashboard"}
            </h2>
          </div>

          {/* Bagian kanan navbar */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Pengaturan</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
