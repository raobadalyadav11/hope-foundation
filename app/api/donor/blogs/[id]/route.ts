import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.roles?.includes("content_creator")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    await connectDB()

    const blog = await Blog.findOne({
      _id: params.id,
      authorId: session.user.id,
    }).lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.roles?.includes("content_creator")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, excerpt, tags, category, status, featuredImage } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    await connectDB()

    const blog = await Blog.findOne({
      _id: params.id,
      authorId: session.user.id,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Only allow editing if blog is draft or rejected
    if (blog.status !== "draft" && blog.status !== "rejected") {
      return NextResponse.json(
        {
          error: "Cannot edit published or pending blogs",
        },
        { status: 400 },
      )
    }

    blog.title = title.trim()
    blog.content = content?.trim() || ""
    blog.excerpt = excerpt?.trim() || ""
    blog.tags = tags || []
    blog.category = category || ""
    blog.status = status || blog.status
    blog.featuredImage = featuredImage
    blog.updatedAt = new Date()

    // Clear admin feedback if resubmitting
    if (status === "pending" && blog.status === "rejected") {
      blog.adminFeedback = undefined
    }

    await blog.save()

    return NextResponse.json({
      message: "Blog updated successfully",
      blog,
    })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.user.roles?.includes("content_creator")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    await connectDB()

    const blog = await Blog.findOneAndDelete({
      _id: params.id,
      authorId: session.user.id,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
