import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectDB()
    const { id } = await params

    const event = await Event.findById(id)
    
    if (!event || !event.isActive) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Check if user already registered
    const alreadyRegistered = event.attendees.some(
      (attendee: any) => attendee.userId.toString() === session.user.id
    )

    if (alreadyRegistered) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 })
    }

    // Add user to attendees
    event.attendees.push({
      userId: session.user.id,
      registeredAt: new Date(),
      status: "registered"
    })
    event.currentAttendees += 1

    await event.save()

    return NextResponse.json({ message: "Successfully registered for event" })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}