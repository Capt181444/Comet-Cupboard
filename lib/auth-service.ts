// Enhanced authentication service with mock user database

// Mock user database - in a real app, this would be in a database
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  userType: string
  studentId?: string
  lastOrderDate?: string // Track when the user last placed an order
  orderLimitReset?: boolean // Flag to indicate if the weekly limit has been reset by admin
}

// Initialize with some demo users
const initializeMockUsers = (): User[] => {
  const storedUsers = localStorage.getItem("mockUsers")
  if (storedUsers) {
    return JSON.parse(storedUsers)
  }

  // Default users if none exist
  const defaultUsers = [
    {
      id: "1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@utdallas.edu",
      password: "Admin123!",
      userType: "admin",
    },
    {
      id: "2",
      firstName: "Student",
      lastName: "User",
      email: "student@utdallas.edu",
      password: "Student123!",
      userType: "student",
      studentId: "2023001",
      lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: "3",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@utdallas.edu",
      password: "Student123!",
      userType: "student",
      studentId: "2023002",
      lastOrderDate: new Date().toISOString(), // Today
    },
    {
      id: "4",
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@utdallas.edu",
      password: "Student123!",
      userType: "student",
      studentId: "2023003",
    },
  ]

  localStorage.setItem("mockUsers", JSON.stringify(defaultUsers))
  return defaultUsers
}

// Get all users
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  return initializeMockUsers()
}

// Find user by email
export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

// Find user by ID
export const findUserById = (id: string): User | undefined => {
  const users = getUsers()
  return users.find((user) => user.id === id)
}

// Add a new user
export const addUser = (user: Omit<User, "id">): User => {
  const users = getUsers()
  const newUser = {
    ...user,
    id: Date.now().toString(),
  }

  users.push(newUser)
  localStorage.setItem("mockUsers", JSON.stringify(users))
  return newUser
}

// Update user
export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], ...updates }
  localStorage.setItem("mockUsers", JSON.stringify(users))
  return users[userIndex]
}

// Login function
export const login = (
  email: string,
  password: string,
  userType: string,
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const user = findUserByEmail(email)

      if (!user) {
        resolve({ success: false, message: "User not found. Please check your email or register." })
        return
      }

      if (user.userType !== userType) {
        resolve({ success: false, message: `This email is registered as a ${user.userType}, not a ${userType}.` })
        return
      }

      if (user.password !== password) {
        resolve({ success: false, message: "Incorrect password. Please try again." })
        return
      }

      // Store user info in localStorage
      localStorage.setItem("userType", userType)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userId", user.id)
      localStorage.setItem("isAuthenticated", "true")

      resolve({ success: true, message: "Login successful" })
    }, 1000)
  })
}

// Admin login as user (impersonation)
export const adminLoginAsUser = (userId: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const user = findUserById(userId)

      if (!user) {
        resolve({ success: false, message: "User not found." })
        return
      }

      if (user.userType !== "student") {
        resolve({ success: false, message: "You can only login as student users." })
        return
      }

      // Store original admin info for returning back
      const currentUserId = localStorage.getItem("userId")
      const currentUserType = localStorage.getItem("userType")
      const currentUserEmail = localStorage.getItem("userEmail")

      if (currentUserId && currentUserType === "admin") {
        localStorage.setItem("adminId", currentUserId)
        localStorage.setItem("adminEmail", currentUserEmail || "")
      }

      // Store impersonated user info in localStorage
      localStorage.setItem("userType", user.userType)
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userId", user.id)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("isImpersonating", "true")

      resolve({ success: true, message: "Login as user successful" })
    }, 1000)
  })
}

// Return to admin account after impersonation
export const returnToAdmin = (): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const adminId = localStorage.getItem("adminId")
      const adminEmail = localStorage.getItem("adminEmail")

      if (!adminId || !adminEmail) {
        resolve({ success: false, message: "No admin session found." })
        return
      }

      // Restore admin info
      localStorage.setItem("userType", "admin")
      localStorage.setItem("userEmail", adminEmail)
      localStorage.setItem("userId", adminId)
      localStorage.setItem("isAuthenticated", "true")

      // Clear impersonation flags
      localStorage.removeItem("adminId")
      localStorage.removeItem("adminEmail")
      localStorage.removeItem("isImpersonating")

      resolve({ success: true, message: "Returned to admin account successfully" })
    }, 1000)
  })
}

// Check if currently impersonating
export const isImpersonating = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isImpersonating") === "true"
}

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    // Clear user session
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("adminId")
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("isImpersonating")
    resolve()
  })
}

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAuthenticated") === "true"
}

export const getUserType = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userType")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userId = localStorage.getItem("userId")
  if (!userId) return null

  const users = getUsers()
  return users.find((user) => user.id === userId) || null
}

// Reset weekly order limit for a student
export const resetWeeklyOrderLimit = (userId: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = findUserById(userId)

      if (!user) {
        resolve({ success: false, message: "User not found." })
        return
      }

      if (user.userType !== "student") {
        resolve({ success: false, message: "Only student order limits can be reset." })
        return
      }

      // Reset the user's order limit
      updateUser(userId, {
        orderLimitReset: true,
        lastOrderDate: undefined, // Clear last order date to allow new orders
      })

      resolve({ success: true, message: "Weekly order limit reset successfully." })
    }, 1000)
  })
}

// Check if the user can place an order based on their last order date and admin reset
export const canPlaceOrder = (userId: string): { allowed: boolean; nextOrderDate?: Date } => {
  const user = findUserById(userId)

  if (!user) {
    return { allowed: false }
  }

  // If admin has reset the limit, allow ordering
  if (user.orderLimitReset) {
    return { allowed: true }
  }

  // If no last order date, they can place an order
  if (!user.lastOrderDate) {
    return { allowed: true }
  }

  const lastOrderDate = new Date(user.lastOrderDate)
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
export const recordOrderPlaced = (userId: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = findUserById(userId)

      if (!user) {
        resolve({ success: false, message: "User not found." })
        return
      }

      // Update the user's last order date and reset the admin override
      updateUser(userId, {
        lastOrderDate: new Date().toISOString(),
        orderLimitReset: false, // Clear any admin reset
      })

      resolve({ success: true, message: "Order recorded successfully." })
    }, 500)
  })
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

// Password reset functions
interface ResetRequest {
  email: string
  passcode: string
  expires: number
}

export const generateResetPasscode = (
  email: string,
): Promise<{ success: boolean; message: string; passcode?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = findUserByEmail(email)

      if (!user) {
        resolve({ success: false, message: "Email not found. Please check your email or register." })
        return
      }

      // Generate a 6-digit passcode
      const passcode = Math.floor(100000 + Math.random() * 900000).toString()

      // Store the reset request (in a real app, this would be in a database)
      const resetRequests = JSON.parse(localStorage.getItem("resetRequests") || "[]")

      // Remove any existing requests for this email
      const filteredRequests = resetRequests.filter((req: ResetRequest) => req.email !== email)

      // Add new request with 15-minute expiration
      const newRequest: ResetRequest = {
        email,
        passcode,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      }

      filteredRequests.push(newRequest)
      localStorage.setItem("resetRequests", JSON.stringify(filteredRequests))

      // In a real app, send email with passcode
      console.log(`DEMO: Password reset passcode for ${email}: ${passcode}`)

      resolve({
        success: true,
        message: "Password reset passcode sent to your email.",
        passcode, // Only included for demo purposes
      })
    }, 1000)
  })
}

export const verifyResetPasscode = (
  email: string,
  passcode: string,
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resetRequests = JSON.parse(localStorage.getItem("resetRequests") || "[]")
      const request = resetRequests.find((req: ResetRequest) => req.email === email && req.passcode === passcode)

      if (!request) {
        resolve({ success: false, message: "Invalid or expired passcode. Please try again." })
        return
      }

      if (request.expires < Date.now()) {
        // Remove expired request
        const filteredRequests = resetRequests.filter(
          (req: ResetRequest) => !(req.email === email && req.passcode === passcode),
        )
        localStorage.setItem("resetRequests", JSON.stringify(filteredRequests))

        resolve({ success: false, message: "Passcode has expired. Please request a new one." })
        return
      }

      resolve({ success: true, message: "Passcode verified successfully." })
    }, 1000)
  })
}

export const resetPassword = (
  email: string,
  passcode: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      // First verify the passcode
      const verification = await verifyResetPasscode(email, passcode)

      if (!verification.success) {
        resolve(verification)
        return
      }

      // Update the user's password
      const user = findUserByEmail(email)
      if (!user) {
        resolve({ success: false, message: "User not found." })
        return
      }

      updateUser(user.id, { password: newPassword })

      // Remove the reset request
      const resetRequests = JSON.parse(localStorage.getItem("resetRequests") || "[]")
      const filteredRequests = resetRequests.filter(
        (req: ResetRequest) => !(req.email === email && req.passcode === passcode),
      )
      localStorage.setItem("resetRequests", JSON.stringify(filteredRequests))

      resolve({ success: true, message: "Password reset successfully." })
    }, 1000)
  })
}

// Register a new user
export const registerUser = (userData: Omit<User, "id">): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingUser = findUserByEmail(userData.email)

      if (existingUser) {
        resolve({ success: false, message: "Email already registered. Please login instead." })
        return
      }

      addUser(userData)

      resolve({ success: true, message: "Registration successful." })
    }, 1000)
  })
}
