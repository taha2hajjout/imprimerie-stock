import type { Role } from "@prisma/client"

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  GESTIONNAIRE: "Gestionnaire",
  MAGASINIER: "Magasinier",
}

const roleColors: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  GESTIONNAIRE: "bg-blue-100 text-blue-800",
  MAGASINIER: "bg-gray-100 text-gray-700",
}

export default function Header({ user }: { user: { email: string; role: Role } }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end gap-4 flex-shrink-0">
      <span className="text-sm text-gray-600">{user.email}</span>
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>
        {roleLabels[user.role]}
      </span>
    </header>
  )
}
