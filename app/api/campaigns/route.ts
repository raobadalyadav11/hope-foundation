import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Campaign from "@/lib/models/Campaign"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description cannot exceed 500 characters"),
  longDescription: z.string().min(1, "Long description is required"),
  goal: z.number().min(1, "Goal must be greater than 0"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  location: z.string().min(1, "Location is required"),
  category: z.enum([
    "education",
    "healthcare",
    "environment",
    "poverty",
    "disaster-relief",
    "women-empowerment",
    "child-welfare",
    "elderly-care",
  ]),
  image: z.string().url("Invalid image URL"),
  gallery: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "active", "completed", "paused"]).optional(),
  tags: z.array(z.string()).optional(),
  beneficiaries: z.number().min(0).optional(),
})

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    const query: any = { isActive: true }

    if (featured === "true") {
      query.featured = true
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (status && status !== "all") {
      query.status = status
    } else {
      query.status = { $in: ["active", "completed"] } // Only show active and completed campaigns to public
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const sortOrder = order === "desc" ? -1 : 1
    const sortObj: any = {}
    sortObj[sort] = sortOrder

    const campaigns = await Campaign.find(query)
      .populate("createdBy", "name email")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Campaign.countDocuments(query)

    // Calculate additional metrics for each campaign
    const campaignsWithMetrics = campaigns.map((campaign) => ({
      ...campaign,
      progressPercentage: Math.round((campaign.raised / campaign.goal) * 100),
      daysLeft: Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      isExpired: new Date(campaign.endDate) < new Date(),
    }))

    return NextResponse.json({
      campaigns: campaignsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.role || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const campaignData = campaignSchema.parse(body)

    // Validate end date is after start date
    if (campaignData.endDate <= campaignData.startDate) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    await connectDB()

    const campaign = await Campaign.create({
      ...campaignData,
      createdBy: session.user.id,
    })

    const populatedCampaign = await Campaign.findById(campaign._id).populate("createdBy", "name email")

    return NextResponse.json(populatedCampaign, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
