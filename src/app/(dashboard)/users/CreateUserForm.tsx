"use client"

import { useActionState } from "react"
import { createUser } from "@/lib/actions/users"

export default function CreateUserForm() {
  const [error, formAction, pending] = useActionState(createUser, null)

  return (
    <form action={formAction} className="card p-6 space-y-4 max-w-md">
      <h2 className="font-semibold text-gray-900">Créer un utilisateur</h2>

      <div>
        <label className="label">Email</label>
        <input name="email" type="email" required className="input mt-1" />
      </div>
      <div>
        <label className="label">Mot de passe</label>
        <input name="password" type="password" required minLength={8} className="input mt-1" />
        <p className="text-xs text-gray-400 mt-1">Minimum 8 caractères</p>
      </div>
      <div>
        <label className="label">Rôle</label>
        <select name="role" required className="input mt-1">
          <option value="MAGASINIER">Magasinier</option>
          <option value="GESTIONNAIRE">Gestionnaire</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Création…" : "Créer l'utilisateur"}
      </button>
    </form>
  )
}
