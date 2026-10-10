"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

export function ActiveLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/50 hover:bg-white/[0.05] hover:text-white/75"
      }`}
    >
      <Icon size={15} strokeWidth={isActive ? 2 : 1.75} className={isActive ? "text-accent" : ""} />
      {label}
    </Link>
  )
}
