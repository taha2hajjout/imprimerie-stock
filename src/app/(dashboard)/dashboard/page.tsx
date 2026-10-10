import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Package, AlertTriangle, ArrowLeftRight, Plus, TrendingDown } from "lucide-react"
import { StockChart } from "@/components/StockChart"

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

  const chartData = allStocks
    .sort((a, b) => a.currentStock / Math.max(a.minThreshold, 0.01) - b.currentStock / Math.max(b.minThreshold, 0.01))
    .slice(0, 10)
    .map((c) => ({
      name: c.name.length > 14 ? c.name.slice(0, 13) + "…" : c.name,
      fullName: c.name,
      ratio: Math.min(3, parseFloat((c.currentStock / Math.max(c.minThreshold, 0.01)).toFixed(2))),
      isLow: c.currentStock <= c.minThreshold,
    }))

  const movTypeBadge: Record<string, string> = {
    ENTREE: "bg-green-100 text-green-700",
    SORTIE: "bg-blue-100 text-blue-700",
    GACHE: "bg-red-100 text-red-700",
  }
  const movTypeLabel: Record<string, string> = { ENTREE: "Entrée", SORTIE: "Sortie", GACHE: "Gâche" }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-start gap-4">
          <div className="rounded-lg bg-accent/10 p-2.5 flex-shrink-0">
            <Package size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">{totalConsumables}</p>
            <p className="text-xs text-muted font-medium uppercase tracking-wide mt-0.5">Consommables actifs</p>
          </div>
        </div>

        <div className={`card p-5 flex items-start gap-4 ${alerts.length > 0 ? "border-danger/30 bg-red-50" : ""}`}>
          <div className={`rounded-lg p-2.5 flex-shrink-0 ${alerts.length > 0 ? "bg-danger/10" : "bg-paper"}`}>
            <AlertTriangle size={18} className={alerts.length > 0 ? "text-danger" : "text-muted"} />
          </div>
          <div>
            <p className={`text-3xl font-bold ${alerts.length > 0 ? "text-danger" : "text-text"}`}>{alerts.length}</p>
            <p className="text-xs text-muted font-medium uppercase tracking-wide mt-0.5">Alertes critiques</p>
          </div>
        </div>

        <div className="card p-5 flex items-start gap-4">
          <div className="rounded-lg bg-blue-50 p-2.5 flex-shrink-0">
            <ArrowLeftRight size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">{recentMovements.length}</p>
            <p className="text-xs text-muted font-medium uppercase tracking-wide mt-0.5">Mouvements récents</p>
          </div>
        </div>
      </div>

      {/* Stock level chart */}
      {allStocks.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-text mb-4 text-sm">Niveaux de stock</h2>
          <StockChart data={chartData} />
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card overflow-hidden border-danger/25">
          <div className="flex items-center gap-2 border-b border-danger/15 bg-red-50 px-5 py-3.5">
            <TrendingDown size={14} className="text-danger flex-shrink-0" />
            <p className="text-sm font-semibold text-danger">
              {alerts.length} produit{alerts.length > 1 ? "s" : ""} sous le seuil critique
            </p>
          </div>
          <ul className="divide-y divide-border">
            {alerts.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3">
                <Link href={`/consumables/${c.id}`} className="text-sm font-medium text-text hover:text-accent transition-colors">
                  {c.name}
                </Link>
                <span className="text-xs text-danger">
                  {c.currentStock} {c.unit} — seuil {c.minThreshold} {c.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent movements */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-text text-sm">Derniers mouvements</h2>
          <Link href="/movements/new" className="btn-primary text-xs px-3 py-1.5 gap-1">
            <Plus size={13} />
            Saisir un mouvement
          </Link>
        </div>

        {recentMovements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ArrowLeftRight size={28} className="text-border" />
            <p className="text-sm text-muted">Aucun mouvement enregistré.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-paper/60">
                  {["Produit", "Type", "Quantité", "Utilisateur", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-paper/40 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-text">{m.consumable.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${movTypeBadge[m.type]}`}>
                        {movTypeLabel[m.type]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-text">
                      <span className={m.type === "ENTREE" ? "text-ok" : "text-danger"}>
                        {m.type === "ENTREE" ? "+" : "−"}
                      </span>
                      {m.quantity} {m.consumable.unit}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted">{m.user.email}</td>
                    <td className="px-5 py-3.5 text-xs text-muted whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
