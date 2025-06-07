import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import CorporateCSR from "@/lib/models/CorporateCSR"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const data = await req.json()

    // Validate required fields
    const requiredFields = ["companyName", "industry", "contactPerson", "designation", "email", "phone"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new CSR inquiry
    const csrInquiry = await CorporateCSR.create(data)

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@hopefoundation.org",
      subject: "New Corporate CSR Inquiry",
      text: `A new CSR inquiry has been submitted by ${data.companyName}. Please review it in the admin dashboard.`,
    })

    // Send confirmation email to company
    await sendEmail({
      to: data.email,
      subject: "CSR Inquiry Received - Hope Foundation",
      text: `Dear ${data.contactPerson},\n\nThank you for your interest in CSR partnership with Hope Foundation. We have received your inquiry and our CSR team will review it shortly. We will contact you within 24 hours to discuss potential collaboration opportunities.\n\nBest regards,\nHope Foundation CSR Team`,
    })

    return NextResponse.json({ success: true, id: csrInquiry._id }, { status: 201 })
  } catch (error: any) {
    console.error("Error in CSR inquiry:", error)
    return NextResponse.json({ error: "Failed to submit inquiry", details: error.message }, { status: 500 })
  }
}
