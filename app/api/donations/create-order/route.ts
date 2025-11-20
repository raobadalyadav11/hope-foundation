import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"
import razorpay from "@/lib/razorpay"
import stripe from "@/lib/stripe"
import { selectPaymentGateway, convertCurrency } from "@/lib/stripe"
import { z } from "zod"
import { Types } from "mongoose"

const orderSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
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
    const { amount, currency, campaignId, donorName, donorEmail, donorPhone, donorAddress, isAnonymous, message } =
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

    // Select payment gateway based on currency
    const gateway = selectPaymentGateway(currency)
    
    // Create payment order based on selected gateway
    let order
    let paymentMethod = gateway
    
    if (gateway === 'razorpay') {
      // Convert to INR if needed for Razorpay
      const razorpayAmount = currency === 'INR' ? amount : Math.round(convertCurrency(amount, currency, 'INR'))
      
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const options = {
          amount: razorpayAmount * 100, // Convert to paise
          currency: "INR",
          receipt: `rcpt_${Date.now().toString().slice(-8)}`,
          notes: {
            donorId: session.user.id,
            campaignId: campaignId || "",
            donorName,
            donorEmail,
            originalAmount: amount,
            originalCurrency: currency,
          },
        }
        order = await razorpay.orders.create(options)
      } else {
        // Mock Razorpay order for development
        order = {
          id: `order_${Date.now()}`,
          amount: razorpayAmount * 100,
          currency: "INR",
          status: "created"
        }
      }
    } else if (gateway === 'stripe') {
      // Use Stripe for international payments
      if (process.env.STRIPE_SECRET_KEY) {
        const stripeAmount = currency === 'USD' ? amount * 100 : currency === 'EUR' ? amount * 100 : amount * 100 // Convert to cents
        
        const stripeOrder = await stripe.paymentIntents.create({
          amount: Math.round(stripeAmount),
          currency: currency.toLowerCase(),
          metadata: {
            donorId: session.user.id,
            campaignId: campaignId || "",
            donorName,
            donorEmail,
          },
        })
        
        order = {
          id: stripeOrder.id,
          amount: stripeOrder.amount,
          currency: stripeOrder.currency.toUpperCase(),
          status: stripeOrder.status
        }
      } else {
        // Mock Stripe order for development
        order = {
          id: `pi_${Date.now()}`,
          amount: amount * 100,
          currency: currency,
          status: "requires_payment_method"
        }
      }
    } else {
      return NextResponse.json({ error: "Unsupported currency or payment gateway" }, { status: 400 })
    }

    // Save donation record
    const donationData: any = {
      donorId: session.user.id.toString(),
      amount,
      currency,
      orderId: order.id,
      donorName,
      donorEmail,
      donorPhone,
      donorAddress,
      isAnonymous: isAnonymous || false,
      message,
      status: "pending",
      paymentMethod,
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
      gateway,
      paymentMethod,
      // Return appropriate keys based on gateway
      razorpayKey: gateway === 'razorpay' ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "mock_key" : undefined,
      stripePublicKey: gateway === 'stripe' ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock_key" : undefined,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
