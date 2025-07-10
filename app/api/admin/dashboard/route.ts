import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"
import Campaign from "@/lib/models/Campaign"
import Event from "@/lib/models/Event"
import Volunteer from "@/lib/models/Volunteer"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Calculate date range
    const now = new Date()
    const daysBack = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Get basic counts
    const [totalDonations, totalAmount, totalVolunteers, totalCampaigns, totalEvents, totalBlogPosts] =
      await Promise.all([
        Donation.countDocuments({ status: "completed" }),
        Donation.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]).then((result) => result[0]?.total || 0),
        Volunteer.countDocuments({ applicationStatus: "approved" }),
        Campaign.countDocuments({ isActive: true }),
        Event.countDocuments({ isActive: true }),
        Blog.countDocuments({ status: "published" }),
      ])

    // Get monthly growth data
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [lastMonthDonations, thisMonthDonations] = await Promise.all([
      Donation.countDocuments({
        status: "completed",
        createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
      }),
      Donation.countDocuments({
        status: "completed",
        createdAt: { $gte: thisMonthStart },
      }),
    ])

    const [lastMonthVolunteers, thisMonthVolunteers] = await Promise.all([
      Volunteer.countDocuments({
        applicationStatus: "approved",
        createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
      }),
      Volunteer.countDocuments({
        applicationStatus: "approved",
        createdAt: { $gte: thisMonthStart },
      }),
    ])

    const [lastMonthCampaigns, thisMonthCampaigns] = await Promise.all([
      Campaign.countDocuments({
        isActive: true,
        createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
      }),
      Campaign.countDocuments({
        isActive: true,
        createdAt: { $gte: thisMonthStart },
      }),
    ])

    // Calculate growth percentages
    const monthlyGrowth = {
      donations:
        lastMonthDonations > 0 ? Math.round(((thisMonthDonations - lastMonthDonations) / lastMonthDonations) * 100) : 0,
      volunteers:
        lastMonthVolunteers > 0
          ? Math.round(((thisMonthVolunteers - lastMonthVolunteers) / lastMonthVolunteers) * 100)
          : 0,
      campaigns:
        lastMonthCampaigns > 0 ? Math.round(((thisMonthCampaigns - lastMonthCampaigns) / lastMonthCampaigns) * 100) : 0,
    }

    // Get recent activity
    const recentDonations = await Donation.find({ status: "completed" })
      .populate("donorId", "name")
      .populate("campaignId", "title")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    const recentVolunteers = await Volunteer.find({ applicationStatus: "approved" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    const recentCampaigns = await Campaign.find({ isActive: true })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()

    const recentEvents = await Event.find({ isActive: true })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()

    // Format recent activity
    const recentActivity = [
      ...recentDonations.map((donation) => ({
        id: donation._id.toString(),
        type: "donation" as const,
        title: `Donation of ₹${donation.amount.toLocaleString()}`,
        amount: donation.amount,
        user: donation.donorName || "Anonymous",
        timestamp: donation.createdAt,
      })),
      ...recentVolunteers.map((volunteer) => ({
        id: volunteer._id.toString(),
        type: "volunteer" as const,
        title: "New volunteer registered",
        user: volunteer.userId?.name || "Unknown",
        timestamp: volunteer.createdAt,
      })),
      ...recentCampaigns.map((campaign) => ({
        id: campaign._id.toString(),
        type: "campaign" as const,
        title: `Campaign created: ${campaign.title}`,
        user: campaign.createdBy?.name || "Unknown",
        timestamp: campaign.createdAt,
      })),
      ...recentEvents.map((event) => ({
        id: event._id.toString(),
        type: "event" as const,
        title: `Event created: ${event.title}`,
        user: event.createdBy?.name || "Unknown",
        timestamp: event.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    // Get chart data for donations
    const donationChartData = await Donation.aggregate([
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
    ])

    // Get campaign categories data
    const campaignCategoriesData = await Campaign.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          amount: { $sum: "$raised" },
        },
      },
    ])

    // Get volunteer growth data
    const volunteerChartData = await Volunteer.aggregate([
      {
        $match: {
          applicationStatus: "approved",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Format chart data
    const chartData = {
      donations: donationChartData.map((item) => ({
        month: item._id,
        amount: item.amount,
        count: item.count,
      })),
      campaigns: campaignCategoriesData.map((item) => ({
        category: item._id,
        count: item.count,
        amount: item.amount,
      })),
      volunteers: volunteerChartData.map((item) => ({
        month: item._id,
        count: item.count,
      })),
    }

    // Get urgent tasks
    const urgentTasks = []

    // Check for campaigns ending soon
    const endingSoonCampaigns = await Campaign.find({
      isActive: true,
      status: "active",
      endDate: {
        $gte: now,
        $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    }).limit(5)

    urgentTasks.push(
      ...endingSoonCampaigns.map((campaign) => ({
        id: campaign._id.toString(),
        title: `Campaign "${campaign.title}" ending soon`,
        type: "campaign" as const,
        priority: "high" as const,
        dueDate: campaign.endDate,
      })),
    )

    // Check for events starting soon
    const startingSoonEvents = await Event.find({
      isActive: true,
      status: "upcoming",
      date: {
        $gte: now,
        $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    }).limit(5)

    urgentTasks.push(
      ...startingSoonEvents.map((event) => ({
        id: event._id.toString(),
        title: `Event "${event.title}" starting soon`,
        type: "event" as const,
        priority: "medium" as const,
        dueDate: event.date,
      })),
    )

    // Check for pending volunteer applications
    const pendingVolunteers = await Volunteer.countDocuments({
      applicationStatus: "pending",
    })

    if (pendingVolunteers > 0) {
      urgentTasks.push({
        id: "pending-volunteers",
        title: `${pendingVolunteers} volunteer applications pending review`,
        type: "volunteer" as const,
        priority: "medium" as const,
        dueDate: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      totalDonations,
      totalAmount,
      totalVolunteers,
      totalCampaigns,
      totalEvents,
      totalBlogPosts,
      monthlyGrowth,
      recentActivity,
      chartData,
      urgentTasks,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
