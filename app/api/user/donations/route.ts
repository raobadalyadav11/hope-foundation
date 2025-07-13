import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    // Find all donations for the user
    const donations = await Donation.find({ 
      donorId: session.user.id 
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()

    return NextResponse.json({
      donations: donations.map((donation: any) => ({
        _id: donation._id,
        amount: donation.amount,
        status: donation.status,
        createdAt: donation.createdAt,
        receiptNumber: donation.receiptNumber,
        cause: donation.cause,
        campaignId: donation.campaignId,
        paymentMethod: donation.paymentMethod,
        isAnonymous: donation.isAnonymous,
      })),
    })
  } catch (error) {
    console.error("Error fetching user donations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}