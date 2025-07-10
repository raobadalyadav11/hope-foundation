import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Subscription from "@/lib/models/Subscription"
import Campaign from "@/lib/models/Campaign"
import { sendDonationConfirmation } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)
    await connectDB()

    switch (event.event) {
      case "subscription.charged":
        await handleSubscriptionCharged(event.payload.subscription.entity, event.payload.payment.entity)
        break

      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.payload.subscription.entity)
        break

      case "subscription.paused":
        await handleSubscriptionPaused(event.payload.subscription.entity)
        break

      case "subscription.resumed":
        await handleSubscriptionResumed(event.payload.subscription.entity)
        break

      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity)
        break
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleSubscriptionCharged(subscription: any, payment: any) {
  try {
    // Find subscription record
    const subscriptionRecord = await Subscription.findOne({
      subscriptionId: subscription.id,
    })

    if (!subscriptionRecord) {
      console.error("Subscription not found:", subscription.id)
      return
    }

    // Create donation record for this payment
    const donation = await Donation.create({
      donorId: subscriptionRecord.donorId,
      campaignId: subscriptionRecord.campaignId,
      amount: payment.amount / 100, // Convert from paise
      orderId: payment.order_id,
      paymentId: payment.id,
      status: "completed",
      paymentMethod: "razorpay",
      donorName: subscriptionRecord.donorName,
      donorEmail: subscriptionRecord.donorEmail,
      donorPhone: subscriptionRecord.donorPhone,
      isAnonymous: subscriptionRecord.isAnonymous,
      receiptGenerated: true,
      metadata: {
        subscriptionId: subscription.id,
        isRecurring: true,
      },
    })

    // Update subscription record
    const nextPaymentDate = new Date()
    if (subscriptionRecord.frequency === "monthly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
    } else if (subscriptionRecord.frequency === "quarterly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3)
    } else {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1)
    }

    await Subscription.findByIdAndUpdate(subscriptionRecord._id, {
      $inc: {
        totalPayments: 1,
        totalAmount: payment.amount / 100,
      },
      lastPaymentDate: new Date(),
      nextPaymentDate,
      failedPayments: 0, // Reset failed payments on successful payment
    })

    // Update campaign raised amount if applicable
    if (subscriptionRecord.campaignId) {
      await Campaign.findByIdAndUpdate(subscriptionRecord.campaignId, {
        $inc: { raised: payment.amount / 100 },
      })
    }

    // Send confirmation email
    await sendDonationConfirmation(donation)
  } catch (error) {
    console.error("Error handling subscription charged:", error)
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  await Subscription.findOneAndUpdate(
    { subscriptionId: subscription.id },
    {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelReason: "User cancelled",
    },
  )
}

async function handleSubscriptionPaused(subscription: any) {
  await Subscription.findOneAndUpdate({ subscriptionId: subscription.id }, { status: "paused" })
}

async function handleSubscriptionResumed(subscription: any) {
  await Subscription.findOneAndUpdate({ subscriptionId: subscription.id }, { status: "active" })
}

async function handlePaymentFailed(payment: any) {
  // Find subscription by payment details
  const subscription = await Subscription.findOne({
    subscriptionId: payment.subscription_id,
  })

  if (subscription) {
    await Subscription.findByIdAndUpdate(subscription._id, {
      $inc: { failedPayments: 1 },
    })

    // Cancel subscription after 3 failed payments
    if (subscription.failedPayments >= 2) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelReason: "Multiple payment failures",
      })
    }
  }
}
