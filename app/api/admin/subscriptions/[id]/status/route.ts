import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!["active", "paused", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await connectDB()

    const subscription = await Subscription.findById(params.id)

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Update subscription in Razorpay
    try {
      if (status === "paused") {
        await razorpay.subscriptions.pause(subscription.subscriptionId, {
          pause_at: "now",
        })
      } else if (status === "active" && subscription.status === "paused") {
        await razorpay.subscriptions.resume(subscription.subscriptionId, {
          resume_at: "now",
        })
      } else if (status === "cancelled") {
        await razorpay.subscriptions.cancel(subscription.subscriptionId, {
          cancel_at_cycle_end: 0,
        })
      }
    } catch (razorpayError) {
      console.error("Razorpay error:", razorpayError)
      // Continue with local update even if Razorpay fails
    }

    // Update local subscription
    const updateData: any = { status }
    if (status === "cancelled") {
      updateData.cancelledAt = new Date()
      updateData.cancelReason = "Cancelled by admin"
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(params.id, updateData, { new: true })

    return NextResponse.json({
      message: "Subscription status updated successfully",
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error("Error updating subscription status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
