"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Package, AlertCircle, CheckCircle, Mail, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { generateResetPasscode, verifyResetPasscode } from "@/lib/auth-service"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "student"

  const [step, setStep] = useState(1) // Step 1: Email entry, Step 2: Passcode verification
  const [email, setEmail] = useState("")
  const [passcode, setPasscode] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passcodeError, setPasscodeError] = useState("")
  const [passcodeSuccess, setPasscodeSuccess] = useState(false)
  const [generatedPasscode, setGeneratedPasscode] = useState("")
  const [passcodeTimer, setPasscodeTimer] = useState(0)

  // Validate email domain
  const validateEmail = (email: string) => {
    if (userType === "student" && !email.endsWith("@utdallas.edu")) {
      setEmailError("Please use a valid UTD email address (ending with @utdallas.edu)")
      return false
    }
    setEmailError("")
    return true
  }

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email domain for students
    if (userType === "student" && !validateEmail(email)) {
      return
    }

    setLoading(true)

    try {
      const result = await generateResetPasscode(email)

      if (result.success) {
        // For demo purposes, store the passcode
        if (result.passcode) {
          setGeneratedPasscode(result.passcode)
        }

        setStep(2)
      } else {
        setEmailError(result.message)
      }
    } catch (error) {
      console.error("Password reset error:", error)
      setEmailError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle passcode verification
  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    try {
      const result = await verifyResetPasscode(email, passcode)

      if (result.success) {
        setPasscodeSuccess(true)
        setPasscodeError("")

        // Store email and passcode for the reset page
        localStorage.setItem("resetEmail", email)
        localStorage.setItem("resetPasscode", passcode)

        // Redirect to reset password page after a brief delay
        setTimeout(() => {
          router.push("/comet-cupboard/reset-password")
        }, 1500)
      } else {
        setPasscodeError(result.message)
        setPasscodeSuccess(false)
      }
    } catch (error) {
      console.error("Passcode verification error:", error)
      setPasscodeError("An unexpected error occurred. Please try again.")
      setPasscodeSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  // Handle resend passcode
  const handleResendPasscode = async () => {
    setLoading(true)

    try {
      const result = await generateResetPasscode(email)

      if (result.success && result.passcode) {
        setGeneratedPasscode(result.passcode)
      } else {
        setPasscodeError(result.message)
      }
    } catch (error) {
      console.error("Resend passcode error:", error)
      setPasscodeError("An unexpected error occurred. Please try again.")
    } finally {
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your email to receive a password reset code" : "Enter the passcode sent to your email"}
          </CardDescription>
        </CardHeader>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={userType === "admin" ? "admin@utdallas.edu" : "your.email@utdallas.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => userType === "student" && validateEmail(email)}
                  required
                  disabled={loading}
                />
                {emailError && (
                  <Alert variant="destructive" className="py-2 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{emailError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-[#c75b12] hover:bg-[#a84a0f]" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-sm"
                onClick={() => router.push(`/comet-cupboard/login?type=${userType}`)}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handlePasscodeSubmit}>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-600">Check your email</AlertTitle>
                <AlertDescription className="text-blue-700">
                  We've sent a 6-digit passcode to {email}. Enter it below to continue.
                </AlertDescription>
              </Alert>

              {/* DEMO ONLY: Display passcode on screen */}
              <Alert className="bg-yellow-50 border-yellow-200 mb-4">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-600">Demo Mode</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <p>This is a demonstration only. In a real application, the passcode would be sent to your email.</p>
                  <p className="mt-2 font-mono bg-gray-100 p-2 rounded text-center text-lg">
                    Your passcode: <span className="font-bold">{generatedPasscode}</span>
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="passcode">Passcode</Label>
                <Input
                  id="passcode"
                  placeholder="Enter 6-digit passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  maxLength={6}
                  required
                  disabled={loading || passcodeSuccess}
                />
                {passcodeError && (
                  <Alert variant="destructive" className="py-2 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passcodeError}</AlertDescription>
                  </Alert>
                )}
                {passcodeSuccess && (
                  <Alert className="bg-green-50 border-green-200 py-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">Passcode verified successfully!</AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Didn't receive the passcode?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendPasscode}
                  disabled={loading || passcodeSuccess}
                  className="text-sm"
                >
                  {loading ? "Sending..." : "Resend Passcode"}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#c75b12] hover:bg-[#a84a0f]"
                disabled={loading || passcodeSuccess}
              >
                {passcodeSuccess ? "Redirecting..." : "Verify Passcode"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-sm"
                onClick={() => setStep(1)}
                disabled={loading || passcodeSuccess}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Email Entry
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
