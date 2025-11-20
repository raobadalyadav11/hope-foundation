import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Impact from "@/lib/models/Impact"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || ""
    const search = searchParams.get("search") || ""
    const published = searchParams.get("published") === "true"

    const query: any = {}
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ]
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (published) {
      query.isPublished = true
    } else {
      // Only show published impacts for public access
      query.isPublished = true
    }

    const total = await Impact.countDocuments(query)
    const impacts = await Impact.find(query)
      .populate("campaign", "title")
      .populate("event", "title")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    return NextResponse.json({
      impacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error("Error fetching impacts:", error)
    return NextResponse.json(
      { error: "Failed to fetch impacts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    
    const impact = new Impact({
      ...data,
      createdBy: session.user.id,
    })

    await impact.save()

    return NextResponse.json(impact, { status: 201 })
  } catch (error) {
    console.error("Error creating impact:", error)
    return NextResponse.json(
      { error: "Failed to create impact" },
      { status: 500 }
    )
  }
}