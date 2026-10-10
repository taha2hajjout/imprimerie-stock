import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { archiveConsumable } from "@/lib/actions/consumables"
import Link from "next/link"

const typeLabels: Record<string, string> = {
  PAPIER: "Papier", ENCRE: "Encre", PLAQUE: "Plaque", DIVERS: "Divers",
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
        <h1 className="text-2xl font-bold text-gray-900">Consommables</h1>
        {canEdit && (
          <Link href="/consumables/new" className="btn-primary">
            + Nouveau consommable
          </Link>
        )}
      </div>

      <div className="card overflow-hidden">
        {consumables.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">
            Aucun consommable.{" "}
            {canEdit && <Link href="/consumables/new" className="text-indigo-600 hover:underline">Créez-en un.</Link>}
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Nom", "Type", "Stock actuel", "Seuil min.", "Statut", canEdit ? "Actions" : ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {consumables.map((c) => {
                const isLow = c.currentStock <= c.minThreshold
                const archiveAction = archiveConsumable.bind(null, c.id)
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{c.name}</div>
                      {c.paperDetail && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {c.paperDetail.weight}g · {c.paperDetail.format} · {c.paperDetail.finish}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{typeLabels[c.type]}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.currentStock} {c.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {c.minThreshold} {c.unit}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isLow ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isLow ? "⚠ Critique" : "✓ OK"}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-sm flex items-center gap-3">
                        <Link href={`/consumables/${c.id}`} className="text-indigo-600 hover:underline">
                          Modifier
                        </Link>
                        {isAdmin && (
                          <form action={archiveAction} className="inline">
                            <button type="submit" className="text-red-500 hover:underline text-sm">
                              Archiver
                            </button>
                          </form>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
