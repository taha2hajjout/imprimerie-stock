import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { deleteUser } from "@/lib/actions/users"
import CreateUserForm from "./CreateUserForm"
import { Trash2 } from "lucide-react"

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  GESTIONNAIRE: "Gestionnaire",
  MAGASINIER: "Magasinier",
}
const roleBadge: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  GESTIONNAIRE: "bg-blue-100 text-blue-700",
  MAGASINIER: "bg-paper text-muted ring-1 ring-border",
}

export default async function UsersPage() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } })

  return (
    <div className="space-y-8">
      <h1 className="page-title">Utilisateurs</h1>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-paper/60">
              {["Email", "Rôle", "Créé le", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const isSelf = u.id === session.user.id
              const deleteAction = deleteUser.bind(null, u.id)
              return (
                <tr key={u.id} className="hover:bg-paper/40 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-text">
                    {u.email}
                    {isSelf && <span className="ml-2 text-xs text-accent font-normal">(vous)</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    {!isSelf && (
                      <form action={deleteAction}>
                        <button type="submit" className="btn-danger">
                          <Trash2 size={12} />
                          Supprimer
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <CreateUserForm />
    </div>
  )
}
