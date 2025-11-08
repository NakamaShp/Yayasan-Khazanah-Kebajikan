// Tambahkan "use client" karena layout ini sekarang
// berisi komponen client (AppSidebar, DynamicBreadcrumb)
"use client" 

import { AppSidebar } from "@/components/app-sidebar";
// 1. Import breadcrumb dinamis baru Anda
import { DynamicBreadcrumb } from "@/components/utils/Breadcumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {/* 2. Ganti Breadcrumb statis dengan yang dinamis */}
            <DynamicBreadcrumb />

          </div>
        </header>

        <main className="p-4 md:p-6">
          {children}
        </main>
        
      </SidebarInset>
    </SidebarProvider>
  );
}