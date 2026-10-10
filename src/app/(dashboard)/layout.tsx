import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"
import { MainContent } from "@/components/layout/MainContent"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex h-full">
      <Sidebar role={session.user.role} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header user={session.user} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  )
}
