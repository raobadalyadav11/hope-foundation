import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import  connectDB  from "@/lib/mongodb"
import User from "@/lib/models/User"
import Donation from "@/lib/models/Donation"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.user.id).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user stats
    const donations = await Donation.find({ userId: session.user.id, status: "completed" })
    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)
    const campaignsSupported = new Set(donations.map((d) => d.campaignId?.toString()).filter(Boolean)).size

    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      joinedAt: user.createdAt,
      stats: {
        totalDonated,
        donationCount: donations.length,
        campaignsSupported,
        volunteerHours: user.volunteerHours || 0,
      },
      preferences: {
        emailNotifications: user.preferences?.emailNotifications ?? true,
        smsNotifications: user.preferences?.smsNotifications ?? false,
        newsletter: user.preferences?.newsletter ?? true,
      },
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    await connectDB()

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: updates.name,
        phone: updates.phone,
        address: updates.address,
        bio: updates.bio,
        preferences: updates.preferences,
      },
      { new: true },
    ).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
