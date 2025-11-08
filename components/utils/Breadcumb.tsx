"use client"

import React, { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Fungsi helper untuk mengubah "berita" menjadi "Berita"
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  // Pisahkan path: "/dashboard/berita/create" -> ["dashboard", "berita", "create"]
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1

          // Jangan tampilkan segment [id] yang berupa UUID
          if (segment.length > 20 && index === segments.length - 2 && segments[segments.length - 1] === 'edit') {
             return null; // Sembunyikan UUID
          }
          
          // Ganti "edit" dengan "Edit"
          const segmentName = segment.length > 20 && isLast ? "Edit" : capitalize(segment)


          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segmentName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{segmentName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}