import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await hash("Admin123!", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@imprimerie.local" },
    update: {},
    create: { email: "admin@imprimerie.local", password, role: "ADMIN" },
  })
  console.log(`Admin créé : ${admin.email}`)

  // Sample consumables
  await prisma.consumable.upsert({
    where: { id: "seed-papier-a4-80" },
    update: {},
    create: {
      id: "seed-papier-a4-80",
      name: "Papier A4 80g",
      type: "PAPIER",
      unit: "ramettes",
      currentStock: 50,
      minThreshold: 10,
      paperDetail: { create: { weight: 80, format: "A4", finish: "MAT" } },
    },
  })

  await prisma.consumable.upsert({
    where: { id: "seed-encre-cyan" },
    update: {},
    create: {
      id: "seed-encre-cyan",
      name: "Encre Cyan HP",
      type: "ENCRE",
      unit: "cartouches",
      currentStock: 3,
      minThreshold: 5,
    },
  })

  console.log("Données de démo insérées.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
