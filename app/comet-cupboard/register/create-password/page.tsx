"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface RegistrationData {
  firstName: string
  lastName: string
  studentId: string
  email: string
}

export default function CreatePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [registrationComplete, setRegistrationComplete] = useState(false)

  // Load registration data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("registrationData")
    if (!storedData) {
      // Redirect back to registration if no data is found
      router.push("/comet-cupboard/register")
      return
    }

    try {
      const parsedData = JSON.parse(storedData) as RegistrationData
      setRegistrationData(parsedData)
    } catch (error) {
      console.error("Error parsing registration data:", error)
      router.push("/comet-cupboard/register")
    }
  }, [router])

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25 // Has uppercase
    if (/[0-9]/.test(password)) strength += 25 // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 25 // Has special char

    setPasswordStrength(strength)
  }, [password])

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Get strength label
  const getStrengthLabel = () => {
    if (passwordStrength <= 25) return "Weak"
    if (passwordStrength <= 50) return "Fair"
    if (passwordStrength <= 75) return "Good"
    return "Strong"
  }

  // Validate passwords
  const validatePasswords = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return false
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter")
      return false
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number")
      return false
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError("Password must contain at least one special character")
      return false
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }

    setPasswordError("")
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) {
      return
    }

    setLoading(true)

    // Simulate account creation
    setTimeout(() => {
      // In a real app, you would send this data to your backend
      console.log("DEMO: Account created with:", {
        ...registrationData,
        password: "********", // Don't log actual password
      })

      // Clear registration data from localStorage
      localStorage.removeItem("registrationData")

      setLoading(false)
      setRegistrationComplete(true)

      // Redirect to login page after showing success message
      setTimeout(() => {
        router.push("/comet-cupboard/login?type=student&registered=true")
      }, 3000)
    }, 2000)
  }

  // If no registration data is available, show loading
  if (!registrationData && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/comet-cupboard" className="flex items-center gap-2 mb-8">
        <Package className="h-6 w-6 text-[#c75b12]" />
        <span className="font-bold text-xl text-[#154734]">Comet Cupboard</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Password</CardTitle>
          <CardDescription>Set a secure password for your Comet Cupboard account</CardDescription>
        </CardHeader>

        {registrationComplete ? (
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Registration Complete!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your account has been created successfully. You will be redirected to the login page.
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {registrationData && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600">Almost there, {registrationData.firstName}!</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <p>Create a secure password to complete your registration.</p>
                    <p className="mt-1 text-xs">(Demo mode: No actual account will be created)</p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Password strength:</span>
                    <span className={passwordStrength > 75 ? "text-green-600" : "text-gray-500"}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <Progress value={passwordStrength} className="h-1" indicatorClassName={getStrengthColor()} />
                </div>

                <div className="text-xs space-y-1 mt-2">
                  <p className={password.length >= 8 ? "text-green-600" : "text-gray-500"}>✓ At least 8 characters</p>
                  <p className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}>
                    ✓ At least one uppercase letter
                  </p>
                  <p className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-500"}>✓ At least one number</p>
                  <p className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-gray-500"}>
                    ✓ At least one special character
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {password && confirmPassword && (
                  <p className={password === confirmPassword ? "text-green-600 text-xs" : "text-red-500 text-xs"}>
                    {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {passwordError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-[#c75b12] hover:bg-[#a84a0f]" disabled={loading}>
                {loading ? "Creating Account..." : "Complete Registration"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
