import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { slug } = await params

    const blog = await Blog.findOne({ slug, status: "published" })
    
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // For now, just increment likes count
    // In a full implementation, you'd track individual user likes
    await Blog.findByIdAndUpdate(blog._id, { $inc: { likes: 1 } })

    return NextResponse.json({ message: "Blog liked successfully" })
  } catch (error) {
    console.error("Error liking blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}