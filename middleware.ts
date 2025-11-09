import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Fungsi middleware ini akan berjalan untuk setiap request yang cocok dengan 'config.matcher'
export async function middleware(request: NextRequest) {
  
  // 1. Buat response dasar. Kita akan memperbaruinya jika perlu.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Buat klien Supabase khusus untuk middleware.
  // Ini aman dijalankan di server.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Objek 'cookies' ini memberi tahu Supabase cara membaca & menulis
      // cookie sesi dari request/response.
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Setiap kali kita SET cookie, kita harus membuat ulang response
          // agar cookie baru terkirim ke browser.
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Sama seperti 'set', kita harus membuat ulang response saat MENGHAPUS.
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Refresh sesi. Ini SANGAT PENTING.
  // Ini akan memeriksa cookie, memvalidasinya dengan Supabase, 
  // dan memperbaruinya jika perlu.
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // 4. INI ADALAH LOGIKA "PENJAGA GERBANG" ANDA

  // KASUS 1: Pengguna BELUM login (tidak ada sesi)
  if (!session) {
    // DAN mereka mencoba mengakses rute yang dilindungi
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      // Kita paksa redirect mereka ke halaman login.
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // KASUS 2: Pengguna SUDAH login (ada sesi)
  if (session) {
    // DAN mereka mencoba mengakses halaman login (yang tidak perlu lagi)
    if (pathname === '/login') {
      // Kita lempar mereka kembali ke dashboard.
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // 5. Jika tidak ada kasus di atas, biarkan pengguna melanjutkan ke
  // halaman yang mereka tuju.
  return response
}

// 6. Konfigurasi Matcher
// Ini memberi tahu Next.js rute mana saja yang harus 
// menjalankan fungsi middleware di atas.
export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali yang dimulai dengan:
     * - _next/static (file statis)
     * - _next/image (file optimasi gambar)
     * - favicon.ico (file favicon)
     *
     * Ini penting agar middleware tidak berjalan pada file-file aset.
     */
    
    // Kita ingin "menjaga" rute-rute ini:
    '/dashboard',       // Halaman dashboard utama
    '/dashboard/:path*', // Semua sub-halaman di bawah dashboard
    '/login',            // Halaman login (untuk KASUS 2 di atas)
  ],
}