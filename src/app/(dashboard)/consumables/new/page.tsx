import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createConsumable } from "@/lib/actions/consumables"
import ConsumableForm from "../ConsumableForm"

export default async function NewConsumablePage() {
  const session = await auth()
  if (session?.user.role === "MAGASINIER") redirect("/consumables")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nouveau consommable</h1>
      <ConsumableForm action={createConsumable} />
    </div>
  )
}
