"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <motion.main
      key={pathname}
      className="flex-1 overflow-y-auto bg-paper p-6"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  )
}
