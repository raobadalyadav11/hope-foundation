import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import User from "@/lib/models/User"
import { authOptions } from "@/lib/auth"
import { sendVolunteerWelcome } from "@/lib/email"
import { z } from "zod"

const volunteerApplicationSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  availability: z.enum(["weekdays", "weekends", "evenings", "flexible"]),
  experience: z.string().optional(),
  motivation: z.string().min(10, "Please provide more details about your motivation"),
  preferredCauses: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const applicationData = volunteerApplicationSchema.parse(body)

    await dbConnect()

    // Check if user already applied
    const existingApplication = await Volunteer.findOne({ userId: session.user.id })
    if (existingApplication) {
      return NextResponse.json({ error: "You have already submitted a volunteer application" }, { status: 400 })
    }

    // Create volunteer application
    const volunteer = await Volunteer.create({
      userId: session.user.id,
      ...applicationData,
      applicationStatus: "pending",
    })

    // Update user role
    await User.findByIdAndUpdate(session.user.id, { role: "volunteer" })

    // Send welcome email
    const user = await User.findById(session.user.id)
    await sendVolunteerWelcome(volunteer, user)

    return NextResponse.json(
      {
        message: "Volunteer application submitted successfully",
        applicationId: volunteer._id,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error submitting volunteer application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
