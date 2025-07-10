import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get users who have content creator role or have written blogs
    const authors = await User.aggregate([
      {
        $match: {
          $or: [{ roles: { $in: ["content-creator"] } }, { role: { $in: ["admin", "volunteer", "donor"] } }],
        },
      },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "blogs",
        },
      },
      {
        $match: {
          blogs: { $ne: [] },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          blogCount: { $size: "$blogs" },
        },
      },
      {
        $sort: { blogCount: -1 },
      },
    ])

    return NextResponse.json({ authors })
  } catch (error) {
    console.error("Error fetching blog authors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
