import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    await connectDB()

    // Find user with this verification token
    const user = await User.findOne({ verificationToken: token })
    
    if (!user) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    // Mark user as verified
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: undefined, // Remove the token
    })

    return NextResponse.json({
      message: "Email verified successfully. You can now sign in to your account.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    await connectDB()

    // Find user with this verification token
    const user = await User.findOne({ verificationToken: token })
    
    if (!user) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    // Mark user as verified
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verificationToken: undefined, // Remove the token
    })

    return NextResponse.json({
      message: "Email verified successfully. You can now sign in to your account.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}