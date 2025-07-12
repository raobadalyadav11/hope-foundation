import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"
import { z } from "zod"
import { Types } from "mongoose"

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

    await connectDB()

    // Validate campaign if provided
    if (campaignId) {
      // Check if campaignId is a valid ObjectId
      if (!Types.ObjectId.isValid(campaignId)) {
        // If not a valid ObjectId, treat as cause category (skip campaign validation)
        console.log(`Campaign ID "${campaignId}" is not a valid ObjectId, treating as cause category`)
      } else {
        const campaign = await Campaign.findById(campaignId)
        if (!campaign || !campaign.isActive || campaign.status !== "active") {
          return NextResponse.json({ error: "Campaign not found or not active" }, { status: 400 })
        }
      }
    }

    // Generate unique subscription ID
    const subscriptionId = `sub_${Date.now()}_${session.user.id}`
    const planId = `plan_${Date.now()}_${frequency}`

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
      campaignId: (campaignId && Types.ObjectId.isValid(campaignId)) ? campaignId : undefined,
      subscriptionId,
      planId,
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
      subscriptionId,
      planId,
      amount,
      frequency,
      nextPaymentDate,
      message: "Recurring donation set up successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
