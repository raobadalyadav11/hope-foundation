import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"
import { z } from "zod"
import { Types } from "mongoose"

const orderSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  campaignId: z.string().optional(),
  donorName: z.string().min(1, "Donor name is required"),
  donorEmail: z.string().email("Invalid email"),
  donorPhone: z.string().optional(),
  donorAddress: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, campaignId, donorName, donorEmail, donorPhone, donorAddress, isAnonymous, message } =
      orderSchema.parse(body)

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

        // Check if campaign has ended
        if (new Date(campaign.endDate) < new Date()) {
          return NextResponse.json({ error: "Campaign has ended" }, { status: 400 })
        }
      }
    }

    // Create Razorpay order or mock for development
    let order
    
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          donorId: session.user.id,
          campaignId: campaignId || "",
          donorName,
          donorEmail,
        },
      }
      order = await razorpay.orders.create(options)
    } else {
      // Mock order for development
      order = {
        id: `order_${Date.now()}`,
        amount: amount * 100,
        currency: "INR",
        status: "created"
      }
    }

    // Save donation record
    const donationData: any = {
      donorId: session.user.id.toString(), // Ensure it's a string
      amount,
      orderId: order.id,
      donorName,
      donorEmail,
      donorPhone,
      donorAddress,
      isAnonymous: isAnonymous || false,
      message,
      status: "pending",
      paymentMethod: "razorpay",
      currency: "INR", // Add default currency
    }

    // Add campaignId if valid ObjectId
    if (campaignId && Types.ObjectId.isValid(campaignId)) {
      donationData.campaignId = campaignId
    }
    // Add cause if it matches enum values
    else if (campaignId && ["education", "healthcare", "community", "emergency"].includes(campaignId)) {
      donationData.cause = campaignId
    }

    const donation = await Donation.create(donationData)

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donationId: donation._id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "mock_key",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
