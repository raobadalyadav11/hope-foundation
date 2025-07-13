import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Donation from "@/lib/models/Donation"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const donations = await Donation.find({
      campaignId: id,
      status: "completed",
      isAnonymous: false,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("donorName amount createdAt message")
      .lean()

    return NextResponse.json({ donations })
  } catch (error) {
    console.error("Error fetching campaign donations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}