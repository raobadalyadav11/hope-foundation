import { type NextRequest, NextResponse } from "next/server"
import  connectDB from "@/lib/mongodb"
import Fundraiser from "@/lib/models/Fundraiser"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const url = new URL(req.url)
    const status = url.searchParams.get("status") || "active"
    const category = url.searchParams.get("category")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const query: any = { status }

    if (category) {
      query.category = category
    }

    const fundraisers = await Fundraiser.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Fundraiser.countDocuments(query)

    return NextResponse.json({
      fundraisers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching fundraisers:", error)
    return NextResponse.json({ error: "Failed to fetch fundraisers", details: error.message }, { status: 500 })
  }
}
