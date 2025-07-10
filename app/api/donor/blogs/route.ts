import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has content creator role
    if (!session.user.roles?.includes("content_creator")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query
    const query: any = { authorId: session.user.id }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (status && status !== "all") {
      query.status = status
    }

    if (category && category !== "all") {
      query.category = category
    }

    const blogs = await Blog.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
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
    console.error("Error fetching donor blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has content creator role
    if (!session.user.roles?.includes("content_creator")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, excerpt, tags, category, status, featuredImage } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (status === "pending" && (!content?.trim() || !excerpt?.trim() || !category)) {
      return NextResponse.json(
        {
          error: "Content, excerpt, and category are required for submission",
        },
        { status: 400 },
      )
    }

    await connectDB()

    const blog = new Blog({
      title: title.trim(),
      content: content?.trim() || "",
      excerpt: excerpt?.trim() || "",
      tags: tags || [],
      category: category || "",
      status: status || "draft",
      featuredImage,
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
    })

    await blog.save()

    // Send notification email if submitted for review
    if (status === "pending") {
      // TODO: Send email notification to admins
      console.log(`New blog submitted for review: ${title} by ${session.user.name}`)
    }

    return NextResponse.json({
      message: status === "pending" ? "Blog submitted for review" : "Draft saved successfully",
      blog,
    })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
