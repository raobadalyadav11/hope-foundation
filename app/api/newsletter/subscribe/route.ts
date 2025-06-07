import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Newsletter from "@/lib/models/Newsletter"
import { sendNewsletterWelcome } from "@/lib/email"
import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  preferences: z
    .object({
      campaigns: z.boolean().optional(),
      events: z.boolean().optional(),
      blogs: z.boolean().optional(),
      newsletters: z.boolean().optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, preferences } = subscribeSchema.parse(body)

    await dbConnect()

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json({ error: "Email is already subscribed" }, { status: 400 })
      } else {
        // Reactivate subscription
        await Newsletter.findByIdAndUpdate(existingSubscriber._id, {
          isActive: true,
          subscribedAt: new Date(),
          unsubscribedAt: undefined,
          name: name || existingSubscriber.name,
          preferences: preferences || existingSubscriber.preferences,
        })

        return NextResponse.json({
          message: "Welcome back! Your subscription has been reactivated.",
        })
      }
    }

    // Create new subscription
    const subscriber = await Newsletter.create({
      email,
      name,
      preferences: preferences || {
        campaigns: true,
        events: true,
        blogs: true,
        newsletters: true,
      },
    })

    // Send welcome email
    await sendNewsletterWelcome(subscriber)

    return NextResponse.json(
      {
        message: "Successfully subscribed to our newsletter!",
        subscriberId: subscriber._id,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
