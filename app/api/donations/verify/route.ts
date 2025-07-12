import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import { sendDonationConfirmation } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(sign.toString()).digest("hex")

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    await connectDB()

    // Update donation status
    const donation = await Donation.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "completed",
        receiptGenerated: true,
      },
      { new: true },
    )

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    // Update campaign raised amount if applicable
    if (donation.campaignId) {
      await Campaign.findByIdAndUpdate(donation.campaignId, {
        $inc: { raised: donation.amount },
      })
    }

    // Send confirmation email
    // await sendDonationConfirmation(donation) // Temporarily disabled

    return NextResponse.json({
      message: "Payment verified successfully",
      donation: {
        id: donation._id,
        amount: donation.amount,
        receiptNumber: donation.receiptNumber,
        status: donation.status,
      },
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
