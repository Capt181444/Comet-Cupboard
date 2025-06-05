import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#c75b12] text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl">Comet Cupboard</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/comet-cupboard" className="font-medium hover:underline">
              Home
            </Link>
            <Link href="/comet-cupboard/about" className="font-medium hover:underline">
              About
            </Link>
            <Link href="/comet-cupboard/contact" className="font-medium hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#c75b12]/10 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#154734]">UTD Comet Cupboard</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
              A digital platform connecting students with essential resources, streamlining inventory management, and
              enhancing community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/comet-cupboard/login?type=student">
                <Button size="lg" className="bg-[#c75b12] hover:bg-[#a84a0f] text-white">
                  Student Portal
                </Button>
              </Link>
              <Link href="/comet-cupboard/login?type=admin">
                <Button size="lg" className="bg-[#154734] hover:bg-[#0d2c20] text-white">
                  Admin Dashboard
                </Button>
              </Link>
              <Link href="/comet-cupboard/donor">
                <Button size="lg" variant="outline" className="border-[#154734] text-[#154734]">
                  Donor Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#154734]">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#c75b12]">For Students</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Check real-time inventory availability</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Reserve items and schedule pickups</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Receive notifications for new donations</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Secure and private account management</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/comet-cupboard/student">
                    <Button className="w-full bg-[#c75b12] hover:bg-[#a84a0f] text-white">Student Portal</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#154734]">For Administrators</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#154734] shrink-0 mt-0.5" />
                    <span>Smart inventory management tools</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#154734] shrink-0 mt-0.5" />
                    <span>Real-time alerts for low stock items</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#154734] shrink-0 mt-0.5" />
                    <span>Usage analytics and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#154734] shrink-0 mt-0.5" />
                    <span>Student request management</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/comet-cupboard/admin">
                    <Button className="w-full bg-[#154734] hover:bg-[#0d2c20] text-white">Admin Dashboard</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#c75b12]">For Donors & Volunteers</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>View impact metrics and donation needs</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Schedule donation drop-offs</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Sign up for volunteer opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 text-[#c75b12] shrink-0 mt-0.5" />
                    <span>Track donation history and impact</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/comet-cupboard/donor">
                    <Button className="w-full bg-[#c75b12] hover:bg-[#a84a0f] text-white">Donor Portal</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#154734] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Comet Cupboard</h3>
              <p className="text-sm text-gray-300">
                Providing essential resources to UTD students in need through an innovative digital platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/comet-cupboard/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/comet-cupboard/faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/comet-cupboard/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/comet-cupboard/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-sm text-gray-300">
                University of Texas at Dallas
                <br />
                800 W Campbell Rd
                <br />
                Richardson, TX 75080
                <br />
                cometcupboard@utdallas.edu
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} UTD Comet Cupboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
