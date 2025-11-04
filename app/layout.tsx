import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yayasan Khazanah Kebajikan",
  description: "Membangun generasi berilmu dan berakhlak mulia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-blue from-blue-100 via-white to-white`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
        
          
          {/* Konten Utama */}
          <main className="flex-grow">{children}</main>
          <Toaster richColors position="top-right" />

          {/* Footer */}
        
        </div>
      </body>
    </html>
  );
}
