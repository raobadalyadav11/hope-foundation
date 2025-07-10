import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Fundraiser from "@/lib/models/Fundraiser"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const fundraiser = await Fundraiser.findById(params.id)

    if (!fundraiser) {
      return NextResponse.json({ error: "Fundraiser not found" }, { status: 404 })
    }

    return NextResponse.json(fundraiser)
  } catch (error: any) {
    console.error("Error fetching fundraiser:", error)
    return NextResponse.json({ error: "Failed to fetch fundraiser", details: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const data = await req.json()

    const fundraiser = await Fundraiser.findById(params.id)

    if (!fundraiser) {
      return NextResponse.json({ error: "Fundraiser not found" }, { status: 404 })
    }

    // Check if user is the organizer or an admin
    if (fundraiser.organizerId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update fundraiser
    const updatedFundraiser = await Fundraiser.findByIdAndUpdate(params.id, { $set: data }, { new: true })

    return NextResponse.json(updatedFundraiser)
  } catch (error: any) {
    console.error("Error updating fundraiser:", error)
    return NextResponse.json({ error: "Failed to update fundraiser", details: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const fundraiser = await Fundraiser.findById(params.id)

    if (!fundraiser) {
      return NextResponse.json({ error: "Fundraiser not found" }, { status: 404 })
    }

    // Check if user is the organizer or an admin
    if (fundraiser.organizerId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete fundraiser
    await Fundraiser.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting fundraiser:", error)
    return NextResponse.json({ error: "Failed to delete fundraiser", details: error.message }, { status: 500 })
  }
}
