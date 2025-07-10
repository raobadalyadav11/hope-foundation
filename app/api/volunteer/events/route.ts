import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "all"
    const status = searchParams.get("status") || "all"
    const date = searchParams.get("date") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = { isActive: true }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }

    // Category filter
    if (category !== "all") {
      query.category = category
    }

    // Date filter
    const now = new Date()
    if (date === "upcoming") {
      query.date = { $gte: now }
    } else if (date === "this_week") {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      query.date = { $gte: now, $lte: weekFromNow }
    } else if (date === "this_month") {
      const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
      query.date = { $gte: now, $lte: monthFromNow }
    } else if (date === "past") {
      query.date = { $lt: now }
    }

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .sort({ date: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    // Add RSVP status for each event
    const eventsWithRSVP = events.map((event: any) => {
      const attendee = event.attendees?.find((a: any) => a.userId.toString() === session.user.id)
      return {
        ...event,
        rsvpStatus: attendee?.status || null,
        currentAttendees: event.attendees?.filter((a: any) => a.status === "attending").length || 0,
      }
    })

    const total = await Event.countDocuments(query)

    return NextResponse.json({
      events: eventsWithRSVP,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching volunteer events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
