import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Campaign from "@/lib/models/Campaign"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const [totalVolunteers, totalCampaigns, donationStats, recentDonations, recentVolunteers] = await Promise.all([
      User.countDocuments({ role: "volunteer", isActive: true }),
      Campaign.countDocuments({ isActive: true }),
      Donation.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Donation.find({ status: "completed" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("donorName amount status createdAt"),
      User.find({ role: "volunteer" }).sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    ])

    const totalAmount = donationStats[0]?.total || 0
    const totalDonations = donationStats[0]?.count || 0

    return NextResponse.json({
      totalDonations,
      totalAmount,
      totalVolunteers,
      totalCampaigns,
      recentDonations,
      recentVolunteers,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
