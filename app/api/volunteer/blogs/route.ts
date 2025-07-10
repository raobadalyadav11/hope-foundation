import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const volunteerBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(300, "Excerpt cannot exceed 300 characters"),
  image: z.string().url("Invalid image URL"),
  tags: z.array(z.string()).optional(),
  readTime: z.string().min(1, "Read time is required"),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "volunteer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = { authorId: session.user.id }

    if (status !== "all") {
      query.status = status
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Blog.countDocuments(query)

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching volunteer blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "volunteer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const blogData = volunteerBlogSchema.parse(body)

    await connectDB()

    // Check if user is an approved volunteer
    const volunteer = await Volunteer.findOne({
      userId: session.user.id,
      applicationStatus: "approved",
    })

    if (!volunteer) {
      return NextResponse.json({ error: "Only approved volunteers can write blogs" }, { status: 403 })
    }

    const blog = await Blog.create({
      ...blogData,
      authorId: session.user.id,
      category: "volunteer-stories",
      status: "draft", // Volunteer blogs start as draft
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating volunteer blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
