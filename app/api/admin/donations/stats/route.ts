import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Calculate date range
    const now = new Date()
    const daysBack = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    const previousStartDate = new Date(startDate.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Get current period stats
    const [currentStats] = await Donation.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          uniqueDonors: { $addToSet: "$donorEmail" },
        },
      },
      {
        $project: {
          totalCount: 1,
          totalAmount: 1,
        },
      },
      {
        $project: {
          totalCount: 1,
          totalAmount: 1,
          uniqueDonors: { $size: "$uniqueDonors" },
          averageAmount: { $divide: ["$totalAmount", "$totalCount"] },
        },
      },
    ])

    // Get previous period stats for comparison
    const [previousStats] = await Donation.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: previousStartDate, $lt: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ])

    // Calculate growth percentages
    const growth = {
      count:
        previousStats?.totalCount > 0
          ? Math.round((((currentStats?.totalCount || 0) - previousStats.totalCount) / previousStats.totalCount) * 100)
          : 0,
      amount:
        previousStats?.totalAmount > 0
          ? Math.round(
              (((currentStats?.totalAmount || 0) - previousStats.totalAmount) / previousStats.totalAmount) * 100,
            )
          : 0,
    }

    // Get chart data for daily donations
    const chartData = await Donation.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          amount: 1,
          count: 1,
          _id: 0,
        },
      },
    ])

    return NextResponse.json({
      totalCount: currentStats?.totalCount || 0,
      totalAmount: currentStats?.totalAmount || 0,
      uniqueDonors: currentStats?.uniqueDonors || 0,
      averageAmount: Math.round(currentStats?.averageAmount || 0),
      growth,
      chartData,
    })
  } catch (error) {
    console.error("Error fetching donation stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
