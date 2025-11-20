import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Notification from "@/lib/models/Notification"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread") === "true"
    const type = searchParams.get("type") || "all"

    // Build query to find notifications for this user
    const query: any = {
      $or: [
        { "recipients.userIds": session.user.id },
        { "recipients.type": "all" },
        { "recipients.type": "role", "recipients.roles": session.user.role }
      ],
      status: "sent"
    }

    if (unreadOnly) {
      query.readBy = { $ne: session.user.id }
    }

    if (type !== "all") {
      query.type = type
    }

    // Get notifications
    const notifications = await Notification.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    // Filter for current user and mark as read if getting all notifications
    const userNotifications = notifications.filter(notif => {
      if (notif.recipients.userIds?.includes(session.user.id) || 
          notif.recipients.type === "all" ||
          (notif.recipients.type === "role" && notif.recipients.roles?.includes(session.user.role))) {
        return true
      }
      return false
    })

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({
      ...query,
      readBy: { $ne: session.user.id }
    })

    // Mark notifications as read
    if (!unreadOnly && userNotifications.length > 0) {
      await Notification.updateMany(
        { 
          _id: { $in: userNotifications.map(n => n._id) },
          readBy: { $ne: session.user.id }
        },
        { $addToSet: { readBy: session.user.id } }
      )
    }

    return NextResponse.json({
      notifications: userNotifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { action, notificationIds } = await request.json()

    if (action === "mark-read" && notificationIds?.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $addToSet: { readBy: session.user.id } }
      )
    } else if (action === "mark-unread" && notificationIds?.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $pull: { readBy: session.user.id } }
      )
    } else if (action === "mark-all-read") {
      await Notification.updateMany(
        {
          $or: [
            { "recipients.userIds": session.user.id },
            { "recipients.type": "all" },
            { "recipients.type": "role", "recipients.roles": session.user.role }
          ],
          status: "sent",
          readBy: { $ne: session.user.id }
        },
        { $addToSet: { readBy: session.user.id } }
      )
    } else if (action === "delete" && notificationIds?.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $addToSet: { deletedBy: session.user.id } }
      )
    }

    return NextResponse.json({ message: "Action completed successfully" })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}