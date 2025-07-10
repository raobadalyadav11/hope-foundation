import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"
import { authOptions } from "@/lib/auth"
import { sendVolunteerApproval } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const volunteer = await Volunteer.findByIdAndUpdate(
      params.id,
      { applicationStatus: "approved" },
      { new: true },
    ).populate("userId", "name email")

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
    }

    // Send approval email
    await sendVolunteerApproval(volunteer)

    return NextResponse.json({ message: "Volunteer approved successfully", volunteer })
  } catch (error) {
    console.error("Error approving volunteer:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
