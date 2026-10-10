import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, ArrowLeftRight } from "lucide-react"

const typeLabel: Record<string, string> = { ENTREE: "Entrée", SORTIE: "Sortie", GACHE: "Gâche" }
const typeBadge: Record<string, string> = {
  ENTREE: "bg-green-100 text-green-700",
  SORTIE: "bg-blue-100 text-blue-700",
  GACHE: "bg-red-100 text-red-700",
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
        <h1 className="page-title">Mouvements</h1>
        <Link href="/movements/new" className="btn-primary">
          <Plus size={14} />
          Saisir un mouvement
        </Link>
      </div>

      <div className="card overflow-hidden">
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ArrowLeftRight size={28} className="text-border" />
            <p className="text-sm text-muted">Aucun mouvement enregistré.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-paper/60">
                  {["Date", "Produit", "Type", "Quantité", "Référence", "Utilisateur"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-paper/40 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-muted whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-text">{m.consumable.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeBadge[m.type]}`}>
                        {typeLabel[m.type]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <span className={m.type === "ENTREE" ? "text-ok font-semibold" : "text-danger font-semibold"}>
                        {m.type === "ENTREE" ? "+" : "−"}
                      </span>
                      <span className="text-text">{m.quantity}</span>{" "}
                      <span className="text-muted text-xs">{m.consumable.unit}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted">{m.referenceCommande ?? <span className="text-border">—</span>}</td>
                    <td className="px-5 py-3.5 text-xs text-muted">{m.user.email}</td>
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
