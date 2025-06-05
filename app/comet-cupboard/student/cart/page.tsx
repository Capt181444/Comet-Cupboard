"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, Calendar, Minus, Package, Plus, Trash2, User } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { logout } from "@/lib/auth-service"
import { useCart } from "@/lib/cart-context"
import { Progress } from "@/components/ui/progress"

export default function CartPage() {
  const router = useRouter()
  const { cartItems, updateQuantity, removeItem, clearCart, canPlaceOrder, recordOrderPlaced } = useCart()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationDetails, setConfirmationDetails] = useState({
    date: "",
    time: "",
    orderNumber: "",
  })
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Array<{ value: string; label: string }>>([])

  // Check if the user can place an order
  const orderEligibility = canPlaceOrder()

  // Generate available date (only today)
  const getAvailableDates = () => {
    const currentDate = new Date()

    // Format today's date
    const today = {
      value: currentDate.toISOString().split("T")[0],
      label: currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    }

    return [today]
  }

  // Generate available time slots (12pm-4:30pm in 30-minute increments)
  // Filter out times that have already passed
  const getAvailableTimeSlots = () => {
    const slots = []
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    for (let hour = 12; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip 5:00 PM (only include up to 4:30 PM)
        if (hour === 16 && minute > 30) continue

        // Skip times that have already passed
        if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
          continue
        }

        const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
        const period = hour >= 12 ? "PM" : "AM"
        const minuteFormatted = minute === 0 ? "00" : minute

        slots.push({
          value: `${hour}:${minuteFormatted}`,
          label: `${hourFormatted}:${minuteFormatted} ${period}`,
        })
      }
    }
    return slots
  }

  const availableDates = getAvailableDates()

  // Update available time slots whenever the component renders or time changes
  useEffect(() => {
    // Update time slots every minute
    const updateTimeSlots = () => {
      setAvailableTimeSlots(getAvailableTimeSlots())
    }

    // Initial update
    updateTimeSlots()

    // Set interval to update every minute
    const interval = setInterval(updateTimeSlots, 60000)

    // Clear interval on component unmount
    return () => clearInterval(interval)
  }, [])

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

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    if (!pickupDate || !pickupTime) {
      alert("Please select a pickup date and time")
      return
    }

    // Check if the user can place an order
    if (!orderEligibility.allowed) {
      alert("You can only place one order per week. Please try again next week.")
      return
    }

    // Generate a random order number
    const orderNumber = `CC-${Math.floor(100000 + Math.random() * 900000)}`

    // Format the selected time for display
    const [hour, minute] = pickupTime.split(":")
    const hourNum = Number.parseInt(hour)
    const formattedTime = `${hourNum > 12 ? hourNum - 12 : hourNum}:${minute} ${hourNum >= 12 ? "PM" : "AM"}`

    // Set confirmation details
    setConfirmationDetails({
      date: new Date(pickupDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      time: formattedTime,
      orderNumber: orderNumber,
    })

    // Record that an order has been placed
    recordOrderPlaced()

    // Show confirmation dialog
    setShowConfirmation(true)
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    clearCart()
    router.push("/comet-cupboard/student")
  }

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

  // Check if there are any available time slots
  const noAvailableTimeSlots = availableTimeSlots.length === 0

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
            <Link href="/comet-cupboard/student/cart" className="text-sm font-medium text-[#154734]">
              My Cart
            </Link>
          </div>

          <div className="flex items-center gap-4">
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
            <h1 className="text-2xl font-bold text-[#154734]">My Cart</h1>
            <p className="text-gray-600">Review your items and schedule pickup</p>
          </div>
        </div>

        {!orderEligibility.allowed && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Weekly Order Limit Reached</AlertTitle>
            <AlertDescription>
              You can only place one order per week. Your next available order date is{" "}
              {orderEligibility.nextOrderDate?.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              .
            </AlertDescription>
          </Alert>
        )}

        {noAvailableTimeSlots && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Available Pickup Times Today</AlertTitle>
            <AlertDescription>
              There are no more available pickup times for today. The Comet Cupboard is open until 4:30 PM. Please check
              back tomorrow.
            </AlertDescription>
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Card className="mb-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Browse items to add them to your cart</p>
              <Button
                className="bg-[#c75b12] hover:bg-[#a84a0f]"
                onClick={() => router.push("/comet-cupboard/student")}
              >
                Browse Items
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Cart Items ({totalItems})</CardTitle>
                  <CardDescription>Review and adjust your requested items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                        <div className="h-20 w-20 relative rounded-md overflow-hidden bg-gray-100">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, Math.min(item.limit, item.quantity + 1))}
                                disabled={item.quantity >= item.limit}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Badge variant="outline">Limit: {item.limit}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/comet-cupboard/student")}>
                    Continue Shopping
                  </Button>
                  <Button variant="destructive" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Schedule Pickup</CardTitle>
                  <CardDescription>Select a date and time for pickup</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Date</label>
                    <Select value={pickupDate} onValueChange={setPickupDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map((date) => (
                          <SelectItem key={date.value} value={date.value}>
                            {date.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Time</label>
                    <Select value={pickupTime} onValueChange={setPickupTime} disabled={noAvailableTimeSlots}>
                      <SelectTrigger>
                        <SelectValue placeholder={noAvailableTimeSlots ? "No times available" : "Select time"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Pickup available today only, 12:00 PM - 4:30 PM
                      {noAvailableTimeSlots ? " (No more times available today)" : ""}
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Order Summary</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Total Items:</span>
                        <span>{totalItems}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Item Limit:</span>
                        <span>{totalItems}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Item Limit Usage</span>
                      <span>{totalItems}/5</span>
                    </div>
                    <Progress
                      value={(totalItems / 5) * 100}
                      className="h-2"
                      indicatorClassName={totalItems >= 5 ? "bg-red-500" : "bg-[#c75b12]"}
                    />
                  </div>

                  <Separator />

                  <div className="pt-2">
                    <Button
                      className="w-full bg-[#c75b12] hover:bg-[#a84a0f]"
                      onClick={handleCheckout}
                      disabled={!orderEligibility.allowed || noAvailableTimeSlots || !pickupDate || !pickupTime}
                    >
                      Complete Request
                    </Button>
                    {!orderEligibility.allowed && (
                      <p className="text-xs text-red-500 mt-2 text-center">
                        You can place your next order starting {orderEligibility.nextOrderDate?.toLocaleDateString()}
                      </p>
                    )}
                    {noAvailableTimeSlots && (
                      <p className="text-xs text-red-500 mt-2 text-center">No more pickup times available today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Confirmation</DialogTitle>
            <DialogDescription>Your order has been successfully placed!</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Order Number:</span>
                <span className="text-sm">{confirmationDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Pickup Date:</span>
                <span className="text-sm">{confirmationDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Pickup Time:</span>
                <span className="text-sm">{confirmationDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Items:</span>
                <span className="text-sm">{totalItems}</span>
              </div>
            </div>

            <p className="text-sm text-center text-gray-500">
              Please bring your student ID when picking up your items.
            </p>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>Weekly Order Limit</AlertTitle>
              <AlertDescription>Remember, you can place your next order starting next week.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button className="w-full bg-[#c75b12] hover:bg-[#a84a0f]" onClick={handleConfirmationClose}>
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
