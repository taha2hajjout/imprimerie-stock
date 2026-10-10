"use client"

import { useActionState, useEffect } from "react"
import { signInAction } from "@/lib/actions/auth"
import { toast } from "sonner"

export default function LoginForm() {
  const [error, action, pending] = useActionState(signInAction, null)

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

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
          className="input mt-1.5"
          placeholder="votre@email.com"
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
          className="input mt-1.5"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center py-2.5 mt-1">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  )
}
