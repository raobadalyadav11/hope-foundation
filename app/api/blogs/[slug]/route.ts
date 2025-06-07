import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const blog = await Blog.findOne({ slug: params.slug })
      .populate("authorId", "name email profileImage")
      .populate("comments.userId", "name profileImage")
      .lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Check if blog is published or user has permission to view
    const session = await getServerSession(authOptions)
    if (blog.status !== "published" && (!session || !["admin", "creator"].includes(session.user.role))) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } })

    // Get related blogs
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      status: "published",
    })
      .populate("authorId", "name")
      .limit(3)
      .select("title slug excerpt image readTime publishedAt")
      .lean()

    return NextResponse.json({
      ...blog,
      views: blog.views + 1,
      relatedBlogs,
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()

    const blog = await Blog.findOneAndUpdate({ slug: params.slug }, body, { new: true, runValidators: true }).populate(
      "authorId",
      "name email",
    )

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const blog = await Blog.findOneAndUpdate({ slug: params.slug }, { status: "archived" }, { new: true })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog archived successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
