import { type NextRequest, NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Payment from "@/lib/models/Payment"
import Campaign from "@/lib/models/Campaign"
import Subscription from "@/lib/models/Subscription"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.error("No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 })
    }

    await connectDB()

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object)
        break
      
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object)
        break

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    console.log("Processing successful Stripe payment:", paymentIntent.id)
    
    // Find donation by order ID
    const donation = await Donation.findOne({ orderId: paymentIntent.id })
    
    if (!donation) {
      console.error("Donation not found for payment intent:", paymentIntent.id)
      return
    }

    // Update donation status
    await Donation.findByIdAndUpdate(donation._id, {
      status: "completed",
      paymentId: paymentIntent.id,
      completedAt: new Date(),
    })

    // Create payment record
    await Payment.create({
      donationId: donation._id,
      orderId: paymentIntent.id,
      paymentId: paymentIntent.id,
      signature: "stripe_n/a",
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency.toUpperCase(),
      status: "completed",
      gateway: "stripe",
      gatewayResponse: paymentIntent,
      fees: Math.round(paymentIntent.amount * 0.029), // 2.9% Stripe fee + $0.30
      netAmount: (paymentIntent.amount / 100) - Math.round(paymentIntent.amount * 0.029),
    })

    // Update campaign raised amount
    if (donation.campaignId) {
      await Campaign.findByIdAndUpdate(donation.campaignId, {
        $inc: { raised: donation.amount },
      })
    }

    console.log("Stripe payment processed successfully for donation:", donation._id)
  } catch (error) {
    console.error("Error handling Stripe payment success:", error)
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    console.log("Processing failed Stripe payment:", paymentIntent.id)
    
    // Find and update donation
    const donation = await Donation.findOne({ orderId: paymentIntent.id })
    
    if (donation) {
      await Donation.findByIdAndUpdate(donation._id, {
        status: "failed",
        failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
      })
    }

    console.log("Stripe payment failure processed for donation:", donation?._id)
  } catch (error) {
    console.error("Error handling Stripe payment failure:", error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log("Processing successful Stripe subscription payment:", invoice.id)
    
    // Handle subscription payments (similar to Razorpay recurring donations)
    // This would integrate with the subscription system for recurring donations
    
  } catch (error) {
    console.error("Error handling Stripe invoice payment success:", error)
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log("Processing Stripe subscription created:", subscription.id)
    
    // Handle new subscription creation for recurring donations
    
  } catch (error) {
    console.error("Error handling Stripe subscription creation:", error)
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log("Processing Stripe subscription updated:", subscription.id)
    
    // Handle subscription updates
    
  } catch (error) {
    console.error("Error handling Stripe subscription update:", error)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log("Processing Stripe subscription deleted:", subscription.id)
    
    // Handle subscription cancellation
    
  } catch (error) {
    console.error("Error handling Stripe subscription deletion:", error)
  }
}