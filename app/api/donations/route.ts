import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const status = searchParams.get("status")
    const campaignId = searchParams.get("campaignId")

    const query: any = { donorId: session.user.id }

    if (status && status !== "all") {
      query.status = status
    }

    if (campaignId) {
      query.campaignId = campaignId
    }

    const donations = await Donation.find(query)
      .populate("campaignId", "title image")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Donation.countDocuments(query)

    // Calculate total donated amount
    const totalAmount = await Donation.aggregate([
      { $match: { donorId: session.user.id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      totalDonated: totalAmount[0]?.total || 0,
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
