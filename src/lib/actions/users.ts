"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validators"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createUser(_: unknown, formData: FormData): Promise<string | null> {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return "Accès refusé."

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return parsed.error.issues[0].message

  const { email, password, role } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return "Un utilisateur avec cet email existe déjà."

  const hashed = await hash(password, 12)
  await prisma.user.create({ data: { email, password: hashed, role } })

  revalidatePath("/users")
  redirect("/users")
}

export async function deleteUser(id: string): Promise<void> {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Accès refusé.")
  if (session.user.id === id) throw new Error("Impossible de supprimer votre propre compte.")

  await prisma.user.delete({ where: { id } })
  revalidatePath("/users")
}
