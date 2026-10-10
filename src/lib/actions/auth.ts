"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function signInAction(_: unknown, formData: FormData): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
    return null
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") return "Email ou mot de passe incorrect."
      return "Une erreur s'est produite. Réessayez."
    }
    throw error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" })
}
