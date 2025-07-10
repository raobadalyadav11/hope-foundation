import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import User from "@/lib/models/User"
import { authOptions } from "@/lib/auth"
import { sendVolunteerWelcome } from "@/lib/email"
import { z } from "zod"

const volunteerSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  availability: z.enum(["weekdays", "weekends", "evenings", "flexible"]),
  experience: z.string().optional(),
  motivation: z.string().min(1, "Motivation is required").max(1000, "Motivation cannot exceed 1000 characters"),
  preferredCauses: z
    .array(
      z.enum([
        "education",
        "healthcare",
        "environment",
        "poverty",
        "disaster-relief",
        "women-empowerment",
        "child-welfare",
        "elderly-care",
      ]),
    )
    .optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
  }),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const skills = searchParams.get("skills")
    const causes = searchParams.get("causes")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = { isActive: true }

    if (status && status !== "all") {
      query.applicationStatus = status
    }

    if (skills) {
      query.skills = { $in: skills.split(",") }
    }

    if (causes) {
      query.preferredCauses = { $in: causes.split(",") }
    }

    const volunteers = await Volunteer.find(query)
      .populate("userId", "name email phone profileImage")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Volunteer.countDocuments(query)

    return NextResponse.json({
      volunteers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching volunteers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const volunteerData = volunteerSchema.parse(body)

    await connectDB()

    // Check if user already has a volunteer application
    const existingVolunteer = await Volunteer.findOne({ userId: session.user.id })

    if (existingVolunteer) {
      return NextResponse.json({ error: "You already have a volunteer application" }, { status: 400 })
    }

    // Create volunteer application
    const volunteer = await Volunteer.create({
      userId: session.user.id,
      ...volunteerData,
    })

    // Update user role to volunteer
    await User.findByIdAndUpdate(session.user.id, { role: "volunteer" })

    // Get user details for email
    const user = await User.findById(session.user.id)

    // Send welcome email
    await sendVolunteerWelcome(volunteer, user)

    const populatedVolunteer = await Volunteer.findById(volunteer._id).populate("userId", "name email phone")

    return NextResponse.json(populatedVolunteer, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating volunteer application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
