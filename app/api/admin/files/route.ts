import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import File from "@/lib/models/File"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    const usage = searchParams.get("usage") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: "i" } },
        { filename: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (type !== "all") {
      if (type === "image") {
        query.resourceType = "image"
      } else if (type === "video") {
        query.resourceType = "video"
      } else if (type === "document") {
        query.format = { $in: ["pdf", "doc", "docx", "txt", "rtf"] }
      } else if (type === "other") {
        query.$and = [
          { resourceType: { $ne: "image" } },
          { resourceType: { $ne: "video" } },
          { format: { $nin: ["pdf", "doc", "docx", "txt", "rtf"] } },
        ]
      }
    }

    if (usage === "used") {
      query.usageCount = { $gt: 0 }
    } else if (usage === "unused") {
      query.usageCount = 0
    }

    // Get files with pagination
    const files = await File.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await File.countDocuments(query)

    return NextResponse.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
