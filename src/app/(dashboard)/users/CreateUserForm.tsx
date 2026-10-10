"use client"

import { useActionState, useEffect } from "react"
import { createUser } from "@/lib/actions/users"
import { toast } from "sonner"

export default function CreateUserForm() {
  const [error, formAction, pending] = useActionState(createUser, null)

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="max-w-md">
      <h2 className="font-semibold text-text mb-5">Créer un compte</h2>
      <form action={formAction} className="card p-6 space-y-5">
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input mt-1.5" placeholder="nom@imprimerie.com" />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input name="password" type="password" required minLength={8} className="input mt-1.5" placeholder="••••••••" />
          <p className="text-xs text-muted mt-1">Minimum 8 caractères</p>
        </div>
        <div>
          <label className="label">Rôle</label>
          <select name="role" required className="input mt-1.5">
            <option value="MAGASINIER">Magasinier</option>
            <option value="GESTIONNAIRE">Gestionnaire</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Création…" : "Créer le compte"}
        </button>
      </form>
    </div>
  )
}
