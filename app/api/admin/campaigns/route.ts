import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    // Build query
    const query: any = {}

    if (status && status !== "all") {
      query.status = status
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const skip = (page - 1) * limit

    const [campaigns, totalCampaigns] = await Promise.all([
      Campaign.find(query).populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Campaign.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCampaigns / limit)

    return NextResponse.json({
      campaigns,
      totalPages,
      currentPage: page,
      totalCampaigns,
    })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
