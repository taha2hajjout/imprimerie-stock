import type { Role } from "@prisma/client"

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  GESTIONNAIRE: "Gestionnaire",
  MAGASINIER: "Magasinier",
}

const roleBadge: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  GESTIONNAIRE: "bg-blue-100 text-blue-700",
  MAGASINIER: "bg-paper text-muted ring-1 ring-border",
}

export default function Header({ user }: { user: { email: string; role: Role } }) {
  return (
    <header className="h-14 bg-white border-b border-border px-6 flex items-center justify-end gap-3 flex-shrink-0">
      <span className="text-sm text-muted">{user.email}</span>
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[user.role]}`}>
        {roleLabels[user.role]}
      </span>
    </header>
  )
}
