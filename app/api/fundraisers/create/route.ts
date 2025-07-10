import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Fundraiser from "@/lib/models/Fundraiser"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const data = await req.json()

    // Validate required fields
    const requiredFields = [
      "campaignTitle",
      "category",
      "goal",
      "description",
      "story",
      "organizerName",
      "organizerEmail",
      "organizerPhone",
      "type",
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new fundraiser
    const fundraiser = await Fundraiser.create({
      ...data,
      organizerId: session.user.id,
    })

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@hopefoundation.org",
      subject: "New Fundraiser Campaign",
      html: `A new fundraiser campaign "${data.campaignTitle}" has been created by ${data.organizerName}. Please review it in the admin dashboard.`,
    })

    // Send confirmation email to organizer
    await sendEmail({
      to: data.organizerEmail,
      subject: "Fundraiser Campaign Created - Hope Foundation",
      html: `Dear ${data.organizerName},\n\nThank you for creating a fundraiser campaign with Hope Foundation. Your campaign "${data.campaignTitle}" has been submitted for review. We will notify you once it's approved and live on our platform.\n\nBest regards,\nHope Foundation Team`,
    })

    return NextResponse.json({ success: true, id: fundraiser._id }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating fundraiser:", error)
    return NextResponse.json({ error: "Failed to create fundraiser", details: error.message }, { status: 500 })
  }
}
