"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Check, Clock, Filter, Package, Search, ShoppingCart, User, AlertCircle } from "lucide-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import { logout } from "@/lib/auth-service"
import { useCart } from "@/lib/cart-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define product data
const products = [
  {
    id: "canned-soup",
    name: "Canned Soup",
    description: "Assorted varieties, 15oz can",
    image: "/images/canned-soup.png",
    category: "food",
    inStock: true,
    limit: 1,
  },
  {
    id: "rice",
    name: "Rice",
    description: "White rice, 5lb bag",
    image: "/images/rice.png",
    category: "food",
    inStock: true,
    lowStock: true,
    limit: 1,
  },
  {
    id: "pasta",
    name: "Pasta",
    description: "Spaghetti, 16oz package",
    image: "/images/pasta.png",
    category: "food",
    inStock: true,
    lowStock: true,
    limit: 1,
  },
  {
    id: "toothpaste",
    name: "Toothpaste",
    description: "Mint flavor, 4.8oz tube",
    image: "/images/toothpaste.png",
    category: "hygiene",
    inStock: true,
    lowStock: true,
    limit: 1,
  },
  {
    id: "shampoo",
    name: "Shampoo",
    description: "All hair types, 12.6oz bottle",
    image: "/images/shampoo.png",
    category: "hygiene",
    inStock: true,
    lowStock: true,
    limit: 1,
  },
  {
    id: "soap",
    name: "Soap Bars",
    description: "Pack of 3 bars",
    image: "/images/soap.png",
    category: "hygiene",
    inStock: true,
    limit: 1,
  },
  {
    id: "notebooks",
    name: "Notebooks",
    description: "College ruled, pack of 3",
    image: "/images/notebooks.png",
    category: "school",
    inStock: true,
    limit: 1,
  },
  {
    id: "pens",
    name: "Pens",
    description: "Black ink, pack of 10",
    image: "/images/pens.png",
    category: "school",
    inStock: true,
    limit: 1,
  },
  {
    id: "laundry-pods",
    name: "Laundry Pods",
    description: "Concentrated detergent pods, 16 count",
    image: "/images/laundry-detergent.png",
    category: "household",
    inStock: true,
    limit: 1,
  },
  {
    id: "dish-soap",
    name: "Dish Soap",
    description: "Liquid dish soap, 16oz bottle",
    image: "/images/laundry-pods.png",
    category: "household",
    inStock: true,
    limit: 1,
  },
  {
    id: "paper-towels",
    name: "Paper Towels",
    description: "2-pack paper towel rolls",
    image: "/images/paper-towels.png",
    category: "household",
    inStock: true,
    limit: 1,
  },
  {
    id: "toilet-paper",
    name: "Toilet Paper",
    description: "4-pack toilet paper rolls",
    image: "/images/toilet-paper.png",
    category: "household",
    inStock: true,
    limit: 1,
  },
]

export default function StudentPortal() {
  const router = useRouter()
  const { addToCart, getCartCount, hasReachedGlobalLimit } = useCart()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Update cart count
    setCartCount(getCartCount())
  }, [getCartCount])

  useEffect(() => {
    // Check if user is authenticated (this would be your actual auth check)
    const checkAuth = () => {
      // Simulate auth check
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

  const handleAddToCart = (product) => {
    // Check if we've reached the global limit
    if (hasReachedGlobalLimit()) {
      toast.error("You've reached the limit of 5 items per order", {
        description: "Please remove some items from your cart to add more.",
      })
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      quantity: 1,
      limit: product.limit,
    })

    setCartCount(getCartCount())

    toast.success(`${product.name} has been added to your cart.`, {
      description: "Go to cart to complete your request.",
    })
  }

  // Filter products based on active tab
  const filteredProducts = activeTab === "all" ? products : products.filter((product) => product.category === activeTab)

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
            <Link href="/comet-cupboard/student" className="text-sm font-medium text-[#154734]">
              Browse Items
            </Link>
            <Link
              href="/comet-cupboard/student/requests"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              My Requests
            </Link>
            <Link
              href="/comet-cupboard/student/schedule"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              Schedule Pickup
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/comet-cupboard/student/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c75b12] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
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
            <h1 className="text-2xl font-bold text-[#154734]">Available Items</h1>
            <p className="text-gray-600">Browse and request items from our inventory</p>
          </div>

          {cartCount >= 3 && cartCount < 5 && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Approaching Item Limit</AlertTitle>
              <AlertDescription>
                You have {cartCount} items in your cart. The maximum is 5 items per order.
              </AlertDescription>
            </Alert>
          )}

          {cartCount >= 5 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Item Limit Reached</AlertTitle>
              <AlertDescription>
                You've reached the maximum of 5 items per order. Please remove items from your cart to add different
                ones.
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search items..." className="pl-10 w-full sm:w-[250px]" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Food Items</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="ml-6">Hygiene Products</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="ml-6">School Supplies</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="ml-6">Household Items</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="hygiene">Hygiene</TabsTrigger>
            <TabsTrigger value="school">School Supplies</TabsTrigger>
            <TabsTrigger value="household">Household</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-4">
                <div className="aspect-square relative mb-2 bg-gray-100 rounded-md overflow-hidden">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  <Badge className={`absolute top-2 right-2 ${product.lowStock ? "bg-amber-500" : "bg-green-500"}`}>
                    {product.lowStock ? "Low Stock" : "In Stock"}
                  </Badge>
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Limit: {product.limit} per student</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#c75b12] hover:bg-[#a84a0f]" onClick={() => handleAddToCart(product)}>
                  Add to Request
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="mx-auto">
            Load More Items
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
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
