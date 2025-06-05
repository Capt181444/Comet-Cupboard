"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Package, ShoppingCart, User, MapPin, AlertCircle, Info } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { logout } from "@/lib/auth-service"

// Check if current time is after 4:30 PM
const isAfterCutoffTime = () => {
  const now = new Date()
  const cutoffHour = 16 // 4 PM in 24-hour format
  const cutoffMinute = 30

  return now.getHours() > cutoffHour || (now.getHours() === cutoffHour && now.getMinutes() >= cutoffMinute)
}

// Get the default date for pickup (today or tomorrow if after cutoff)
const getDefaultPickupDate = () => {
  const today = new Date()

  // If it's after 4:30 PM, default to tomorrow
  if (isAfterCutoffTime()) {
    today.setDate(today.getDate() + 1)
  }

  return today.toISOString().split("T")[0]
}

// Calculate time remaining until pickup
const getTimeRemaining = () => {
  const pickupDate = new Date(currentPickup.date)
  const [hour, minute] = currentPickup.time.split(":")[0].split(" ")[0].split(":")
  const isPM = currentPickup.time.includes("PM")

  // Convert to 24-hour format
  let hourNum = Number.parseInt(hour)
  if (isPM && hourNum !== 12) hourNum += 12
  if (!isPM && hourNum === 12) hourNum = 0

  pickupDate.setHours(hourNum, Number.parseInt(minute), 0, 0)

  const now = new Date()
  const diff = pickupDate.getTime() - now.getTime()

  if (diff <= 0) return "Pickup time has passed"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours > 1 ? "s" : ""}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes > 1 ? "s" : ""}`
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  }
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// Update the mock data to use the current date
const currentPickup = {
  id: "pickup-001",
  orderNumber: "CC-234567",
  date: getDefaultPickupDate(),
  time: "3:00 PM",
  location: "800 W. Campbell Road, FO16, Richardson, Texas 75080-3021",
  status: "scheduled",
  items: [
    {
      id: "laundry-pods",
      name: "Laundry Pods",
      description: "Concentrated detergent pods, 16 count",
      image: "/images/laundry-detergent.png",
      category: "household",
      quantity: 1,
    },
    {
      id: "toilet-paper",
      name: "Toilet Paper",
      description: "4-pack toilet paper rolls",
      image: "/images/toilet-paper.png",
      category: "household",
      quantity: 1,
    },
    {
      id: "shampoo",
      name: "Shampoo",
      description: "All hair types, 12.6oz bottle",
      image: "/images/shampoo.png",
      category: "hygiene",
      quantity: 1,
    },
    {
      id: "soap",
      name: "Soap Bars",
      description: "Pack of 3 bars",
      image: "/images/soap.png",
      category: "hygiene",
      quantity: 1,
    },
  ],
}

export default function SchedulePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining())
  const [isAfterCutoff, setIsAfterCutoff] = useState(isAfterCutoffTime())

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isStudent = localStorage.getItem("userType") === "student"

      if (!isStudent) {
        router.push("/comet-cupboard/login?type=student")
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    // Check cutoff time on component mount and every minute
    const checkCutoffTime = () => {
      setIsAfterCutoff(isAfterCutoffTime())
    }

    // Check immediately
    checkCutoffTime()

    // Set up interval to check every minute
    const interval = setInterval(checkCutoffTime, 60000)

    return () => clearInterval(interval)
  }, [])

  // Update time remaining every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/comet-cupboard")
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // If not authenticated, this will redirect, but we'll return null just in case
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/comet-cupboard" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-[#c75b12]" />
            <span className="font-bold text-[#154734]">Comet Cupboard</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/comet-cupboard/student" className="text-sm font-medium text-gray-600 hover:text-[#154734]">
              Browse Items
            </Link>
            <Link
              href="/comet-cupboard/student/requests"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              My Requests
            </Link>
            <Link href="/comet-cupboard/student/schedule" className="text-sm font-medium text-[#154734]">
              Schedule Pickup
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/comet-cupboard/student/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>My Requests</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#154734]">Scheduled Pickup</h1>
            <p className="text-gray-600">View your upcoming pickup details</p>
          </div>
        </div>

        {isAfterCutoff && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-600">Order Cutoff Time</AlertTitle>
            <AlertDescription className="text-amber-700">
              It is currently after 4:30 PM. Any orders placed now will be scheduled for pickup tomorrow.
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              Order #{currentPickup.orderNumber}
              <Badge className="bg-amber-500 ml-2">Scheduled</Badge>
            </CardTitle>
            <CardDescription>Please bring your student ID for pickup verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-[#c75b12]" />
                  <h3 className="font-medium">Pickup Date</h3>
                </div>
                <p className="text-gray-700 font-semibold">{formatDate(currentPickup.date)}</p>
                {isAfterCutoff && new Date(currentPickup.date).toDateString() === new Date().toDateString() && (
                  <p className="text-xs text-amber-600 mt-1">
                    This pickup is scheduled for today. Please arrive before closing time.
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-[#c75b12]" />
                  <h3 className="font-medium">Pickup Time</h3>
                </div>
                <p className="text-gray-700 font-semibold">{currentPickup.time}</p>
                <p className="text-xs text-gray-500 mt-1">Pickup hours: Monday-Friday, 12:00 PM - 5:00 PM</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-[#c75b12]" />
                  <h3 className="font-medium">Pickup Location</h3>
                </div>
                <p className="text-gray-700">{currentPickup.location}</p>
              </div>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-600">Time Remaining</AlertTitle>
              <AlertDescription className="text-amber-700">
                Your pickup is in {timeRemaining}. Please arrive on time as orders not picked up within 30 minutes of
                the scheduled time will be automatically cancelled.
              </AlertDescription>
            </Alert>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Items for Pickup ({currentPickup.items.length})</span>
                </div>
              </div>

              <div className="divide-y">
                {currentPickup.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="h-16 w-16 relative rounded-md overflow-hidden bg-gray-100">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-gray-50 p-4">
            <Button variant="outline" onClick={() => router.push("/comet-cupboard/student/requests")}>
              View All Requests
            </Button>
            <Button className="bg-[#c75b12] hover:bg-[#a84a0f]" onClick={() => router.push("/comet-cupboard/student")}>
              Browse More Items
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} UTD Comet Cupboard. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/comet-cupboard/privacy" className="text-[#154734] hover:underline">
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/comet-cupboard/terms" className="text-[#154734] hover:underline">
              Terms of Service
            </Link>
            {" • "}
            <Link href="/comet-cupboard/contact" className="text-[#154734] hover:underline">
              Contact
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
