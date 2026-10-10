"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { movementSchema } from "@/lib/validators"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createMovement(_: unknown, formData: FormData): Promise<string | null> {
  const session = await auth()
  if (!session) return "Non autorisé."

  const parsed = movementSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return parsed.error.issues[0].message

  const { consumableId, quantity, type, referenceCommande } = parsed.data
  const delta = type === "ENTREE" ? quantity : -quantity

  await prisma.$transaction([
    prisma.stockMovement.create({
      data: {
        consumableId,
        userId: session.user.id,
        quantity,
        type,
        referenceCommande: referenceCommande || null,
      },
    }),
    prisma.consumable.update({
      where: { id: consumableId },
      data: { currentStock: { increment: delta } },
    }),
  ])

  revalidatePath("/consumables")
  revalidatePath("/movements")
  redirect("/movements")
}
