import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import Event from "@/lib/models/Event"
import Volunteer from "@/lib/models/Volunteer"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d" // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get donation analytics
    const donationStats = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
          status: "completed"
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
          avgDonation: { $avg: "$amount" }
        }
      }
    ])

    // Get donations by day
    const donationsByDay = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
          status: "completed"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    // Get top campaigns
    const topCampaigns = await Campaign.aggregate([
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "campaignId",
          as: "donations"
        }
      },
      {
        $match: {
          "donations.status": "completed"
        }
      },
      {
        $addFields: {
          totalRaised: { $sum: "$donations.amount" },
          donationCount: { $size: "$donations" }
        }
      },
      {
        $sort: { totalRaised: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          title: 1,
          totalRaised: 1,
          donationCount: 1,
          goal: 1,
          image: 1
        }
      }
    ])

    // Get volunteer statistics
    const volunteerStats = await Volunteer.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ])

    // Get event statistics
    const eventStats = await Event.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalAttendees: { $sum: "$currentAttendees" },
          avgAttendance: { $avg: "$currentAttendees" }
        }
      }
    ])

    // Get user growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    // Calculate summary metrics
    const totalUsers = await User.countDocuments({ isActive: true })
    const totalVolunteers = await Volunteer.countDocuments({ status: "active" })
    const totalEvents = await Event.countDocuments({})
    const activeCampaigns = await Campaign.countDocuments({ isActive: true })

    const analytics = {
      overview: {
        totalDonations: donationStats[0]?.totalAmount || 0,
        totalDonors: donationStats[0]?.totalDonations || 0,
        avgDonation: Math.round(donationStats[0]?.avgDonation || 0),
        totalVolunteers,
        totalUsers,
        totalEvents,
        activeCampaigns
      },
      trends: {
        donationsByDay: donationsByDay.map(item => ({
          date: item._id,
          amount: item.amount,
          count: item.count
        })),
        volunteerGrowth: volunteerStats.map(item => ({
          month: item._id.month,
          year: item._id.year,
          count: item.count
        })),
        userGrowth: userGrowth.map(item => ({
          date: item._id,
          count: item.count
        }))
      },
      topCampaigns,
      eventStats: eventStats[0] || {
        totalEvents: 0,
        totalAttendees: 0,
        avgAttendance: 0
      },
      dateRange: {
        start: startDate,
        end: now,
        label: range
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}