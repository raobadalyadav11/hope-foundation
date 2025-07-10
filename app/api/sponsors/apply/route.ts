import { type NextRequest, NextResponse } from "next/server"
import connectDB  from "@/lib/mongodb"
import Sponsor from "@/lib/models/Sponsor"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()

    // Validate required fields
    const requiredFields = ["companyName", "contactPerson", "email", "phone", "sponsorshipType"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new sponsor application
    const sponsor = await Sponsor.create(data)

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@hopefoundation.org",
      subject: "New Sponsor Application",
      html: `A new sponsor application has been submitted by ${data.companyName}. Please review it in the admin dashboard.`,
    })

    // Send confirmation email to sponsor
    await sendEmail({
      to: data.email,
      subject: "Sponsorship Application Received - Hope Foundation",
      html: `Dear ${data.contactPerson},\n\nThank you for your interest in sponsoring Hope Foundation. We have received your application and our team will review it shortly. We will contact you within 2-3 business days.\n\nBest regards,\nHope Foundation Team`,
    })

    return NextResponse.json({ success: true, id: sponsor._id }, { status: 201 })
  } catch (error: any) {
    console.error("Error in sponsor application:", error)
    return NextResponse.json({ error: "Failed to submit application", details: error.message }, { status: 500 })
  }
}
