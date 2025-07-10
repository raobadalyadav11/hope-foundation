import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"
import { z } from "zod"

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
      const campaign = await Campaign.findById(campaignId)
      if (!campaign || !campaign.isActive || campaign.status !== "active") {
        return NextResponse.json({ error: "Campaign not found or not active" }, { status: 400 })
      }

      // Check if campaign has ended
      if (new Date(campaign.endDate) < new Date()) {
        return NextResponse.json({ error: "Campaign has ended" }, { status: 400 })
      }
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}_${session.user.id}`,
      notes: {
        donorId: session.user.id,
        campaignId: campaignId || "",
        donorName,
        donorEmail,
      },
    }

    const order = await razorpay.orders.create(options)

    // Save donation record
    const donation = await Donation.create({
      donorId: session.user.id,
      campaignId: campaignId || undefined,
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
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donationId: donation._id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
