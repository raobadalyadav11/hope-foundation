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
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const campaign = searchParams.get("campaign") || "all"
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

    if (search) {
      query.$or = [
        { donorName: { $regex: search, $options: "i" } },
        { donorEmail: { $regex: search, $options: "i" } },
        { receiptNumber: { $regex: search, $options: "i" } },
      ]
    }

    if (status !== "all") {
      query.status = status
    }

    if (campaign !== "all" && campaign !== "general") {
      query.campaignId = campaign
    } else if (campaign === "general") {
      query.campaignId = { $exists: false }
    }

    // Get donations with campaign details
    const donations = await Donation.find(query)
      .populate("campaignId", "title")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Donation.countDocuments(query)

    // Add campaign title to donations
    const enhancedDonations = donations.map((donation) => ({
      ...donation,
      campaignTitle: donation.campaignId?.title || null,
    }))

    return NextResponse.json({
      donations: enhancedDonations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
