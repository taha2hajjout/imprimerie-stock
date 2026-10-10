import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Imprimerie Stock",
  description: "Gestion des stocks d'imprimerie",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full bg-gray-50 antialiased">{children}</body>
    </html>
  )
}
