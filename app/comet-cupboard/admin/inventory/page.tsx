"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Bell,
  ChevronDown,
  Download,
  Edit,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Upload,
  Users,
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
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { logout } from "@/lib/auth-service"

// Mock inventory data
const inventoryItems = [
  {
    id: "canned-soup",
    name: "Canned Soup",
    description: "Assorted varieties, 15oz can",
    image: "/images/canned-soup.png",
    category: "food",
    stockLevel: 45,
    stockMax: 200,
    lastRestocked: "2025-04-10",
    itemLimit: 1,
  },
  {
    id: "rice",
    name: "Rice",
    description: "White rice, 5lb bag",
    image: "/images/rice.png",
    category: "food",
    stockLevel: 18,
    stockMax: 100,
    lastRestocked: "2025-04-12",
    itemLimit: 1,
  },
  {
    id: "pasta",
    name: "Pasta",
    description: "Spaghetti, 16oz package",
    image: "/images/pasta.png",
    category: "food",
    stockLevel: 22,
    stockMax: 100,
    lastRestocked: "2025-04-15",
    itemLimit: 1,
  },
  {
    id: "toothpaste",
    name: "Toothpaste",
    description: "Mint flavor, 4.8oz tube",
    image: "/images/toothpaste.png",
    category: "hygiene",
    stockLevel: 25,
    stockMax: 150,
    lastRestocked: "2025-04-08",
    itemLimit: 1,
  },
  {
    id: "shampoo",
    name: "Shampoo",
    description: "All hair types, 12.6oz bottle",
    image: "/images/shampoo.png",
    category: "hygiene",
    stockLevel: 30,
    stockMax: 150,
    lastRestocked: "2025-04-05",
    itemLimit: 1,
  },
  {
    id: "soap",
    name: "Soap Bars",
    description: "Pack of 3 bars",
    image: "/images/soap.png",
    category: "hygiene",
    stockLevel: 65,
    stockMax: 200,
    lastRestocked: "2025-04-02",
    itemLimit: 1,
  },
  {
    id: "notebooks",
    name: "Notebooks",
    description: "College ruled, pack of 3",
    image: "/images/notebooks.png",
    category: "school",
    stockLevel: 85,
    stockMax: 150,
    lastRestocked: "2025-03-28",
    itemLimit: 1,
  },
  {
    id: "pens",
    name: "Pens",
    description: "Black ink, pack of 10",
    image: "/images/pens.png",
    category: "school",
    stockLevel: 120,
    stockMax: 200,
    lastRestocked: "2025-03-25",
    itemLimit: 1,
  },
  {
    id: "laundry-pods",
    name: "Laundry Pods",
    description: "Concentrated detergent pods, 16 count",
    image: "/images/laundry-detergent.png",
    category: "household",
    stockLevel: 42,
    stockMax: 100,
    lastRestocked: "2025-04-07",
    itemLimit: 1,
  },
  {
    id: "dish-soap",
    name: "Dish Soap",
    description: "Liquid dish soap, 16oz bottle",
    image: "/images/laundry-pods.png",
    category: "household",
    stockLevel: 38,
    stockMax: 100,
    lastRestocked: "2025-04-09",
    itemLimit: 1,
  },
  {
    id: "paper-towels",
    name: "Paper Towels",
    description: "2-pack paper towel rolls",
    image: "/images/paper-towels.png",
    category: "household",
    stockLevel: 55,
    stockMax: 150,
    lastRestocked: "2025-04-03",
    itemLimit: 1,
  },
  {
    id: "toilet-paper",
    name: "Toilet Paper",
    description: "4-pack toilet paper rolls",
    image: "/images/toilet-paper.png",
    category: "household",
    stockLevel: 48,
    stockMax: 150,
    lastRestocked: "2025-04-01",
    itemLimit: 1,
  },
]

// Recent activity data
const recentActivity = [
  { id: 1, action: "Restocked", item: "Canned Soup", quantity: 50, date: "2025-04-10", user: "Admin User" },
  { id: 2, action: "Restocked", item: "Rice", quantity: 25, date: "2025-04-12", user: "Admin User" },
  { id: 3, action: "Adjusted Stock", item: "Pasta", quantity: -5, date: "2025-04-14", user: "Admin User" },
  { id: 4, action: "Restocked", item: "Toothpaste", quantity: 30, date: "2025-04-08", user: "Admin User" },
  { id: 5, action: "Adjusted Stock", item: "Shampoo", quantity: -8, date: "2025-04-11", user: "Admin User" },
]

export default function InventoryPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")

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

  // Filter and sort inventory items
  const filteredItems = inventoryItems
    .filter((item) => {
      // Apply category filter
      if (activeTab !== "all" && item.category !== activeTab) return false

      // Apply search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "stock-low":
          return a.stockLevel / a.stockMax - b.stockLevel / b.stockMax
        case "stock-high":
          return b.stockLevel / b.stockMax - a.stockLevel / a.stockMax
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  // Get stock status
  const getStockStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage <= 20) return { color: "bg-red-500", text: "Low Stock" }
    if (percentage <= 40) return { color: "bg-amber-500", text: "Medium Stock" }
    return { color: "bg-green-500", text: "Good Stock" }
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-[#154734]"
            >
              <Package className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Inventory</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/requests"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
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
            <h1 className="text-2xl font-bold text-[#154734]">Inventory Management</h1>
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

        {/* Inventory content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Inventory Items</h2>
              <p className="text-gray-600">Manage and track your inventory</p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  className="pl-10 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="stock-low">Stock (Low to High)</SelectItem>
                  <SelectItem value="stock-high">Stock (High to Low)</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-[#154734] hover:bg-[#0d2c20]">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="hygiene">Hygiene</TabsTrigger>
                <TabsTrigger value="school">School Supplies</TabsTrigger>
                <TabsTrigger value="household">Household</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Inventory List</CardTitle>
              <CardDescription>
                {filteredItems.length} items • Last updated {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Item Limit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item.stockLevel, item.stockMax)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                {item.stockLevel} / {item.stockMax}
                              </span>
                              <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                            </div>
                            <Progress
                              value={(item.stockLevel / item.stockMax) * 100}
                              className="h-2"
                              indicatorClassName={stockStatus.color}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                        <TableCell>{item.itemLimit} per student</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Recent inventory changes and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge className={activity.quantity > 0 ? "bg-green-500" : "bg-amber-500"}>
                            {activity.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{activity.item}</TableCell>
                        <TableCell className={activity.quantity > 0 ? "text-green-600" : "text-amber-600"}>
                          {activity.quantity > 0 ? `+${activity.quantity}` : activity.quantity}
                        </TableCell>
                        <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
