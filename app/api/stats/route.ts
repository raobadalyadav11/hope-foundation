import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Campaign from "@/lib/models/Campaign"
import Donation from "@/lib/models/Donation"
import Event from "@/lib/models/Event"
import Volunteer from "@/lib/models/Volunteer"

export async function GET() {
  try {
    await connectDB()

    const [
      totalVolunteers,
      totalCampaigns,
      totalEvents,
      totalDonationsResult,
      activeCampaigns,
      upcomingEvents,
      approvedVolunteers,
    ] = await Promise.all([
      User.countDocuments({ role: "volunteer", isActive: true }),
      Campaign.countDocuments({ isActive: true }),
      Event.countDocuments({ isActive: true }),
      Donation.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Campaign.countDocuments({ status: "active", isActive: true }),
      Event.countDocuments({
        date: { $gte: new Date() },
        status: { $in: ["upcoming", "ongoing"] },
        isActive: true,
      }),
      Volunteer.countDocuments({ applicationStatus: "approved", isActive: true }),
    ])

    const totalDonations = totalDonationsResult[0]?.total || 0
    const donationCount = totalDonationsResult[0]?.count || 0

    // Calculate estimated beneficiaries (rough estimate based on donations and campaigns)
    const campaignBeneficiaries = await Campaign.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$beneficiaries" } } },
    ])

    const totalBeneficiaries = campaignBeneficiaries[0]?.total || Math.floor(totalDonations / 500)

    return NextResponse.json({
      totalVolunteers,
      totalCampaigns,
      totalEvents,
      totalDonations,
      donationCount,
      totalBeneficiaries,
      activeCampaigns,
      upcomingEvents,
      approvedVolunteers,
      // Additional metrics
      averageDonation: donationCount > 0 ? Math.round(totalDonations / donationCount) : 0,
      impactMetrics: {
        livesImpacted: totalBeneficiaries,
        projectsCompleted: await Campaign.countDocuments({ status: "completed", isActive: true }),
        countriesServed: 12, // This could be dynamic based on campaign locations
        volunteersActive: approvedVolunteers,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
