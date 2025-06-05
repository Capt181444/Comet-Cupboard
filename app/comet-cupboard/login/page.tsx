"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Package, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/lib/auth-service"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "student"
  const registrationSuccess = searchParams.get("registered") === "true"
  const passwordReset = searchParams.get("passwordReset") === "true"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)

  const validateEmail = (email: string) => {
    // Only validate student emails
    if (userType === "student" && !email.endsWith("@utdallas.edu")) {
      setEmailError("Please use a valid UTD email address (ending with @utdallas.edu)")
      return false
    }
    setEmailError("")
    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Validate email domain for students
    if (userType === "student" && !validateEmail(email)) {
      return
    }

    setLoading(true)

    try {
      const result = await login(email, password, userType)

      if (result.success) {
        setLoginSuccess(true)

        // Route to the appropriate dashboard based on user type after a brief delay
        setTimeout(() => {
          if (userType === "admin") {
            router.push("/comet-cupboard/admin")
          } else {
            router.push("/comet-cupboard/student")
          }
        }, 1000)
      } else {
        // Display a consistent error message for credential failures
        setLoginError("Incorrect user credentials, please try again")
        setLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/comet-cupboard" className="flex items-center gap-2 mb-8">
        <Package className="h-6 w-6 text-[#c75b12]" />
        <span className="font-bold text-xl text-[#154734]">Comet Cupboard</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{userType === "admin" ? "Admin Login" : "Student Login"}</CardTitle>
          <CardDescription>
            {userType === "admin"
              ? "Enter your credentials to access the admin dashboard"
              : "Enter your credentials to access the student portal"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {registrationSuccess && (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Registration successful! You can now log in with your credentials.
                </AlertDescription>
              </Alert>
            )}

            {passwordReset && (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Password reset successful! You can now log in with your new password.
                </AlertDescription>
              </Alert>
            )}

            {loginSuccess && (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Login successful! Redirecting to your dashboard...
                </AlertDescription>
              </Alert>
            )}

            {loginError && (
              <Alert variant="destructive" className="mb-4 border-red-400 bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-700 font-medium ml-2">{loginError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={userType === "admin" ? "admin@utdallas.edu" : "your.email@utdallas.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => userType === "student" && validateEmail(email)}
                required
                disabled={loading || loginSuccess}
              />
              {emailError && (
                <Alert variant="destructive" className="py-2 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{emailError}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/comet-cupboard/forgot-password" className="text-xs text-[#c75b12] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || loginSuccess}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className={`w-full ${userType === "admin" ? "bg-[#154734] hover:bg-[#0d2c20]" : "bg-[#c75b12] hover:bg-[#a84a0f]"}`}
              disabled={loading || loginSuccess}
            >
              {loading ? "Logging in..." : loginSuccess ? "Logged in!" : "Login"}
            </Button>

            <div className="text-center w-full">
              <Link
                href={`/comet-cupboard/login?type=${userType === "admin" ? "student" : "admin"}`}
                className="text-sm text-[#154734] hover:underline"
              >
                {userType === "admin" ? "Student login" : "Admin login"}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-8 text-center text-sm text-gray-600">
        By using this service, you agree to our{" "}
        <Link href="/comet-cupboard/terms" className="text-[#154734] hover:underline">
          Terms of Service
        </Link>
        and{" "}
        <Link href="/comet-cupboard/privacy" className="text-[#154734] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
