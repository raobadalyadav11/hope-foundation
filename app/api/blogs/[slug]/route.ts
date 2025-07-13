import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    const { slug } = await params

    const blog = await Blog.findOne({ 
      slug, 
      status: "published" 
    })
      .populate("authorId", "name email profileImage")
      .lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } })

    // Get related blogs
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      status: "published"
    })
      .populate("authorId", "name")
      .limit(3)
      .select("title slug excerpt featuredImage publishedAt authorId")
      .lean()

    // Mock comments and likes for now (you can implement proper models later)
    const blogWithExtras = {
      ...blog,
      likes: [], // Array of user IDs who liked
      comments: [], // Array of approved comments
      relatedBlogs
    }

    return NextResponse.json(blogWithExtras)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}