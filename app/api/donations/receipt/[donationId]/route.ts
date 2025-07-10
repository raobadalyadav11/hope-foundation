import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { donationId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const donation = await Donation.findById(params.donationId).populate("campaignId", "title").lean()

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    // Check if user owns this donation or is admin
    if (donation.donorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate PDF receipt (simplified version)
    const receiptData = {
      receiptNumber: donation.receiptNumber,
      donorName: donation.donorName,
      amount: donation.amount,
      date: donation.createdAt,
      campaign: donation.campaignId?.title || "General Donation",
      status: donation.status,
    }

    // In a real implementation, you would generate a PDF here
    // For now, return the receipt data as JSON
    return NextResponse.json(receiptData)
  } catch (error) {
    console.error("Error generating receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
