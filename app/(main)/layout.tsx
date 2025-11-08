import NavMain from "@/components/sections/NavMain";
import Footer from "@/components/sections/footer";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <NavMain />

          {/* Konten Utama */}
          <main className="grow">{children}</main>
          <Toaster richColors position="top-center" />

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
