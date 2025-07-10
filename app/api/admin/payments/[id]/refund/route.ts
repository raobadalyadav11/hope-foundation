import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Payment from "@/lib/models/Payment"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"
import { z } from "zod"

const refundSchema = z.object({
  amount: z.number().min(1, "Refund amount must be greater than 0"),
  reason: z.string().min(1, "Refund reason is required"),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, reason } = refundSchema.parse(body)

    await connectDB()

    // Get payment details
    const payment = await Payment.findById(params.id).populate("donationId")

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status !== "completed") {
      return NextResponse.json({ error: "Can only refund completed payments" }, { status: 400 })
    }

    if (amount > payment.amount) {
      return NextResponse.json({ error: "Refund amount cannot exceed payment amount" }, { status: 400 })
    }

    // Process refund with Razorpay
    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: amount * 100, // Convert to paise
      notes: {
        reason,
        refundedBy: session.user.id,
      },
    })

    // Update payment record
    await Payment.findByIdAndUpdate(params.id, {
      status: "refunded",
      refundId: refund.id,
      refundAmount: amount,
      refundReason: reason,
      refundedAt: new Date(),
    })

    // Update donation record
    await Donation.findByIdAndUpdate(payment.donationId._id, {
      status: "refunded",
      refundReason: reason,
      refundedAt: new Date(),
    })

    return NextResponse.json({
      message: "Refund processed successfully",
      refundId: refund.id,
      amount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error processing refund:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
