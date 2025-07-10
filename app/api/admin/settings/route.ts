import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"

// Mock settings data - in production, this would be stored in database
const defaultSettings = {
  general: {
    organizationName: "Hope Foundation",
    description:
      "Making a difference in communities worldwide through sustainable development, education, and humanitarian aid.",
    website: "https://hopefoundation.org",
    email: "info@hopefoundation.org",
    phone: "+91 98765 43210",
    address: "123 Hope Street, Mumbai, India 400001",
    timezone: "Asia/Kolkata",
    currency: "INR",
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@hopefoundation.org",
    fromName: "Hope Foundation",
    enableEmailNotifications: true,
  },
  notifications: {
    enablePushNotifications: true,
    enableSMSNotifications: false,
    donationNotifications: true,
    campaignNotifications: true,
    volunteerNotifications: true,
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
    },
  },
  payment: {
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
    enableRecurringDonations: true,
    minimumDonationAmount: 100,
    processingFee: 2.5,
  },
  appearance: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    logoUrl: "/placeholder-logo.png",
    faviconUrl: "/favicon.ico",
    customCSS: "",
  },
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // In production, fetch from database
    // For now, return default settings
    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await request.json()
    await connectDB()

    // In production, save to database
    // For now, just return success
    console.log("Settings updated:", settings)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
