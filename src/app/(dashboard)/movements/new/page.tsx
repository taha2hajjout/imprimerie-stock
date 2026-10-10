import { prisma } from "@/lib/prisma"
import MovementForm from "./MovementForm"

export default async function NewMovementPage() {
  const consumables = await prisma.consumable.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, unit: true, currentStock: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="page-title">Saisir un mouvement</h1>
      <MovementForm consumables={consumables} />
    </div>
  )
}
