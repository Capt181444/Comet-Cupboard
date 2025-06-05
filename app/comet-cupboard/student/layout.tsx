import type React from "react"
import { AdminReturnBanner } from "@/components/admin-return-banner"

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AdminReturnBanner />
      {children}
    </>
  )
}
