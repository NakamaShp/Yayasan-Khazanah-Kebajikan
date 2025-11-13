"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client"; // Gunakan klien BARU
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner"; // Impor Toaster & toast
import Link from "next/link";
import { CircleChevronLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Buat instance klien Supabase di dalam komponen
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Login error:", error.message);
      toast.error(`Login Gagal: ${error.message}`);
    } else {
      toast.success("Login Berhasil! Mengarahkan...");

      // Paksa refresh untuk membersihkan cache router
      // dan redirect ke dashboard (ditangani oleh middleware)
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 ">
        <Card className="w-full max-w-sm items-center">
          <form onSubmit={handleLogin}>
            <Link href="/">
              <Button className="flex pl-2 bg-blend-soft-light">
                <CircleChevronLeft />
                Kembali ke beranda
              </Button>
            </Link>
            <CardHeader>
              <CardTitle className="text-2xl">Login Admin</CardTitle>
              <CardDescription>
                Masukkan email dan password Anda untuk mengakses dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memuat..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
