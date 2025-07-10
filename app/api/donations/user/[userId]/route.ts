import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get donation statistics
    const stats = await Donation.aggregate([
      { $match: { donorId: params.userId, status: "completed" } },
      {
        $group: {
          _id: null,
          totalDonated: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
        },
      },
    ])

    // Get campaigns supported count
    const campaignsSupported = await Donation.distinct("campaignId", {
      donorId: params.userId,
      status: "completed",
      campaignId: { $ne: null },
    })

    // Get recent donations
    const donations = await Donation.find({
      donorId: params.userId,
    })
      .populate("campaignId", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const result = {
      totalDonated: stats[0]?.totalDonated || 0,
      totalDonations: stats[0]?.totalDonations || 0,
      campaignsSupported: campaignsSupported.length,
      donations,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching donor stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
