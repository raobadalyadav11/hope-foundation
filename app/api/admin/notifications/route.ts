import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Notification from "@/lib/models/Notification"
import User from "@/lib/models/User"
import { authOptions } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    const status = searchParams.get("status") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }]
    }

    if (type !== "all") {
      query.type = type
    }

    if (status !== "all") {
      query.status = status
    }

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Notification.countDocuments(query)

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { type, title, message, recipients, scheduledAt, template } = await request.json()

    // Validate required fields
    if (!type || !title || !message || !recipients) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get recipient users
    let recipientUsers: string | any[] = []
    let recipientCount = 0

    if (recipients.type === "all") {
      recipientUsers = await User.find({}, "email name").lean()
    } else if (recipients.type === "role") {
      recipientUsers = await User.find({ role: { $in: recipients.roles } }, "email name").lean()
    } else if (recipients.type === "specific") {
      recipientUsers = await User.find({ _id: { $in: recipients.userIds } }, "email name").lean()
    }

    recipientCount = recipientUsers.length

    // Create notification record
    const notification = new Notification({
      type,
      title,
      message,
      recipients: {
        type: recipients.type,
        ...(recipients.roles && { roles: recipients.roles }),
        ...(recipients.userIds && { userIds: recipients.userIds }),
        count: recipientCount,
      },
      status: scheduledAt ? "scheduled" : "sent",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      sentAt: scheduledAt ? undefined : new Date(),
      deliveryStats: {
        sent: 0,
        delivered: 0,
        failed: 0,
      },
      template,
      createdBy: session.user.id,
    })

    await notification.save()

    // Send notifications immediately if not scheduled
    if (!scheduledAt) {
      if (type === "email") {
        let delivered = 0
        let failed = 0

        for (const user of recipientUsers) {
          try {
            await sendEmail({
              to: user.email,
              subject: title,
              html: message.replace(/\{\{name\}\}/g, user.name),
            })
            delivered++
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error)
            failed++
          }
        }

        // Update delivery stats
        await Notification.findByIdAndUpdate(notification._id, {
          "deliveryStats.sent": recipientCount,
          "deliveryStats.delivered": delivered,
          "deliveryStats.failed": failed,
        })
      }
      // TODO: Implement in-app and SMS notifications
    }

    return NextResponse.json({
      success: true,
      notificationId: notification._id,
      recipientCount,
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
