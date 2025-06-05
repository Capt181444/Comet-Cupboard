"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  description: string
  image: string
  category: string
  quantity: number
  limit: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getCartCount: () => number
  canPlaceOrder: () => { allowed: boolean; nextOrderDate?: Date }
  recordOrderPlaced: () => void
  hasReachedGlobalLimit: () => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [lastOrderDate, setLastOrderDate] = useState<Date | null>(null)

  // Load cart and last order date from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        setCartItems([])
      }
    }

    const savedLastOrderDate = localStorage.getItem("lastOrderDate")
    if (savedLastOrderDate) {
      try {
        setLastOrderDate(new Date(savedLastOrderDate))
      } catch (error) {
        console.error("Failed to parse last order date from localStorage:", error)
        setLastOrderDate(null)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Save last order date to localStorage whenever it changes
  useEffect(() => {
    if (lastOrderDate) {
      localStorage.setItem("lastOrderDate", lastOrderDate.toISOString())
    }
  }, [lastOrderDate])

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      // Calculate current total items in cart
      const currentTotalItems = prevItems.reduce((sum, item) => sum + item.quantity, 0)

      if (existingItem) {
        // If adding one more would exceed the global limit of 5, don't add
        if (currentTotalItems >= 5 && existingItem.quantity < item.quantity) {
          return prevItems
        }

        // If item exists, update quantity without exceeding limit
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: Math.min(i.limit, i.quantity + 1) } : i))
      } else {
        // If adding a new item would exceed the global limit of 5, don't add
        if (currentTotalItems >= 5) {
          return prevItems
        }

        // Add new item
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const currentItem = prevItems.find((item) => item.id === id)
      if (!currentItem) return prevItems

      // Calculate current total items in cart excluding the current item
      const otherItemsCount = prevItems.filter((item) => item.id !== id).reduce((sum, item) => sum + item.quantity, 0)

      // If the new quantity would exceed the global limit, cap it
      const maxAllowedQuantity = Math.min(quantity, 5 - otherItemsCount, currentItem.limit)

      return prevItems.map((item) => (item.id === id ? { ...item, quantity: maxAllowedQuantity } : item))
    })
  }

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  // Check if the user can place an order based on their last order date
  const canPlaceOrder = () => {
    if (!lastOrderDate) {
      return { allowed: true }
    }

    const currentDate = new Date()

    // Get the week number for the last order date
    const lastOrderWeek = getWeekNumber(lastOrderDate)

    // Get the week number for the current date
    const currentWeek = getWeekNumber(currentDate)

    // Get the year for both dates
    const lastOrderYear = lastOrderDate.getFullYear()
    const currentYear = currentDate.getFullYear()

    // Check if the current date is in a different week than the last order
    // Either different week number or different year
    const isDifferentWeek = lastOrderWeek !== currentWeek || lastOrderYear !== currentYear

    if (isDifferentWeek) {
      return { allowed: true }
    } else {
      // Calculate the next Monday (start of next week)
      const nextOrderDate = getNextWeekStartDate(lastOrderDate)
      return { allowed: false, nextOrderDate }
    }
  }

  // Record that an order has been placed
  const recordOrderPlaced = () => {
    const now = new Date()
    setLastOrderDate(now)
  }

  // Helper function to get the ISO week number of a date
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  // Helper function to get the next Monday after a given date
  const getNextWeekStartDate = (date: Date) => {
    const result = new Date(date)
    result.setDate(result.getDate() + ((8 - result.getDay()) % 7))
    return result
  }

  // Add a new function to check if the cart has reached the global limit
  const hasReachedGlobalLimit = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    return totalItems >= 5
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getCartCount,
        canPlaceOrder,
        recordOrderPlaced,
        hasReachedGlobalLimit,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
