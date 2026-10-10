import { ActiveLink } from "./ActiveLink"
import { signOutAction } from "@/lib/actions/auth"
import { LayoutDashboard, Package, ArrowLeftRight, Users, LogOut } from "lucide-react"
import type { Role } from "@prisma/client"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/consumables", icon: Package, label: "Consommables" },
  { href: "/movements", icon: ArrowLeftRight, label: "Mouvements" },
]

export default function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="w-56 bg-ink flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            IS
          </div>
          <span className="text-sm font-semibold text-white leading-tight">Imprimerie Stock</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <ActiveLink key={item.href} {...item} />
        ))}
        {role === "ADMIN" && (
          <ActiveLink href="/users" icon={Users} label="Utilisateurs" />
        )}
      </nav>

      <div className="px-3 pb-4 pt-3 border-t border-white/5">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/[0.05] hover:text-white/75 transition-colors"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
