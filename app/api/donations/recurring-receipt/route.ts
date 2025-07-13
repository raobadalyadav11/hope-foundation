import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Subscription from "@/lib/models/Subscription"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { generateDonationReceipt } from "@/lib/pdf"

const receiptSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { subscriptionId } = receiptSchema.parse(body)

    await connectDB()

    // Find the subscription
    const subscription = await Subscription.findOne({ subscriptionId })

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Check if user is authorized to access this subscription
    if (subscription.donorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Find the most recent donation for this subscription
    const donation = await Donation.findOne({
      donorId: subscription.donorId,
      orderId: { $regex: subscription.subscriptionId }
    }).sort({ createdAt: -1 })

    if (!donation) {
      return NextResponse.json({ error: "No donations found for this subscription" }, { status: 404 })
    }

    // Generate PDF receipt
    const pdfBase64 = await generateDonationReceipt({
      ...donation.toObject(),
      isRecurring: true,
      frequency: subscription.frequency,
      subscriptionId: subscription.subscriptionId
    })

    return NextResponse.json({
      success: true,
      receipt: pdfBase64,
      donationId: donation._id,
      receiptNumber: donation.receiptNumber || `HF-R${donation._id.toString().slice(-8).toUpperCase()}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error generating recurring receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}