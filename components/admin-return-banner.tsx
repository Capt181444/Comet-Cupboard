"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isImpersonating, returnToAdmin } from "@/lib/auth-service"

export function AdminReturnBanner() {
  const router = useRouter()
  const [showBanner, setShowBanner] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if admin is impersonating a user
    setShowBanner(isImpersonating())
  }, [])

  const handleReturnToAdmin = async () => {
    setLoading(true)
    try {
      const result = await returnToAdmin()
      if (result.success) {
        router.push("/comet-cupboard/admin/users")
      }
    } catch (error) {
      console.error("Error returning to admin:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!showBanner) return null

  return (
    <div className="bg-[#154734] text-white py-2 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4" />
        <span className="text-sm">You are viewing as a student (Admin Mode)</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-white border-white hover:bg-[#0d2c20] hover:text-white"
        onClick={handleReturnToAdmin}
        disabled={loading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {loading ? "Returning..." : "Return to Admin"}
      </Button>
    </div>
  )
}
