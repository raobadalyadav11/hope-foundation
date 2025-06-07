import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "volunteer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()

    // Check if blog belongs to the volunteer
    const blog = await Blog.findOne({
      _id: params.id,
      authorId: session.user.id,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    // Volunteers can only edit their own drafts
    if (blog.status !== "draft") {
      return NextResponse.json({ error: "Can only edit draft blogs" }, { status: 400 })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating volunteer blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "volunteer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Check if blog belongs to the volunteer
    const blog = await Blog.findOne({
      _id: params.id,
      authorId: session.user.id,
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found or unauthorized" }, { status: 404 })
    }

    // Volunteers can only delete their own drafts
    if (blog.status !== "draft") {
      return NextResponse.json({ error: "Can only delete draft blogs" }, { status: 400 })
    }

    await Blog.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting volunteer blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
