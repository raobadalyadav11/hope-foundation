import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { authOptions } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { action, feedback } = await request.json()
    const blogId = params.id

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const blog = await Blog.findById(blogId).populate("author", "name email")

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    if (blog.status !== "pending") {
      return NextResponse.json({ error: "Blog is not pending review" }, { status: 400 })
    }

    // Update blog status
    const newStatus = action === "approve" ? "published" : "rejected"
    const updateData: any = {
      status: newStatus,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    }

    if (action === "approve") {
      updateData.publishedAt = new Date()
    }

    if (feedback) {
      updateData.adminFeedback = feedback
    }

    await Blog.findByIdAndUpdate(blogId, updateData)

    // Send notification email to author
    const emailSubject =
      action === "approve"
        ? `Your blog post "${blog.title}" has been approved!`
        : `Your blog post "${blog.title}" needs revision`

    const emailContent =
      action === "approve"
        ? `
        <h2>Great news!</h2>
        <p>Your blog post "<strong>${blog.title}</strong>" has been approved and is now live on our website.</p>
        ${feedback ? `<p><strong>Admin note:</strong> ${feedback}</p>` : ""}
        <p>Thank you for your contribution!</p>
        <p><a href="${process.env.NEXTAUTH_URL}/blogs/${blog._id}">View your published post</a></p>
      `
        : `
        <h2>Blog Post Review</h2>
        <p>Your blog post "<strong>${blog.title}</strong>" has been reviewed and needs some revisions before it can be published.</p>
        ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ""}
        <p>Please make the necessary changes and resubmit your post.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/dashboard/${blog.author.role}/blog-editor?edit=${blog._id}">Edit your post</a></p>
      `

    await sendEmail({
      to: blog.author.email,
      subject: emailSubject,
      html: emailContent,
    })

    return NextResponse.json({
      success: true,
      message: `Blog ${action}d successfully`,
    })
  } catch (error) {
    console.error("Error reviewing blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
