import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Event from "@/lib/models/Event"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description cannot exceed 500 characters"),
  longDescription: z.string().min(1, "Long description is required"),
  date: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  maxAttendees: z.number().min(1).optional(),
  image: z.string().url("Invalid image URL"),
  gallery: z.array(z.string().url()).optional(),
  category: z.enum([
    "workshop",
    "fundraiser",
    "awareness",
    "volunteer-drive",
    "community-service",
    "training",
    "conference",
  ]),
  tags: z.array(z.string()).optional(),
  isFree: z.boolean().optional(),
  ticketPrice: z.number().min(0).optional(),
  requirements: z.array(z.string()).optional(),
  agenda: z
    .array(
      z.object({
        time: z.string(),
        activity: z.string(),
        speaker: z.string().optional(),
      }),
    )
    .optional(),
  contactPerson: z.object({
    name: z.string().min(1, "Contact name is required"),
    email: z.string().email("Invalid contact email"),
    phone: z.string().min(1, "Contact phone is required"),
  }),
})

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const upcoming = searchParams.get("upcoming")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const sort = searchParams.get("sort") || "date"
    const order = searchParams.get("order") || "asc"

    const query: any = { isActive: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (status && status !== "all") {
      query.status = status
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() }
      query.status = { $in: ["upcoming", "ongoing"] }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const sortOrder = order === "desc" ? -1 : 1
    const sortObj: any = {}
    sortObj[sort] = sortOrder

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Event.countDocuments(query)

    // Calculate additional metrics for each event
    const eventsWithMetrics = events.map((event) => ({
      ...event,
      spotsLeft: event.maxAttendees ? event.maxAttendees - event.currentAttendees : null,
      isFull: event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false,
      daysUntil: Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }))

    return NextResponse.json({
      events: eventsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const eventData = eventSchema.parse(body)

    // Validate end date is after start date if provided
    if (eventData.endDate && eventData.endDate <= eventData.date) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    await connectDB()

    const event = await Event.create({
      ...eventData,
      createdBy: session.user.id,
    })

    const populatedEvent = await Event.findById(event._id).populate("createdBy", "name email")

    return NextResponse.json(populatedEvent, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
