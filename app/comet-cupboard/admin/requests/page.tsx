"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowUpDown,
  BarChart3,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  XCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  studentName: string
  studentId: string
  studentEmail: string
  items: RequestItem[]
}

// Mock data for requests
const mockRequests: Request[] = [
  {
    id: "req-001",
    orderNumber: "CC-123456",
    date: "2025-04-15",
    time: "2:30 PM",
    status: "successful",
    studentName: "John Smith",
    studentId: "2023456789",
    studentEmail: "john.smith@utdallas.edu",
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
    studentName: "Emily Johnson",
    studentId: "2023789012",
    studentEmail: "emily.johnson@utdallas.edu",
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
    studentName: "Michael Brown",
    studentId: "2023345678",
    studentEmail: "michael.brown@utdallas.edu",
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
    studentName: "Sarah Wilson",
    studentId: "2023234567",
    studentEmail: "sarah.wilson@utdallas.edu",
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
  {
    id: "req-005",
    orderNumber: "CC-567890",
    date: "2025-04-20",
    time: "11:30 AM",
    status: "in-progress",
    studentName: "David Lee",
    studentId: "2023567890",
    studentEmail: "david.lee@utdallas.edu",
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
        id: "shampoo",
        name: "Shampoo",
        description: "All hair types, 12.6oz bottle",
        image: "/images/shampoo.png",
        category: "hygiene",
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
    ],
  },
]

export default function RequestsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
      const isAdmin = localStorage.getItem("userType") === "admin"

      if (!isAdmin) {
        router.push("/comet-cupboard/login?type=admin")
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
          request.studentName.toLowerCase().includes(query) ||
          request.studentEmail.toLowerCase().includes(query) ||
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white border-r ${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/comet-cupboard" className={`flex items-center ${!sidebarOpen && "justify-center"}`}>
            <Package className="h-6 w-6 text-[#c75b12]" />
            {sidebarOpen && <span className="ml-2 font-bold text-[#154734]">Comet Cupboard</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:flex hidden">
            <ChevronDown className={`h-4 w-4 transition-transform ${!sidebarOpen && "rotate-90"}`} />
          </Button>
        </div>
        <div className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            <Link
              href="/comet-cupboard/admin"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/inventory"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
            >
              <Package className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Inventory</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/requests"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-[#154734]"
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Requests</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/users"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
            >
              <Users className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Users</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/analytics"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Analytics</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
            >
              <Settings className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Settings</span>}
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          {sidebarOpen ? (
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@utdallas.edu</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#154734]">Request Management</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Admin User</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Requests content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Student Requests</h2>
              <p className="text-gray-600">Manage and process student pickup requests</p>
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

              <Button variant="outline" size="icon" className="hidden md:flex">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-medium mb-2">Student Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>
                              {request.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.studentName}</p>
                            <p className="text-sm text-gray-500">{request.studentEmail}</p>
                          </div>
                        </div>
                        <p className="text-sm">Student ID: {request.studentId}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-medium mb-2">Request Summary</h3>
                      <div className="space-y-2">
                        <p className="text-sm">Total Items: {request.items.length}</p>
                        <p className="text-sm">
                          Categories:{" "}
                          {Array.from(new Set(request.items.map((item) => item.category)))
                            .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1))
                            .join(", ")}
                        </p>
                        <p className="text-sm">
                          Auto-cancels: {request.status === "in-progress" ? "30 minutes after scheduled time" : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

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
                  <div className="text-sm text-gray-500">Request ID: {request.id}</div>
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
                          Cancel Request
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 border-green-200 hover:bg-green-50"
                          onClick={() => updateRequestStatus(request.id, "successful")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark as Completed
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
        </main>
      </div>
    </div>
  )
}
