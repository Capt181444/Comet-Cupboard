"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  ChevronDown,
  Download,
  Edit,
  LayoutDashboard,
  LogOut,
  Mail,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  User,
  Users,
  RefreshCw,
  LogIn,
  Calendar,
  AlertCircle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

import { logout, getUsers, resetWeeklyOrderLimit, adminLoginAsUser, canPlaceOrder } from "@/lib/auth-service"

// Define user types
type UserRole = "student" | "admin" | "donor"
type UserStatus = "active" | "inactive" | "pending"

// Define user interface
interface UserType {
  id: string
  name?: string
  firstName: string
  lastName: string
  email: string
  studentId?: string
  role?: UserRole
  userType: string
  status?: UserStatus
  lastLogin?: string
  registrationDate?: string
  requestsCount?: number
  lastOrderDate?: string
  orderLimitReset?: boolean
}

export default function UsersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<UserRole | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all")
  const [users, setUsers] = useState<UserType[]>([])

  // Dialog states
  const [resetLimitDialogOpen, setResetLimitDialogOpen] = useState(false)
  const [loginAsUserDialogOpen, setLoginAsUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAdmin = localStorage.getItem("userType") === "admin"

      if (!isAdmin) {
        router.push("/comet-cupboard/login?type=admin")
      } else {
        setIsAuthenticated(true)
        // Load users
        loadUsers()
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  // Load users from auth service
  const loadUsers = () => {
    const allUsers = getUsers().map((user) => ({
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      role: user.userType as UserRole,
      status: "active" as UserStatus,
      lastLogin: user.lastLogin || new Date().toISOString(),
      registrationDate: user.registrationDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))
    setUsers(allUsers)
  }

  // Filter users based on active tab, search query, and status filter
  const filteredUsers = users.filter((user) => {
    // Apply role filter
    if (activeTab !== "all" && user.role !== activeTab) return false

    // Apply status filter
    if (statusFilter !== "all" && user.status !== statusFilter) return false

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.studentId && user.studentId.includes(query))
      )
    }

    return true
  })

  // Get status badge color
  const getStatusColor = (status: UserStatus): string => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "pending":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get role badge color
  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "bg-[#154734]"
      case "student":
        return "bg-[#c75b12]"
      case "donor":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle reset weekly order limit
  const handleResetOrderLimit = async () => {
    if (!selectedUser) return

    setActionLoading(true)

    try {
      const result = await resetWeeklyOrderLimit(selectedUser.id)

      if (result.success) {
        toast.success(result.message)
        // Refresh user list
        loadUsers()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred while resetting the order limit.")
      console.error(error)
    } finally {
      setActionLoading(false)
      setResetLimitDialogOpen(false)
    }
  }

  // Handle login as user
  const handleLoginAsUser = async () => {
    if (!selectedUser) return

    setActionLoading(true)

    try {
      const result = await adminLoginAsUser(selectedUser.id)

      if (result.success) {
        toast.success(result.message)
        // Redirect to student portal
        router.push("/comet-cupboard/student")
      } else {
        toast.error(result.message)
        setActionLoading(false)
        setLoginAsUserDialogOpen(false)
      }
    } catch (error) {
      toast.error("An error occurred while logging in as user.")
      console.error(error)
      setActionLoading(false)
      setLoginAsUserDialogOpen(false)
    }
  }

  // Check if user can place an order
  const checkOrderStatus = (user: UserType) => {
    if (user.role !== "student") return null

    const orderStatus = canPlaceOrder(user.id)

    if (orderStatus.allowed) {
      if (user.orderLimitReset) {
        return <Badge className="bg-green-500">Limit Reset by Admin</Badge>
      }
      return <Badge className="bg-green-500">Can Place Order</Badge>
    } else {
      return (
        <div className="flex flex-col">
          <Badge className="bg-red-500 mb-1">Weekly Limit Reached</Badge>
          {orderStatus.nextOrderDate && (
            <span className="text-xs text-gray-500">
              Next order: {new Date(orderStatus.nextOrderDate).toLocaleDateString()}
            </span>
          )}
        </div>
      )
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              {sidebarOpen && <span>Requests</span>}
            </Link>
            <Link
              href="/comet-cupboard/admin/users"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-[#154734]"
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
            <h1 className="text-2xl font-bold text-[#154734]">User Management</h1>
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

        {/* Users content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">User Directory</h2>
              <p className="text-gray-600">Manage students, administrators, and donors</p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: UserStatus | "all") => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-[#154734] hover:bg-[#0d2c20]">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <Tabs
              defaultValue="all"
              className="w-full"
              value={activeTab}
              onValueChange={(value: UserRole | "all") => setActiveTab(value)}
            >
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="student">Students</TabsTrigger>
                <TabsTrigger value="admin">Administrators</TabsTrigger>
                <TabsTrigger value="donor">Donors</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User List</CardTitle>
              <CardDescription>
                {filteredUsers.length} users • Last updated {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                            {user.studentId && <div className="text-xs text-gray-500">ID: {user.studentId}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role || "student")}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) ||
                            user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-${user.status === "active" ? "green" : user.status === "pending" ? "amber" : "gray"}-600`}
                        >
                          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                      <TableCell>{user.role === "student" ? checkOrderStatus(user) : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.role === "student" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setResetLimitDialogOpen(true)
                                }}
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span className="hidden sm:inline">Reset Limit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setLoginAsUserDialogOpen(true)
                                }}
                              >
                                <LogIn className="h-3 w-3" />
                                <span className="hidden sm:inline">Login As</span>
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>View Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit User</span>
                              </DropdownMenuItem>
                              {user.role === "student" && (
                                <DropdownMenuItem>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  <span>View Requests</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Send Email</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reset Order Limit Dialog */}
          <Dialog open={resetLimitDialogOpen} onOpenChange={setResetLimitDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Weekly Order Limit</DialogTitle>
                <DialogDescription>
                  This will allow the student to place another order this week, overriding the weekly limit restriction.
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <div className="py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {selectedUser.firstName[0]}
                        {selectedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{selectedUser.email}</div>
                    </div>
                  </div>

                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      This action should only be used in exceptional circumstances when a student needs immediate access
                      to resources.
                    </AlertDescription>
                  </Alert>

                  {selectedUser.lastOrderDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last order placed: {new Date(selectedUser.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setResetLimitDialogOpen(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#c75b12] hover:bg-[#a84a0f]"
                  onClick={handleResetOrderLimit}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Reset Limit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Login As User Dialog */}
          <Dialog open={loginAsUserDialogOpen} onOpenChange={setLoginAsUserDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Login As Student</DialogTitle>
                <DialogDescription>
                  You will be logged in as this student for testing purposes. Your admin session will be preserved.
                </DialogDescription>
              </DialogHeader>

              {selectedUser && (
                <div className="py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {selectedUser.firstName[0]}
                        {selectedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{selectedUser.email}</div>
                    </div>
                  </div>

                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Demo Mode</AlertTitle>
                    <AlertDescription>
                      This feature allows you to test the student experience without affecting the actual student
                      account. You can return to your admin account at any time.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setLoginAsUserDialogOpen(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#154734] hover:bg-[#0d2c20]"
                  onClick={handleLoginAsUser}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Login As Student"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
