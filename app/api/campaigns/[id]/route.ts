import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Campaign, { ICampaign } from "@/lib/models/Campaign"
import Donation from "@/lib/models/Donation"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest,   { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
        const { id } = await params


    const campaign = await Campaign.findById(id).populate("createdBy", "name email").lean() as unknown as ICampaign & {
      createdBy: {
        name: string
        email: string
      }
    }

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Get recent donations for this campaign
    const recentDonations = await Donation.find({
      campaignId: id,
      status: "completed",
      isAnonymous: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("donorName amount createdAt message")
      .lean()

    // Calculate additional metrics
    const totalDonors = await Donation.countDocuments({
      campaignId: id,
      status: "completed",
    })

    const campaignWithMetrics = {
      ...campaign,
      progressPercentage: Math.round((campaign.raised / campaign.goal) * 100),
      daysLeft: Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      isExpired: new Date(campaign.endDate) < new Date(),
      totalDonors,
      recentDonations,
    }

    return NextResponse.json(campaignWithMetrics)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.role || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { id } = await params

    const body = await request.json()

    const campaign = await Campaign.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate(
      "createdBy",
      "name email",
    )

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.role || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { id } = await params

    const campaign = await Campaign.findByIdAndUpdate(id, { isActive: false }, { new: true })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Campaign deactivated successfully" })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
