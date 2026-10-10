"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function ActiveLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + "/")

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-indigo-800 text-white"
          : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  )
}
