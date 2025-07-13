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

    // For OAuth users, use email instead of ID
    const user = await User.findOne({ 
      email: session.user.email 
    }).select("-password")
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user stats by email
    const donations = await Donation.find({ 
      donorEmail: session.user.email,
      status: "completed" 
    })
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0)
    const campaignsSupported = new Set(donations.map((d) => d.campaignId?.toString()).filter(Boolean)).size

    const profile = {
      personal: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "prefer-not-to-say",
        address: user.address || "",
        bio: user.bio || "",
        avatar: user.profileImage || "",
      },
      preferences: {
        emailNotifications: user.preferences?.emailNotifications ?? true,
        smsNotifications: user.preferences?.smsNotifications ?? false,
        newsletter: user.preferences?.newsletter ?? true,
        donationReminders: user.preferences?.donationReminders ?? true,
        eventUpdates: user.preferences?.eventUpdates ?? true,
        campaignUpdates: user.preferences?.campaignUpdates ?? true,
        language: user.preferences?.language || "en",
        timezone: user.preferences?.timezone || "Asia/Kolkata",
        currency: user.preferences?.currency || "INR",
      },
      privacy: {
        profileVisibility: user.privacy?.profileVisibility || "public",
        showDonations: user.privacy?.showDonations ?? false,
        showVolunteerHours: user.privacy?.showVolunteerHours ?? true,
        allowMessages: user.privacy?.allowMessages ?? true,
        showEmail: user.privacy?.showEmail ?? false,
        showPhone: user.privacy?.showPhone ?? false,
      },
      stats: {
        totalDonations,
        donationCount: donations.length,
        volunteerHours: 0,
        campaignsSupported,
        eventsAttended: 0,
        memberSince: user.createdAt,
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

    const { section, data } = await request.json()
    await connectDB()

    let updateFields = {}
    
    if (section === "personal") {
      updateFields = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bio: data.bio,
        profileImage: data.avatar,
      }
    } else if (section === "preferences") {
      updateFields = { preferences: data }
    } else if (section === "privacy") {
      updateFields = { privacy: data }
    }

    // Use email for user lookup
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateFields,
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
