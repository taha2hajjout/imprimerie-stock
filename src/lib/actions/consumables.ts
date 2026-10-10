"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { consumableSchema } from "@/lib/validators"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createConsumable(_: unknown, formData: FormData): Promise<string | null> {
  const session = await auth()
  if (!session || session.user.role === "MAGASINIER") return "Accès refusé."

  const raw = Object.fromEntries(formData)
  const isPaper = raw.type === "PAPIER"
  const parsed = consumableSchema.safeParse(
    isPaper ? raw : { ...raw, weight: undefined, format: undefined, finish: undefined }
  )
  if (!parsed.success) return parsed.error.issues[0].message

  const { name, type, unit, currentStock, minThreshold, weight, format, finish } = parsed.data

  await prisma.consumable.create({
    data: {
      name, type, unit, currentStock, minThreshold,
      ...(isPaper && weight && format && finish
        ? { paperDetail: { create: { weight, format, finish } } }
        : {}),
    },
  })

  revalidatePath("/consumables")
  redirect("/consumables")
}

export async function updateConsumable(_: unknown, formData: FormData): Promise<string | null> {
  const session = await auth()
  if (!session || session.user.role === "MAGASINIER") return "Accès refusé."

  const id = formData.get("id") as string
  if (!id) return "ID manquant."

  const raw = Object.fromEntries(formData)
  const isPaper = raw.type === "PAPIER"
  const parsed = consumableSchema.safeParse(
    isPaper ? raw : { ...raw, weight: undefined, format: undefined, finish: undefined }
  )
  if (!parsed.success) return parsed.error.issues[0].message

  const { name, type, unit, currentStock, minThreshold, weight, format, finish } = parsed.data

  const existing = await prisma.consumable.findUnique({
    where: { id },
    select: { paperDetail: { select: { id: true } } },
  })

  await prisma.consumable.update({
    where: { id },
    data: {
      name, type, unit, currentStock, minThreshold,
      paperDetail:
        isPaper && weight && format && finish
          ? { upsert: { create: { weight, format, finish }, update: { weight, format, finish } } }
          : existing?.paperDetail
          ? { delete: true }
          : undefined,
    },
  })

  revalidatePath("/consumables")
  redirect("/consumables")
}

export async function archiveConsumable(id: string): Promise<void> {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Accès refusé.")

  await prisma.consumable.update({ where: { id }, data: { deletedAt: new Date() } })
  revalidatePath("/consumables")
}
