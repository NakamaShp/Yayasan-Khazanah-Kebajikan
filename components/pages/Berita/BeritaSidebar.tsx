// components/BeritaSidebar.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Newspaper, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

interface Props {
  currentSlug: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function BeritaSidebar({
  currentSlug,
}: Props) {

  // Ambil 5 berita terbaru
  const { data: beritas } = await supabase
    .from("berita")
    .select("judul, slug, created_at")
    .order("created_at", { ascending: false })
    .limit(6); // Ambil 6, kalau-kalau salah satunya adalah yg sedang dibuka

  // Filter berita saat ini dari daftar
  interface Berita {
    judul: string;
    slug: string;
    created_at: string;
  }

  const recentBeritas: Berita[] =
    beritas?.filter((b: Berita) => b.slug !== currentSlug).slice(0, 5) ?? [];

  return (
    <aside className="sticky top-24">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">
        Berita Terbaru
      </h3>
      {recentBeritas.length > 0 ? (
        <ul className="space-y-4">
          {recentBeritas.map((berita) => (
            <li key={berita.slug}>
              <Link
                href={`/berita/${berita.slug}`}
                className="group flex items-start gap-3"
              >
                <Newspaper className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {berita.judul}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {/* Format tanggal */}
                    {new Date(berita.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Tidak ada berita lain.</p>
      )}
    </aside>
  );
}