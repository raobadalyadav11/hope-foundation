import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Newsletter from "@/lib/models/Newsletter"
import { sendNewsletterWelcome } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.role || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || ""

    const query: any = {}
    
    if (status && status !== "all") {
      query.status = status
    }

    const total = await Newsletter.countDocuments(query)
    const subscriptions = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    return NextResponse.json({
      subscriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error("Error fetching newsletter subscriptions:", error)
    return NextResponse.json(
      { error: "Failed to fetch newsletter subscriptions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, name, tags = [], preferences = {} } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email })
    
    if (existingSubscription) {
      if (existingSubscription.status === "active") {
        return NextResponse.json(
          { error: "Email already subscribed to newsletter" },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        existingSubscription.status = "active"
        existingSubscription.resubscribedAt = new Date()
        await existingSubscription.save()
        
        // Send welcome email
        await sendNewsletterWelcome(email, name)
        
        return NextResponse.json(existingSubscription)
      }
    }

    // Create new subscription
    const subscription = new Newsletter({
      email,
      name,
      status: "active",
      tags,
      preferences: {
        frequency: preferences.frequency || "weekly",
        topics: preferences.topics || [],
        ...preferences
      },
      subscribedAt: new Date(),
      source: "website",
    })

    await subscription.save()

    // Send welcome email
    await sendNewsletterWelcome(email, name)

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error("Error creating newsletter subscription:", error)
    return NextResponse.json(
      { error: "Failed to create newsletter subscription" },
      { status: 500 }
    )
  }
}
