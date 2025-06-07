import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const blog = await Blog.findOne({ slug: params.slug })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const userId = session.user.id
    const isLiked = blog.likes.includes(userId)

    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter((id: string) => id !== userId)
    } else {
      // Like
      blog.likes.push(userId)
    }

    await blog.save()

    return NextResponse.json({
      liked: !isLiked,
      likesCount: blog.likes.length,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
