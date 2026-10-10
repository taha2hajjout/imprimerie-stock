import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { deleteUser } from "@/lib/actions/users"
import CreateUserForm from "./CreateUserForm"

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  GESTIONNAIRE: "Gestionnaire",
  MAGASINIER: "Magasinier",
}

export default async function UsersPage() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } })

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>

      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Email", "Rôle", "Créé le", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((u) => {
              const isSelf = u.id === session.user.id
              const deleteAction = deleteUser.bind(null, u.id)
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {u.email}
                    {isSelf && <span className="ml-2 text-xs text-indigo-500">(vous)</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{roleLabels[u.role]}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    {!isSelf && (
                      <form action={deleteAction}>
                        <button type="submit" className="text-red-500 hover:underline text-sm">
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
