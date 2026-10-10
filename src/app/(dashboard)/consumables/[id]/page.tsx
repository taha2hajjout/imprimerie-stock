import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { updateConsumable } from "@/lib/actions/consumables"
import ConsumableForm from "../ConsumableForm"

export default async function EditConsumablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [session, consumable] = await Promise.all([
    auth(),
    prisma.consumable.findUnique({
      where: { id, deletedAt: null },
      include: { paperDetail: true },
    }),
  ])

  if (!consumable) notFound()
  if (session?.user.role === "MAGASINIER") redirect("/consumables")

  return (
    <div className="space-y-6">
      <h1 className="page-title">Modifier — {consumable.name}</h1>
      <ConsumableForm action={updateConsumable} initialData={consumable} />
    </div>
  )
}
