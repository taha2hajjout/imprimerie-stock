"use client"

import { useActionState } from "react"
import { createMovement } from "@/lib/actions/movements"
import Link from "next/link"

interface Consumable {
  id: string
  name: string
  unit: string
  currentStock: number
}

export default function MovementForm({ consumables }: { consumables: Consumable[] }) {
  const [error, formAction, pending] = useActionState(createMovement, null)

  return (
    <form action={formAction} className="card p-6 space-y-5 max-w-lg">
      <div>
        <label className="label">Produit</label>
        <select name="consumableId" required className="input mt-1">
          <option value="">— Sélectionner un produit —</option>
          {consumables.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (stock: {c.currentStock} {c.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Type de mouvement</label>
          <select name="type" required className="input mt-1">
            <option value="ENTREE">Entrée (livraison)</option>
            <option value="SORTIE">Sortie (production)</option>
            <option value="GACHE">Gâche</option>
          </select>
        </div>
        <div>
          <label className="label">Quantité</label>
          <input name="quantity" type="number" min="0.01" step="0.01" required className="input mt-1" placeholder="0" />
        </div>
      </div>

      <div>
        <label className="label">Référence commande <span className="text-gray-400 font-normal">(optionnel)</span></label>
        <input name="referenceCommande" type="text" className="input mt-1" placeholder="ex: CMD-2024-001" />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Enregistrement…" : "Enregistrer le mouvement"}
        </button>
        <Link href="/movements" className="btn-secondary">Annuler</Link>
      </div>
    </form>
  )
}
