import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Campaign from "@/lib/models/Campaign"
import Donation from "@/lib/models/Donation"
import Event from "@/lib/models/Event"
import Volunteer from "@/lib/models/Volunteer"
import User from "@/lib/models/User"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Aggregate data
    const [
      totalStats,
      monthlyDonations,
      campaignStats,
      eventStats,
      volunteerStats,
      blogStats,
      donationTrends,
      topCampaigns,
    ] = await Promise.all([
      // Total statistics
      Promise.all([
        Donation.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Donation.countDocuments({ status: "completed" }),
        User.countDocuments({ isActive: true }),
        Campaign.countDocuments({ isActive: true }),
        Event.countDocuments({ isActive: true }),
        Volunteer.countDocuments({ applicationStatus: "approved" }),
      ]),

      // Monthly donations
      Donation.aggregate([
        { $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),

      // Campaign statistics
      Campaign.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalGoal: { $sum: "$goal" },
            totalRaised: { $sum: "$raised" },
            activeCampaigns: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            completedCampaigns: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          },
        },
      ]),

      // Event statistics
      Event.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            upcomingEvents: { $sum: { $cond: [{ $gte: ["$date", now] }, 1, 0] } },
            totalAttendees: { $sum: "$currentAttendees" },
          },
        },
      ]),

      // Volunteer statistics
      Volunteer.aggregate([
        {
          $group: {
            _id: "$applicationStatus",
            count: { $sum: 1 },
            totalHours: { $sum: "$totalHours" },
          },
        },
      ]),

      // Blog statistics
      Blog.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalViews: { $sum: "$views" },
          },
        },
      ]),

      // Donation trends (last 6 months)
      Donation.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Top performing campaigns
      Campaign.find({ isActive: true })
        .sort({ raised: -1 })
        .limit(5)
        .select("title raised goal progressPercentage")
        .lean(),
    ])

    // Process results
    const [totalDonationsResult, totalDonationCount, totalUsers, totalCampaigns, totalEvents, totalVolunteers] =
      totalStats

    const totalDonations = totalDonationsResult[0]?.total || 0
    const monthlyDonationData = monthlyDonations[0] || { total: 0, count: 0 }
    const campaignData = campaignStats[0] || {}
    const eventData = eventStats[0] || {}

    // Process volunteer data
    const volunteerData = volunteerStats.reduce(
      (acc, item) => {
        acc[item._id] = { count: item.count, totalHours: item.totalHours }
        return acc
      },
      {} as Record<string, any>,
    )

    // Process blog data
    const blogData = blogStats.reduce(
      (acc, item) => {
        acc[item._id] = { count: item.count, totalViews: item.totalViews }
        return acc
      },
      {} as Record<string, any>,
    )

    // Format donation trends
    const formattedTrends = donationTrends.map((item) => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
      amount: item.total,
      donations: item.count,
    }))

    const dashboardData = {
      overview: {
        totalDonations,
        totalDonationCount,
        totalUsers,
        totalCampaigns,
        totalEvents,
        totalVolunteers,
        monthlyDonations: monthlyDonationData.total,
        monthlyDonationCount: monthlyDonationData.count,
      },
      campaigns: {
        totalGoal: campaignData.totalGoal || 0,
        totalRaised: campaignData.totalRaised || 0,
        activeCampaigns: campaignData.activeCampaigns || 0,
        completedCampaigns: campaignData.completedCampaigns || 0,
        progressPercentage: campaignData.totalGoal
          ? Math.round((campaignData.totalRaised / campaignData.totalGoal) * 100)
          : 0,
      },
      events: {
        upcomingEvents: eventData.upcomingEvents || 0,
        totalAttendees: eventData.totalAttendees || 0,
      },
      volunteers: {
        approved: volunteerData.approved?.count || 0,
        pending: volunteerData.pending?.count || 0,
        rejected: volunteerData.rejected?.count || 0,
        totalHours: Object.values(volunteerData).reduce((sum: number, v: any) => sum + (v.totalHours || 0), 0),
      },
      blogs: {
        published: blogData.published?.count || 0,
        draft: blogData.draft?.count || 0,
        totalViews: Object.values(blogData).reduce((sum: number, v: any) => sum + (v.totalViews || 0), 0),
      },
      trends: {
        donations: formattedTrends,
      },
      topCampaigns,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
