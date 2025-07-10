import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import User from "@/lib/models/User"
import { authOptions } from "@/lib/auth"
import { sendEventConfirmation } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const event = await Event.findById(params.id)

    if (!event || !event.isActive) {
      return NextResponse.json({ error: "Event not found or not active" }, { status: 404 })
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Check if event has already started or ended
    if (new Date(event.date) < new Date()) {
      return NextResponse.json({ error: "Event has already started" }, { status: 400 })
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.attendees.some((attendee: { userId: { toString: () => string } }) => attendee.userId.toString() === session.user.id)

    if (isAlreadyRegistered) {
      return NextResponse.json({ error: "You are already registered for this event" }, { status: 400 })
    }

    // Add user to attendees
    event.attendees.push({
      userId: session.user.id,
      registeredAt: new Date(),
      status: "registered",
    })

    event.currentAttendees += 1
    await event.save()

    // Get user details for email
    const user = await User.findById(session.user.id)

    // Send confirmation email
    await sendEventConfirmation(event, user, "attending")

    return NextResponse.json({
      message: "Successfully registered for event",
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
      },
    })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()

    const event = await Event.findById(params.id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Find and remove user from attendees
    const attendeeIndex = event.attendees.findIndex((attendee: { userId: { toString: () => string } }) => attendee.userId.toString() === session.user.id)

    if (attendeeIndex === -1) {
      return NextResponse.json({ error: "You are not registered for this event" }, { status: 400 })
    }

    event.attendees.splice(attendeeIndex, 1)
    event.currentAttendees = Math.max(0, event.currentAttendees - 1)
    await event.save()

    return NextResponse.json({ message: "Successfully cancelled registration" })
  } catch (error) {
    console.error("Error cancelling event registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
