import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Volunteer from "@/lib/models/Volunteer"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const volunteer = await Volunteer.findById(params.id)
      .populate("userId", "name email profileImage")

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Error fetching volunteer:", error)
    return NextResponse.json(
      { error: "Failed to fetch volunteer" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    
    const volunteer = await Volunteer.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).populate("userId", "name email profileImage")

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(volunteer)
  } catch (error) {
    console.error("Error updating volunteer:", error)
    return NextResponse.json(
      { error: "Failed to update volunteer" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const volunteer = await Volunteer.findByIdAndDelete(params.id)

    if (!volunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Volunteer deleted successfully" })
  } catch (error) {
    console.error("Error deleting volunteer:", error)
    return NextResponse.json(
      { error: "Failed to delete volunteer" },
      { status: 500 }
    )
  }
}