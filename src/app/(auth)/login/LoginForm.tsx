"use client"

import { useActionState } from "react"
import { signInAction } from "@/lib/actions/auth"

export default function LoginForm() {
  const [error, action, pending] = useActionState(signInAction, null)

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="label">Adresse email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input mt-1"
          placeholder="admin@imprimerie.local"
        />
      </div>
      <div>
        <label htmlFor="password" className="label">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input mt-1"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center py-2.5">
        {pending ? "Connexion en cours…" : "Se connecter"}
      </button>
    </form>
  )
}
