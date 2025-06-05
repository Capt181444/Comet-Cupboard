"use client"
import Link from "next/link"
import { Calendar, Clock, Gift, Heart, Package, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Chart,
  ChartContainer,
  ChartGrid,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
} from "@/components/ui/chart"

export default function DonorPortal() {
  // Sample data for charts
  const donationData = [
    { name: "Jan", value: 12 },
    { name: "Feb", value: 15 },
    { name: "Mar", value: 10 },
    { name: "Apr", value: 18 },
    { name: "May", value: 20 },
    { name: "Jun", value: 14 },
    { name: "Jul", value: 16 },
    { name: "Aug", value: 19 },
    { name: "Sep", value: 22 },
    { name: "Oct", value: 25 },
    { name: "Nov", value: 28 },
    { name: "Dec", value: 30 },
  ]

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
            <Link href="/comet-cupboard/donor" className="text-sm font-medium text-[#154734]">
              Dashboard
            </Link>
            <Link
              href="/comet-cupboard/donor/donate"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              Donate Items
            </Link>
            <Link
              href="/comet-cupboard/donor/volunteer"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              Volunteer
            </Link>
            <Link
              href="/comet-cupboard/donor/impact"
              className="text-sm font-medium text-gray-600 hover:text-[#154734]"
            >
              Impact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>DN</AvatarFallback>
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
                  <Gift className="mr-2 h-4 w-4" />
                  <span>My Donations</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
            <h1 className="text-2xl font-bold text-[#154734]">Donor Dashboard</h1>
            <p className="text-gray-600">Track your impact and see current needs</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button className="bg-[#c75b12] hover:bg-[#a84a0f]">
              <Gift className="mr-2 h-4 w-4" />
              Donate Now
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <Gift className="h-8 w-8 text-[#c75b12]" />
              </div>
              <p className="text-xs text-green-500 mt-2 flex items-center">
                <span>↑ 8% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Items Donated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">342</div>
                <Package className="h-8 w-8 text-[#c75b12]" />
              </div>
              <p className="text-xs text-green-500 mt-2 flex items-center">
                <span>↑ 12% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Students Helped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">156</div>
                <Users className="h-8 w-8 text-[#c75b12]" />
              </div>
              <p className="text-xs text-green-500 mt-2 flex items-center">
                <span>↑ 5% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Volunteer Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">18</div>
                <Clock className="h-8 w-8 text-[#c75b12]" />
              </div>
              <p className="text-xs text-amber-500 mt-2 flex items-center">
                <span>Same as last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Your Donation History</CardTitle>
              <CardDescription>Track your contributions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Chart>
                  <ChartContainer>
                    <ChartGrid x={false} />
                    <ChartYAxis />
                    <ChartXAxis />
                    <ChartBar data={donationData} valueKey="value" nameKey="name" fill="#c75b12" />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                  </ChartContainer>
                </Chart>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Current Needs</CardTitle>
              <CardDescription>Items that are urgently needed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Canned Soup</span>
                    <span className="text-sm text-red-500">Critical Need</span>
                  </div>
                  <Progress value={12} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Rice (5lb bags)</span>
                    <span className="text-sm text-amber-500">High Need</span>
                  </div>
                  <Progress value={18} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Toothpaste</span>
                    <span className="text-sm text-amber-500">High Need</span>
                  </div>
                  <Progress value={22} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Pasta</span>
                    <span className="text-sm text-amber-500">High Need</span>
                  </div>
                  <Progress value={25} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Shampoo</span>
                    <span className="text-sm text-yellow-500">Moderate Need</span>
                  </div>
                  <Progress value={30} className="h-2 bg-gray-200" indicatorClassName="bg-yellow-500" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">
                View All Needed Items
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Volunteer Opportunities</CardTitle>
              <CardDescription>Sign up to help at the Comet Cupboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="bg-[#154734]/10 p-2 rounded-md">
                    <Calendar className="h-6 w-6 text-[#154734]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Inventory Stocking</h3>
                    <p className="text-sm text-gray-500 mt-1">Help organize and stock new donations</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>May 15, 2023</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>2:00 PM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Sign Up
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="bg-[#154734]/10 p-2 rounded-md">
                    <Calendar className="h-6 w-6 text-[#154734]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Distribution Day</h3>
                    <p className="text-sm text-gray-500 mt-1">Help distribute items to students</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>May 20, 2023</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>10:00 AM - 2:00 PM</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Sign Up
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="bg-[#154734]/10 p-2 rounded-md">
                    <Calendar className="h-6 w-6 text-[#154734]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Donation Drive</h3>
                    <p className="text-sm text-gray-500 mt-1">Help collect donations across campus</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>May 25, 2023</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>9:00 AM - 3:00 PM</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Sign Up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>See how your donations are making a difference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg border">
                  <Heart className="h-12 w-12 text-[#c75b12] mx-auto mb-4" />
                  <h3 className="text-xl font-bold">You've helped 42 students</h3>
                  <p className="text-gray-500 mt-2">
                    Your donations have directly supported 42 students in need this semester
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <h4 className="text-lg font-bold text-[#154734]">342</h4>
                    <p className="text-sm text-gray-500">Items donated</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border text-center">
                    <h4 className="text-lg font-bold text-[#154734]">18</h4>
                    <p className="text-sm text-gray-500">Volunteer hours</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button className="bg-[#154734] hover:bg-[#0d2c20]">View Detailed Impact Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
