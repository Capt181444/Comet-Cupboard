"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, AlertCircle, CheckCircle, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // Step 1: Initial form, Step 2: Passcode verification

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [email, setEmail] = useState("")
  const [passcode, setPasscode] = useState("")

  // Validation and status
  const [emailError, setEmailError] = useState("")
  const [passcodeError, setPasscodeError] = useState("")
  const [passcodeSuccess, setPasscodeSuccess] = useState(false)
  const [passcodeGenerated, setPasscodeGenerated] = useState(false)
  const [generatedPasscode, setGeneratedPasscode] = useState("")
  const [passcodeTimer, setPasscodeTimer] = useState(0)

  // Validate email domain
  const validateEmail = (email: string) => {
    if (!email.endsWith("@utdallas.edu")) {
      setEmailError("Please use a valid UTD email address (ending with @utdallas.edu)")
      return false
    }
    setEmailError("")
    return true
  }

  // Generate a random 6-digit passcode
  const generatePasscode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedPasscode(code)
    setPasscodeGenerated(true)
    setPasscodeTimer(300) // 5 minutes in seconds
    return code
  }

  // Handle initial form submission
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email domain
    if (!validateEmail(email)) {
      return
    }

    setLoading(true)

    // Simulate sending passcode to email
    setTimeout(() => {
      const code = generatePasscode()
      console.log(`DEMO: Passcode generated: ${code}`) // For demo purposes
      setLoading(false)
      setStep(2)
    }, 1500)
  }

  // Handle passcode verification
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault()

    if (passcode === generatedPasscode) {
      setPasscodeError("")
      setPasscodeSuccess(true)

      // Store registration data in localStorage for the next step
      const registrationData = {
        firstName,
        lastName,
        studentId,
        email,
      }
      localStorage.setItem("registrationData", JSON.stringify(registrationData))

      // Redirect to password creation page after a brief delay
      setTimeout(() => {
        router.push("/comet-cupboard/register/create-password")
      }, 1500)
    } else {
      setPasscodeError("Invalid passcode. Please try again.")
      setPasscodeSuccess(false)
    }
  }

  // Resend passcode
  const handleResendPasscode = () => {
    setLoading(true)
    setTimeout(() => {
      const code = generatePasscode()
      console.log(`DEMO: New passcode generated: ${code}`) // For demo purposes
      setLoading(false)
    }, 1500)
  }

  // Countdown timer for passcode expiration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (passcodeGenerated && passcodeTimer > 0) {
      interval = setInterval(() => {
        setPasscodeTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (passcodeTimer === 0 && passcodeGenerated) {
      // Passcode expired
      setGeneratedPasscode("")
      setPasscodeGenerated(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [passcodeGenerated, passcodeTimer])

  // Format timer as MM:SS
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/comet-cupboard" className="flex items-center gap-2 mb-8">
        <Package className="h-6 w-6 text-[#c75b12]" />
        <span className="font-bold text-xl text-[#154734]">Comet Cupboard</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            {step === 1 ? "Register to access the Comet Cupboard services" : "Enter the passcode sent to your email"}
          </CardDescription>
        </CardHeader>

        {step === 1 ? (
          <form onSubmit={handleInitialSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  placeholder="UTD Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">UTD Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your.email@utdallas.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail(email)}
                  required
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
                {loading ? "Sending Passcode..." : "Continue"}
              </Button>
              <div className="text-center w-full">
                <span className="text-sm text-gray-500">Already have an account? </span>
                <Link href="/comet-cupboard/login?type=student" className="text-sm text-[#c75b12] hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyPasscode}>
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

              {passcodeGenerated && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Passcode expires in <span className="font-medium">{formatTimer(passcodeTimer)}</span>
                  </p>
                </div>
              )}

              <Separator />

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Didn't receive the passcode?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendPasscode}
                  disabled={loading || (passcodeTimer > 0 && passcodeGenerated)}
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
                Back to Registration
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <p className="mt-8 text-center text-sm text-gray-600">
        By registering, you agree to our{" "}
        <Link href="/comet-cupboard/terms" className="text-[#154734] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/comet-cupboard/privacy" className="text-[#154734] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
