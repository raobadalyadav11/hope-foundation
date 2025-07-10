import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Payment from "@/lib/models/Payment"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const gateway = searchParams.get("gateway") || "all"
    const range = searchParams.get("range") || "30d"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Calculate date range
    const now = new Date()
    const daysBack = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Build query
    const query: any = {
      createdAt: { $gte: startDate },
    }

    if (status !== "all") {
      query.status = status
    }

    if (gateway !== "all") {
      query.gateway = gateway
    }

    // Get payments with donation details
    const payments = await Payment.find(query)
      .populate({
        path: "donationId",
        populate: {
          path: "campaignId",
          select: "title",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Payment.countDocuments(query)

    // Get payment statistics
    const stats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalFees: { $sum: "$fees" },
          totalNetAmount: { $sum: "$netAmount" },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          refundedCount: {
            $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] },
          },
        },
      },
    ])

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        totalAmount: 0,
        totalFees: 0,
        totalNetAmount: 0,
        completedCount: 0,
        failedCount: 0,
        refundedCount: 0,
      },
    })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
