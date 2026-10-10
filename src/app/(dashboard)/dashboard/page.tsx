import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const [totalConsumables, recentMovements, allStocks] = await Promise.all([
    prisma.consumable.count({ where: { deletedAt: null } }),
    prisma.stockMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        consumable: { select: { name: true, unit: true } },
        user: { select: { email: true } },
      },
    }),
    prisma.consumable.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, currentStock: true, minThreshold: true, unit: true },
    }),
  ])

  const alerts = allStocks.filter((c) => c.currentStock <= c.minThreshold)

  const movTypeLabel: Record<string, string> = { ENTREE: "Entrée", SORTIE: "Sortie", GACHE: "Gâche" }
  const movTypeColor: Record<string, string> = {
    ENTREE: "bg-green-100 text-green-800",
    SORTIE: "bg-blue-100 text-blue-800",
    GACHE: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-sm font-medium text-gray-500">Consommables actifs</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalConsumables}</p>
        </div>
        <div className={`card p-6 ${alerts.length > 0 ? "border-red-300 bg-red-50" : ""}`}>
          <p className="text-sm font-medium text-gray-500">Alertes de stock</p>
          <p className={`mt-2 text-3xl font-bold ${alerts.length > 0 ? "text-red-700" : "text-gray-900"}`}>
            {alerts.length}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm font-medium text-gray-500">Mouvements récents</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{recentMovements.length}</p>
        </div>
      </div>

      {/* Alerts banner */}
      {alerts.length > 0 && (
        <div className="card border-red-300 bg-red-50 p-4">
          <h2 className="font-semibold text-red-800 mb-3">
            ⚠ {alerts.length} produit(s) en rupture ou sous le seuil critique
          </h2>
          <ul className="space-y-1">
            {alerts.map((c) => (
              <li key={c.id} className="text-sm text-red-700 flex items-center gap-2">
                <span>•</span>
                <Link href={`/consumables/${c.id}`} className="hover:underline font-medium">
                  {c.name}
                </Link>
                <span className="text-red-500">
                  — {c.currentStock} {c.unit} (seuil : {c.minThreshold} {c.unit})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent movements */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Derniers mouvements</h2>
          <Link href="/movements/new" className="btn-primary text-xs px-3 py-1.5">
            + Saisir un mouvement
          </Link>
        </div>
        {recentMovements.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Aucun mouvement enregistré.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Produit", "Type", "Quantité", "Utilisateur", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentMovements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{m.consumable.name}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${movTypeColor[m.type]}`}>
                      {movTypeLabel[m.type]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {m.quantity} {m.consumable.unit}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{m.user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
