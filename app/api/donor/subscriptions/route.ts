import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await dbConnect()

    const subscriptions = await Subscription.find({ donorId: session.user.id })
      .populate("campaignId", "title")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
