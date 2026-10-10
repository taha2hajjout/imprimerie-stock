import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { archiveConsumable } from "@/lib/actions/consumables"
import Link from "next/link"
import { Plus, Package, Pencil, Archive } from "lucide-react"

const typeLabels: Record<string, string> = {
  PAPIER: "Papier", ENCRE: "Encre", PLAQUE: "Plaque", DIVERS: "Divers",
}
const typeBadge: Record<string, string> = {
  PAPIER: "bg-blue-50 text-blue-700",
  ENCRE: "bg-purple-50 text-purple-700",
  PLAQUE: "bg-amber-50 text-amber-700",
  DIVERS: "bg-paper text-muted ring-1 ring-border",
}

export default async function ConsumablesPage() {
  const [session, consumables] = await Promise.all([
    auth(),
    prisma.consumable.findMany({
      where: { deletedAt: null },
      include: { paperDetail: true },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
  ])

  const canEdit = session?.user.role !== "MAGASINIER"
  const isAdmin = session?.user.role === "ADMIN"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Consommables</h1>
        {canEdit && (
          <Link href="/consumables/new" className="btn-primary">
            <Plus size={14} />
            Nouveau
          </Link>
        )}
      </div>

      <div className="card overflow-hidden">
        {consumables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package size={32} className="text-border" />
            <p className="text-sm text-muted">
              Aucun consommable.{" "}
              {canEdit && <Link href="/consumables/new" className="text-accent hover:underline">Créez-en un.</Link>}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-paper/60">
                  {["Nom", "Type", "Niveau de stock", "Statut", ...(canEdit ? ["Actions"] : [])].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {consumables.map((c) => {
                  const isLow = c.currentStock <= c.minThreshold
                  const maxStock = Math.max(c.minThreshold * 3, c.currentStock, 1)
                  const pct = Math.min(100, (c.currentStock / maxStock) * 100)
                  const archiveAction = archiveConsumable.bind(null, c.id)

                  return (
                    <tr key={c.id} className="hover:bg-paper/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-text text-sm">{c.name}</div>
                        {c.paperDetail && (
                          <div className="text-xs text-muted mt-0.5">
                            {c.paperDetail.weight} g/m² · {c.paperDetail.format} · {c.paperDetail.finish === "MAT" ? "Mat" : "Brillant"}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadge[c.type]}`}>
                          {typeLabels[c.type]}
                        </span>
                      </td>
                      <td className="px-5 py-4 min-w-[180px]">
                        <div className="text-sm font-semibold text-text">
                          {c.currentStock} <span className="font-normal text-muted text-xs">{c.unit}</span>
                        </div>
                        {/* Signature: stock gauge bar */}
                        <div className="mt-1.5 h-1.5 w-28 rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-danger" : "bg-ok"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-muted mt-0.5">seuil {c.minThreshold} {c.unit}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {isLow ? "Critique" : "OK"}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/consumables/${c.id}`}
                              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:text-text hover:bg-paper transition-colors"
                            >
                              <Pencil size={12} />
                              Modifier
                            </Link>
                            {isAdmin && (
                              <form action={archiveAction} className="inline">
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:text-danger hover:bg-red-50 transition-colors"
                                >
                                  <Archive size={12} />
                                  Archiver
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
