import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Comet Cupboard",
  description: "A digital platform connecting students with essential resources",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
