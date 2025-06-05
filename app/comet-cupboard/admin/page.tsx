"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Utensils,
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
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Chart,
  ChartContainer,
  ChartGrid,
  ChartLine,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"

import { logout } from "@/lib/auth-service"

export default function AdminDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (this would be your actual auth check)
    const checkAuth = () => {
      // Simulate auth check
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

  const handleLogout = async () => {
    await logout()
    router.push("/comet-cupboard")
  }

  // Rest of the component remains the same
  // Sample data for charts
  const inventoryData = [
    { name: "Jan", value: 240 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 280 },
    { name: "Apr", value: 320 },
    { name: "May", value: 350 },
    { name: "Jun", value: 270 },
    { name: "Jul", value: 290 },
    { name: "Aug", value: 310 },
    { name: "Sep", value: 380 },
    { name: "Oct", value: 420 },
    { name: "Nov", value: 390 },
    { name: "Dec", value: 450 },
  ]

  const usageData = [
    { name: "Jan", value: 180 },
    { name: "Feb", value: 220 },
    { name: "Mar", value: 240 },
    { name: "Apr", value: 280 },
    { name: "May", value: 300 },
    { name: "Jun", value: 250 },
    { name: "Jul", value: 260 },
    { name: "Aug", value: 270 },
    { name: "Sep", value: 340 },
    { name: "Oct", value: 380 },
    { name: "Nov", value: 350 },
    { name: "Dec", value: 410 },
  ]

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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-[#154734]"
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
            <h1 className="text-2xl font-bold text-[#154734]">Admin Dashboard</h1>
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

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">1,248</div>
                  <Package className="h-8 w-8 text-[#c75b12]" />
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center">
                  <span>↑ 12% from last month</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">42</div>
                  <ShoppingCart className="h-8 w-8 text-[#c75b12]" />
                </div>
                <p className="text-xs text-amber-500 mt-2 flex items-center">
                  <span>↑ 18% from last week</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Registered Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">876</div>
                  <Users className="h-8 w-8 text-[#c75b12]" />
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center">
                  <span>↑ 5% from last month</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Items Distributed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">3,542</div>
                  <Utensils className="h-8 w-8 text-[#c75b12]" />
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center">
                  <span>↑ 8% from last month</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Inventory Overview</CardTitle>
                  <Select defaultValue="6months">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Monitor inventory levels and distribution trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Chart>
                    <ChartContainer>
                      <ChartGrid x={false} />
                      <ChartYAxis />
                      <ChartXAxis />
                      <ChartLine
                        data={inventoryData}
                        valueKey="value"
                        nameKey="name"
                        stroke="#c75b12"
                        strokeWidth={2}
                      />
                      <ChartLine data={usageData} valueKey="value" nameKey="name" stroke="#154734" strokeWidth={2} />
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                    </ChartContainer>
                  </Chart>
                </div>
                <div className="flex justify-center mt-2 space-x-8">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#c75b12] mr-2"></div>
                    <span className="text-sm text-gray-600">Inventory</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#154734] mr-2"></div>
                    <span className="text-sm text-gray-600">Distribution</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Canned Soup</span>
                      <span className="text-sm text-red-500">12% left</span>
                    </div>
                    <Progress value={12} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Rice (5lb bags)</span>
                      <span className="text-sm text-amber-500">18% left</span>
                    </div>
                    <Progress value={18} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Toothpaste</span>
                      <span className="text-sm text-amber-500">22% left</span>
                    </div>
                    <Progress value={22} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Pasta</span>
                      <span className="text-sm text-amber-500">25% left</span>
                    </div>
                    <Progress value={25} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Shampoo</span>
                      <span className="text-sm text-yellow-500">30% left</span>
                    </div>
                    <Progress value={30} className="h-2 bg-gray-200" indicatorClassName="bg-yellow-500" />
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  View All Inventory
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Requests</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>Latest student requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Pickup Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-2305</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span>John Doe</span>
                        </div>
                      </TableCell>
                      <TableCell>5 items</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Today, 2:30 PM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Tomorrow, 10:00 AM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-2304</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          <span>Alice Smith</span>
                        </div>
                      </TableCell>
                      <TableCell>3 items</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Yesterday, 4:15 PM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Today, 3:30 PM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ready</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-2303</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>RJ</AvatarFallback>
                          </Avatar>
                          <span>Robert Johnson</span>
                        </div>
                      </TableCell>
                      <TableCell>7 items</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Yesterday, 10:20 AM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Yesterday, 4:00 PM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-2302</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>EW</AvatarFallback>
                          </Avatar>
                          <span>Emily Wilson</span>
                        </div>
                      </TableCell>
                      <TableCell>4 items</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>2 days ago</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Yesterday, 11:00 AM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#REQ-2301</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>MB</AvatarFallback>
                          </Avatar>
                          <span>Michael Brown</span>
                        </div>
                      </TableCell>
                      <TableCell>6 items</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>2 days ago</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Yesterday, 2:00 PM</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
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
