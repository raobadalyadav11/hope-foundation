import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"
import { z } from "zod"

const subscriptionSchema = z.object({
  amount: z.number().min(100, "Minimum amount is ₹100 for recurring donations"),
  frequency: z.enum(["monthly", "quarterly", "yearly"]),
  campaignId: z.string().optional(),
  donorName: z.string().min(1, "Donor name is required"),
  donorEmail: z.string().email("Invalid email"),
  donorPhone: z.string().optional(),
  isAnonymous: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, frequency, campaignId, donorName, donorEmail, donorPhone, isAnonymous } =
      subscriptionSchema.parse(body)

    await dbConnect()

    // Validate campaign if provided
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId)
      if (!campaign || !campaign.isActive || campaign.status !== "active") {
        return NextResponse.json({ error: "Campaign not found or not active" }, { status: 400 })
      }
    }

    // Calculate interval based on frequency
    const intervalMap = {
      monthly: 1,
      quarterly: 3,
      yearly: 12,
    }

    // Create Razorpay plan
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: intervalMap[frequency],
      item: {
        name: campaignId ? `Donation to Campaign` : "General Donation",
        amount: amount * 100, // Convert to paise
        currency: "INR",
      },
      notes: {
        donorId: session.user.id,
        campaignId: campaignId || "",
        frequency,
      },
    })

    // Create Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      quantity: 1,
      total_count: frequency === "yearly" ? 10 : frequency === "quarterly" ? 40 : 120, // Limit subscriptions
      notes: {
        donorId: session.user.id,
        donorName,
        donorEmail,
      },
    })

    // Calculate next payment date
    const nextPaymentDate = new Date()
    if (frequency === "monthly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
    } else if (frequency === "quarterly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3)
    } else {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1)
    }

    // Save subscription record
    const subscriptionRecord = await Subscription.create({
      donorId: session.user.id,
      campaignId: campaignId || undefined,
      subscriptionId: subscription.id,
      planId: plan.id,
      amount,
      frequency,
      startDate: new Date(),
      nextPaymentDate,
      donorName,
      donorEmail,
      donorPhone,
      isAnonymous: isAnonymous || false,
      status: "active",
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      planId: plan.id,
      amount: amount,
      frequency,
      nextPaymentDate,
      shortUrl: subscription.short_url,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
