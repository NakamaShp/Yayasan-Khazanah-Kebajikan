import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Newspaper,
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Navigasi utama/admin
const adminNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    items: [],
  },
  {
    title: "Berita",
    href: "/dashboard/berita",
    icon: Newspaper,
    items: [
      { title: "Semua Berita", href: "/dashboard/berita" },
      { title: "Buat Baru", href: "/dashboard/berita/create" },
    ],
  },
  
];

// Navigasi publik
const publicNavItems = [
  {
    title: "Beranda",
    href: "/",
    icon: Home,
  },
  {
    title: "Tampilan Berita",
    href: "/berita",
    icon: Newspaper,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  // Render item dengan dropdown jika ada children
  const renderNavItem = (item: typeof adminNavItems[0]) => {
    const isActive = pathname.startsWith(item.href);

    if ((item.items?.length ?? 0) > 0) {
      return (
        <Collapsible key={item.title} defaultOpen={isActive} className="w-full">
          <CollapsibleTrigger
            className={`w-full group relative flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
              isActive
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-slate-700 hover:bg-indigo-100 hover:text-indigo-600"
            }`}
          >
            <span
              className={`absolute left-0 top-2 h-6 w-1 rounded bg-indigo-400 transition-all ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${
                isActive ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 border-l border-indigo-100 pl-4 py-1">
            {item.items.map((sub) => {
              const isSubActive = pathname === sub.href;
              return (
                <Link
                  key={sub.title}
                  href={sub.href}
                  className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition ${
                    isSubActive
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <span className="text-xs">•</span>
                  {sub.title}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className={`group relative flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
          pathname === item.href
            ? "bg-indigo-50 text-indigo-600 font-semibold"
            : "text-slate-700 hover:bg-indigo-100 hover:text-indigo-600"
        }`}
      >
        <span
          className={`absolute left-0 top-2 h-6 w-1 rounded bg-indigo-400 transition-all ${
            pathname === item.href ? "opacity-100" : "opacity-0"
          }`}
        />
        <item.icon className="h-5 w-5" />
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <nav className="grid gap-4 pt-6 pb-4 px-4">
      {/* Kategori Admin */}
      <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
        Navigasi Admin
      </div>
      {adminNavItems.map(renderNavItem)}

      {/* Kategori Publik */}
      <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mt-6 mb-2">
        Navigasi Publik
      </div>
      {publicNavItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={`group relative flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
            pathname === item.href
              ? "bg-indigo-50 text-indigo-600 font-semibold"
              : "text-slate-700 hover:bg-indigo-100 hover:text-indigo-600"
          }`}
        >
          <span
            className={`absolute left-0 top-2 h-6 w-1 rounded bg-indigo-400 transition-all ${
              pathname === item.href ? "opacity-100" : "opacity-0"
            }`}
          />
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
