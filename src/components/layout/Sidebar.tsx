import { ActiveLink } from "./ActiveLink"
import { signOutAction } from "@/lib/actions/auth"
import type { Role } from "@prisma/client"

const navItems = [
  { href: "/dashboard", icon: "◈", label: "Tableau de bord" },
  { href: "/consumables", icon: "📦", label: "Consommables" },
  { href: "/movements", icon: "↕", label: "Mouvements" },
]

export default function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="w-60 bg-indigo-900 flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-indigo-800">
        <h1 className="text-base font-bold text-white">🖨️ Imprimerie Stock</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <ActiveLink key={item.href} {...item} />
        ))}
        {role === "ADMIN" && (
          <ActiveLink href="/users" icon="👥" label="Utilisateurs" />
        )}
      </nav>

      <div className="px-3 py-4 border-t border-indigo-800">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-800 hover:text-white transition-colors"
          >
            <span>⏏</span>
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
