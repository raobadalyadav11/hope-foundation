import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import { sendDonationReceipt } from "@/lib/email"

// This webhook handles Razorpay payment events for recurring donations
export async function POST(request: NextRequest) {
  try {
    // Get the webhook payload
    const body = await request.json()
    const signature = request.headers.get("x-razorpay-signature")
    
    // Verify webhook signature
    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex")
      
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }
    }
    
    // Connect to database
    await connectDB()
    
    // Handle different event types
    const event = body.event
    
    if (event === "payment_link.paid") {
      // Payment link was paid - this could be for a recurring donation
      const paymentLink = body.payload.payment_link
      const payment = body.payload.payment
      
      // Check if this is a subscription payment
      if (paymentLink.notes?.subscriptionId) {
        const subscriptionId = paymentLink.notes.subscriptionId
        
        // Find the subscription
        const subscription = await Subscription.findOne({ subscriptionId })
        
        if (subscription) {
          // Update subscription stats
          await Subscription.findByIdAndUpdate(subscription._id, {
            $inc: { totalPayments: 1, totalAmount: payment.amount / 100 },
            lastPaymentDate: new Date(),
          })
          
          // Create a donation record for this payment
          const donation = await Donation.create({
            donorId: subscription.donorId,
            campaignId: subscription.campaignId,
            amount: payment.amount / 100,
            currency: payment.currency,
            orderId: payment.order_id || payment.id,
            paymentId: payment.id,
            status: "completed",
            paymentMethod: "razorpay",
            donorName: subscription.donorName,
            donorEmail: subscription.donorEmail,
            donorPhone: subscription.donorPhone,
            isAnonymous: subscription.isAnonymous,
            receiptGenerated: true,
            receiptNumber: `HF-R${Date.now().toString().slice(-8).toUpperCase()}`,
            taxDeductible: true,
          })
          
          // Update campaign raised amount if applicable
          if (subscription.campaignId) {
            await Campaign.findByIdAndUpdate(subscription.campaignId, {
              $inc: { raised: payment.amount / 100 },
            })
          }
          
          // Send receipt email
          try {
            await sendDonationReceipt(donation)
          } catch (emailError) {
            console.error("Error sending receipt email:", emailError)
          }
        }
      }
    } else if (event === "subscription.charged") {
      // Subscription was charged - this is for automatic recurring payments
      const subscription = body.payload.subscription
      const payment = body.payload.payment
      
      // Find our subscription record
      const subscriptionRecord = await Subscription.findOne({
        subscriptionId: subscription.id,
      })
      
      if (subscriptionRecord) {
        // Update subscription stats
        await Subscription.findByIdAndUpdate(subscriptionRecord._id, {
          $inc: { totalPayments: 1, totalAmount: payment.amount / 100 },
          lastPaymentDate: new Date(),
          nextPaymentDate: new Date(subscription.current_end * 1000), // Convert Unix timestamp to Date
        })
        
        // Create a donation record for this payment
        const donation = await Donation.create({
          donorId: subscriptionRecord.donorId,
          campaignId: subscriptionRecord.campaignId,
          amount: payment.amount / 100,
          currency: payment.currency,
          orderId: payment.order_id || payment.id,
          paymentId: payment.id,
          status: "completed",
          paymentMethod: "razorpay",
          donorName: subscriptionRecord.donorName,
          donorEmail: subscriptionRecord.donorEmail,
          donorPhone: subscriptionRecord.donorPhone,
          isAnonymous: subscriptionRecord.isAnonymous,
          receiptGenerated: true,
          receiptNumber: `HF-R${Date.now().toString().slice(-8).toUpperCase()}`,
          taxDeductible: true,
        })
        
        // Update campaign raised amount if applicable
        if (subscriptionRecord.campaignId) {
          await Campaign.findByIdAndUpdate(subscriptionRecord.campaignId, {
            $inc: { raised: payment.amount / 100 },
          })
        }
        
        // Send receipt email
        try {
          await sendDonationReceipt(donation)
        } catch (emailError) {
          console.error("Error sending receipt email:", emailError)
        }
      }
    } else if (event === "subscription.cancelled") {
      // Subscription was cancelled
      const subscription = body.payload.subscription
      
      await Subscription.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          status: "cancelled",
          cancelledAt: new Date(),
          cancelReason: "Cancelled via Razorpay",
        }
      )
    }
    
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}