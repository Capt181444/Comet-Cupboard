"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Package,
  Search,
  ShoppingCart,
  User,
  XCircle,
} from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

import { logout } from "@/lib/auth-service"

// Define request status types
type RequestStatus = "in-progress" | "successful" | "cancelled"

// Define request item type
interface RequestItem {
  id: string
  name: string
  description: string
  image: string
  category: string
  quantity: number
}

// Define request type
interface Request {
  id: string
  orderNumber: string
  date: string
  time: string
  status: RequestStatus
  items: RequestItem[]
}

// Mock data for previous requests
const mockRequests: Request[] = [
  {
    id: "req-001",
    orderNumber: "CC-123456",
    date: "2025-04-15",
    time: "2:30 PM",
    status: "successful",
    items: [
      {
        id: "rice",
        name: "Rice",
        description: "White rice, 5lb bag",
        image: "/images/rice.png",
        category: "food",
        quantity: 1,
      },
      {
        id: "pasta",
        name: "Pasta",
        description: "Spaghetti, 16oz package",
        image: "/images/pasta.png",
        category: "food",
        quantity: 1,
      },
      {
        id: "toothpaste",
        name: "Toothpaste",
        description: "Mint flavor, 4.8oz tube",
        image: "/images/toothpaste.png",
        category: "hygiene",
        quantity: 1,
      },
    ],
  },
  {
    id: "req-002",
    orderNumber: "CC-234567",
    date: "2025-04-22",
    time: "3:00 PM",
    status: "in-progress",
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
  },
  {
    id: "req-003",
    orderNumber: "CC-345678",
    date: "2025-04-08",
    time: "1:00 PM",
    status: "cancelled",
    items: [
      {
        id: "canned-soup",
        name: "Canned Soup",
        description: "Assorted varieties, 15oz can",
        image: "/images/canned-soup.png",
        category: "food",
        quantity: 1,
      },
      {
        id: "dish-soap",
        name: "Dish Soap",
        description: "Liquid dish soap, 16oz bottle",
        image: "/images/laundry-pods.png",
        category: "household",
        quantity: 1,
      },
    ],
  },
  {
    id: "req-004",
    orderNumber: "CC-456789",
    date: "2025-04-01",
    time: "4:30 PM",
    status: "successful",
    items: [
      {
        id: "notebooks",
        name: "Notebooks",
        description: "College ruled, pack of 3",
        image: "/images/notebooks.png",
        category: "school",
        quantity: 1,
      },
      {
        id: "pens",
        name: "Pens",
        description: "Black ink, pack of 10",
        image: "/images/pens.png",
        category: "school",
        quantity: 1,
      },
      {
        id: "paper-towels",
        name: "Paper Towels",
        description: "2-pack paper towel rolls",
        image: "/images/paper-towels.png",
        category: "household",
        quantity: 1,
      },
    ],
  },
]

// Check if an order should be automatically cancelled (30 minutes past scheduled time)
const shouldAutoCancelOrder = (request: Request): boolean => {
  if (request.status !== "in-progress") return false

  const [scheduledHour, scheduledMinute] = request.time.split(":")[0].split(" ")[0].split(":")
  const isPM = request.time.includes("PM")

  // Convert to 24-hour format
  let hour = Number.parseInt(scheduledHour)
  if (isPM && hour !== 12) hour += 12
  if (!isPM && hour === 12) hour = 0

  const minute = Number.parseInt(scheduledMinute)

  // Create scheduled date object
  const scheduledDate = new Date(request.date)
  scheduledDate.setHours(hour, minute, 0, 0)

  // Add 30 minutes to scheduled time
  const expiryTime = new Date(scheduledDate.getTime() + 30 * 60 * 1000)

  // Check if current time is past expiry time
  return new Date() > expiryTime
}

// Get remaining time before auto-cancellation
const getRemainingTime = (request: Request): string | null => {
  if (request.status !== "in-progress") return null

  const [scheduledHour, scheduledMinute] = request.time.split(":")[0].split(" ")[0].split(":")
  const isPM = request.time.includes("PM")

  // Convert to 24-hour format
  let hour = Number.parseInt(scheduledHour)
  if (isPM && hour !== 12) hour += 12
  if (!isPM && hour === 12) hour = 0

  const minute = Number.parseInt(scheduledMinute)

  // Create scheduled date object
  const scheduledDate = new Date(request.date)
  scheduledDate.setHours(hour, minute, 0, 0)

  // Add 30 minutes to scheduled time
  const expiryTime = new Date(scheduledDate.getTime() + 30 * 60 * 1000)

  // Calculate remaining time
  const now = new Date()
  if (now > expiryTime) return null

  const remainingMs = expiryTime.getTime() - now.getTime()
  const remainingMinutes = Math.floor(remainingMs / (60 * 1000))

  return remainingMinutes <= 0 ? "Less than a minute" : `${remainingMinutes} minutes`
}

export default function RequestsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<Request[]>(mockRequests)
  const [filteredRequests, setFilteredRequests] = useState<Request[]>(mockRequests)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")

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

  // Filter and sort requests when filter, sort order, or search query changes
  useEffect(() => {
    let filtered = [...requests]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.orderNumber.toLowerCase().includes(query) ||
          request.items.some((item) => item.name.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    setFilteredRequests(filtered)
  }, [requests, statusFilter, sortOrder, searchQuery])

  // Update request status
  const updateRequestStatus = (requestId: string, newStatus: RequestStatus) => {
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request,
    )
    setRequests(updatedRequests)

    // Show toast notification
    toast.success(`Request ${requestId} status updated to ${formatStatus(newStatus)}`)
  }

  // Format status for display
  const formatStatus = (status: RequestStatus): string => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      case "successful":
        return "Pickup Successful"
      case "cancelled":
        return "Pickup Cancelled"
      default:
        return status
    }
  }

  // Get status badge color
  const getStatusColor = (status: RequestStatus): string => {
    switch (status) {
      case "in-progress":
        return "bg-amber-500"
      case "successful":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get status icon
  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "successful":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/comet-cupboard")
  }

  // Check for auto-cancellations every minute
  useEffect(() => {
    const checkForAutoCancellations = () => {
      const updatedRequests = requests.map((request) => {
        if (shouldAutoCancelOrder(request)) {
          return { ...request, status: "cancelled" as RequestStatus }
        }
        return request
      })

      // Only update state if there were changes
      if (JSON.stringify(updatedRequests) !== JSON.stringify(requests)) {
        setRequests(updatedRequests)
        toast.error("One or more orders were automatically cancelled due to missed pickup time", {
          description: "Orders must be picked up within 30 minutes of scheduled time.",
        })
      }
    }

    // Check immediately
    checkForAutoCancellations()

    // Set up interval to check every minute
    const interval = setInterval(checkForAutoCancellations, 60000)

    return () => clearInterval(interval)
  }, [requests])

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
            <Link href="/comet-cupboard/student/requests" className="text-sm font-medium text-[#154734]">
              My Requests
            </Link>
            <Link
              href="/comet-cupboard/student/cart"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              My Cart
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
            <h1 className="text-2xl font-bold text-[#154734]">My Requests</h1>
            <p className="text-gray-600">Track and manage your item requests</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search requests..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="successful">Pickup Successful</SelectItem>
                <SelectItem value="cancelled">Pickup Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</span>
            </Button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <Card className="mb-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">No requests found</h2>
              <p className="text-gray-500 mb-6">Try adjusting your filters or browse items to make a request</p>
              <Button
                className="bg-[#c75b12] hover:bg-[#a84a0f]"
                onClick={() => router.push("/comet-cupboard/student")}
              >
                Browse Items
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{request.orderNumber}
                      <Badge className={`${getStatusColor(request.status)} ml-2`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {formatStatus(request.status)}
                        </span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {new Date(request.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {request.time}
                      </span>
                      {request.status === "in-progress" && (
                        <>
                          {shouldAutoCancelOrder(request) ? (
                            <span className="text-red-500 text-xs font-medium">
                              Auto-cancelled (pickup window expired)
                            </span>
                          ) : (
                            <span className="text-amber-500 text-xs font-medium">
                              Auto-cancels in {getRemainingTime(request)}
                            </span>
                          )}
                        </>
                      )}
                    </CardDescription>
                  </div>

                  <Select
                    value={request.status}
                    onValueChange={(value: RequestStatus) => updateRequestStatus(request.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="successful">Pickup Successful</SelectItem>
                      <SelectItem value="cancelled">Pickup Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>

                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Items ({request.items.length})</span>
                      </div>
                    </div>

                    <div className="divide-y">
                      {request.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4">
                          <div className="h-16 w-16 relative rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
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

                <CardFooter className="bg-gray-50 border-t flex justify-between">
                  <div className="text-sm text-gray-500">Total Items: {request.items.length}</div>
                  <div className="flex gap-2">
                    {request.status === "in-progress" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => updateRequestStatus(request.id, "cancelled")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel Pickup
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 border-green-200 hover:bg-green-50"
                          onClick={() => updateRequestStatus(request.id, "successful")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark as Picked Up
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
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
    </div>
  )
}
