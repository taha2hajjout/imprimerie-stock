import { prisma } from "@/lib/prisma"
import Link from "next/link"

const typeLabel: Record<string, string> = { ENTREE: "Entrée", SORTIE: "Sortie", GACHE: "Gâche" }
const typeColor: Record<string, string> = {
  ENTREE: "bg-green-100 text-green-800",
  SORTIE: "bg-blue-100 text-blue-800",
  GACHE: "bg-red-100 text-red-800",
}

export default async function MovementsPage() {
  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      consumable: { select: { name: true, unit: true } },
      user: { select: { email: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mouvements de stock</h1>
        <Link href="/movements/new" className="btn-primary">+ Saisir un mouvement</Link>
      </div>

      <div className="card overflow-hidden">
        {movements.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">Aucun mouvement enregistré.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Produit", "Type", "Quantité", "Référence", "Utilisateur"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{m.consumable.name}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor[m.type]}`}>
                      {typeLabel[m.type]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {m.type === "ENTREE" ? "+" : "-"}{m.quantity} {m.consumable.unit}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{m.referenceCommande ?? "—"}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{m.user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
