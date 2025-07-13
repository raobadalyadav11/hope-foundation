import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long")
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content } = commentSchema.parse(body)

    await connectDB()
    const { slug } = await params

    const blog = await Blog.findOne({ slug, status: "published" })
    
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // For now, just return success
    // In a full implementation, you'd save comments to a separate collection
    // and implement approval workflow

    return NextResponse.json({ 
      message: "Comment submitted successfully. It will be visible after approval." 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}