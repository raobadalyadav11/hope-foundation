import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { generateDonationReceipt } from "@/lib/pdf"

const receiptSchema = z.object({
  donationId: z.string().min(1, "Donation ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { donationId } = receiptSchema.parse(body)

    await connectDB()

    // Find the donation
    const donation = await Donation.findById(donationId)

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    // Check if user is authorized to access this donation
    if (donation.donorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Generate PDF receipt
    const pdfBase64 = await generateDonationReceipt(donation)

    return NextResponse.json({
      success: true,
      receipt: pdfBase64,
      donationId: donation._id,
      receiptNumber: donation.receiptNumber || `HF-${donation._id.toString().slice(-8).toUpperCase()}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error generating receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}