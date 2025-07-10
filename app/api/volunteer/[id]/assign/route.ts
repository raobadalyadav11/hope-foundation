import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const assignmentSchema = z.object({
  campaignId: z.string().optional(),
  eventId: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const assignmentData = assignmentSchema.parse(body)

    await dbConnect()

    const volunteer = await Volunteer.findByIdAndUpdate(
      params.id,
      {
        $push: {
          assignments: {
            ...assignmentData,
            status: "active",
            hoursLogged: 0,
          },
        },
      },
      { new: true },
    )

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Assignment created successfully", volunteer })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
