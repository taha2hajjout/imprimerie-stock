import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

export const consumableSchema = z.object({
  name: z.string().min(1, "Nom requis").max(255),
  type: z.enum(["PAPIER", "ENCRE", "PLAQUE", "DIVERS"]),
  unit: z.string().min(1, "Unité requise").max(50),
  currentStock: z.coerce.number().min(0, "Stock doit être ≥ 0"),
  minThreshold: z.coerce.number().min(0, "Seuil doit être ≥ 0"),
  weight: z.coerce.number().int().positive().optional(),
  format: z.enum(["A4", "A3", "BOBINE"]).optional(),
  finish: z.enum(["MAT", "BRILLANT"]).optional(),
})

export const movementSchema = z.object({
  consumableId: z.string().min(1, "Produit requis"),
  quantity: z.coerce.number().positive("Quantité doit être > 0"),
  type: z.enum(["ENTREE", "SORTIE", "GACHE"]),
  referenceCommande: z.string().max(255).optional(),
})

export const createUserSchema = z.object({
  email: z.string().email("Email invalide").max(255),
  password: z.string().min(8, "Minimum 8 caractères").max(128),
  role: z.enum(["ADMIN", "GESTIONNAIRE", "MAGASINIER"]),
})
