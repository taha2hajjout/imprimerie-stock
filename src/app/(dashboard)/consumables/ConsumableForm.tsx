"use client"

import { useActionState, useState } from "react"
import Link from "next/link"

interface InitialData {
  id: string
  name: string
  type: string
  unit: string
  currentStock: number
  minThreshold: number
  paperDetail?: { weight: number; format: string; finish: string } | null
}

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<string | null>
  initialData?: InitialData
}

export default function ConsumableForm({ action, initialData }: Props) {
  const [error, formAction, pending] = useActionState(action, null)
  const [type, setType] = useState(initialData?.type ?? "PAPIER")
  const isEdit = !!initialData

  return (
    <form action={formAction} className="card p-6 space-y-5 max-w-2xl">
      {isEdit && <input type="hidden" name="id" value={initialData.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Nom du produit</label>
          <input name="name" type="text" required className="input mt-1" defaultValue={initialData?.name} />
        </div>

        <div>
          <label className="label">Type</label>
          <select
            name="type"
            className="input mt-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="PAPIER">Papier</option>
            <option value="ENCRE">Encre</option>
            <option value="PLAQUE">Plaque</option>
            <option value="DIVERS">Divers</option>
          </select>
        </div>

        <div>
          <label className="label">Unité</label>
          <input name="unit" type="text" required placeholder="ex: ramettes, litres, unités" className="input mt-1" defaultValue={initialData?.unit} />
        </div>

        <div>
          <label className="label">Stock actuel</label>
          <input name="currentStock" type="number" min="0" step="0.01" required className="input mt-1" defaultValue={initialData?.currentStock ?? 0} />
        </div>

        <div>
          <label className="label">Seuil d'alerte</label>
          <input name="minThreshold" type="number" min="0" step="0.01" required className="input mt-1" defaultValue={initialData?.minThreshold ?? 0} />
        </div>
      </div>

      {type === "PAPIER" && (
        <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
          <legend className="text-sm font-semibold text-gray-700 px-1">Détails papier</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Grammage (g/m²)</label>
              <input name="weight" type="number" min="1" className="input mt-1" defaultValue={initialData?.paperDetail?.weight} />
            </div>
            <div>
              <label className="label">Format</label>
              <select name="format" className="input mt-1" defaultValue={initialData?.paperDetail?.format}>
                <option value="">— Choisir —</option>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="BOBINE">Bobine</option>
              </select>
            </div>
            <div>
              <label className="label">Finition</label>
              <select name="finish" className="input mt-1" defaultValue={initialData?.paperDetail?.finish}>
                <option value="">— Choisir —</option>
                <option value="MAT">Mat</option>
                <option value="BRILLANT">Brillant</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {error && <p className="form-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le consommable"}
        </button>
        <Link href="/consumables" className="btn-secondary">Annuler</Link>
      </div>
    </form>
  )
}
