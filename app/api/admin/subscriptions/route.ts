import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const frequency = searchParams.get("frequency") || "all"
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query
    const query: any = {}

    if (status !== "all") {
      query.status = status
    }

    if (frequency !== "all") {
      query.frequency = frequency
    }

    if (search) {
      query.$or = [{ donorName: { $regex: search, $options: "i" } }, { donorEmail: { $regex: search, $options: "i" } }]
    }

    // Get subscriptions
    const subscriptions = await Subscription.find(query)
      .populate("campaignId", "title")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Subscription.countDocuments(query)

    // Get subscription statistics
    const stats = await Subscription.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSubscriptions: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          activeCount: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          pausedCount: {
            $sum: { $cond: [{ $eq: ["$status", "paused"] }, 1, 0] },
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ])

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        totalSubscriptions: 0,
        totalAmount: 0,
        activeCount: 0,
        pausedCount: 0,
        cancelledCount: 0,
      },
    })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
