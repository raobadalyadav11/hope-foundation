import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Partnership from "@/lib/models/Partnership"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()

    // Validate required fields
    const requiredFields = [
      "organizationName",
      "organizationType",
      "contactPerson",
      "email",
      "phone",
      "partnershipType",
      "description",
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new partnership application
    const partnership = await Partnership.create(data)

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@hopefoundation.org",
      subject: "New Partnership Application",
      text: `A new partnership application has been submitted by ${data.organizationName}. Please review it in the admin dashboard.`,
    })

    // Send confirmation email to partner
    await sendEmail({
      to: data.email,
      subject: "Partnership Application Received - Hope Foundation",
      text: `Dear ${data.contactPerson},\n\nThank you for your interest in partnering with Hope Foundation. We have received your application and our team will review it shortly. We will contact you within 3-5 business days to discuss potential collaboration opportunities.\n\nBest regards,\nHope Foundation Team`,
    })

    return NextResponse.json({ success: true, id: partnership._id }, { status: 201 })
  } catch (error: any) {
    console.error("Error in partnership application:", error)
    return NextResponse.json({ error: "Failed to submit application", details: error.message }, { status: 500 })
  }
}
