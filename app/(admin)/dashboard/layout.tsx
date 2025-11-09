"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Package2, Bell, Search, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardNav } from "@/components/DashbordNav";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white transition-colors">
      {/* Sidebar Desktop Fixed */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[260px] flex-col border-r bg-white dark:bg-slate-900 shadow-lg z-20">
        <div className="h-16 flex items-center border-b px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-indigo-600"
          >
            <Package2 className="h-7 w-7 text-indigo-500" />
            <span>Khazanah Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-hidden">
          <DashboardNav />
        </div>
        <div className="p-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="w-full flex gap-2 items-center bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-[260px] flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-16 border-b bg-white/80 dark:bg-slate-900/80 shadow-sm sticky top-0 z-10 gap-4">
          {/* Hamburger for mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden shadow-sm"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 bg-white dark:bg-slate-900 w-64"
            >
              <div className="h-16 flex items-center border-b px-6">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-bold text-indigo-600"
                >
                  <Package2 className="h-7 w-7 text-indigo-500" />
                  <span>Khazanah Admin</span>
                </Link>
              </div>
              <DashboardNav />
              <div className="p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex gap-2 items-center bg-red-50 hover:bg-red-100 text-red-600 transition rounded-lg mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <form className="w-full relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-indigo-400" />
              <Input
                type="search"
                placeholder="Cari..."
                className="w-full pl-8 py-2 rounded-md border border-indigo-100 bg-slate-50 focus:ring-2 focus:ring-indigo-200 shadow-none transition"
              />
            </form>
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/placeholder.png" alt="Admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-2 bg-white shadow-lg border border-indigo-50 rounded-lg"
            >
              <DropdownMenuLabel className="text-indigo-600 font-semibold">
                Akun Saya
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 hover:bg-red-50 font-semibold flex gap-2 items-center"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
