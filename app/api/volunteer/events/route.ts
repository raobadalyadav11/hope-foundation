import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get("upcoming") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: any = { 
      isActive: true,
      "attendees.userId": session.user.id
    }
    
    if (upcoming) {
      query.date = { $gte: new Date() }
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit)
      .lean()

    const eventsWithRSVP = events.map(event => ({
      ...event,
      rsvpStatus: event.attendees?.find((a: any) => a.userId.toString() === session.user.id)?.status || "registered"
    }))

    return NextResponse.json({ events: eventsWithRSVP })
  } catch (error) {
    console.error("Error fetching volunteer events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}