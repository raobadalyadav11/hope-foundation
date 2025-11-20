import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await connectDB()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour

    // Save reset token to user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    })

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, user.name, resetToken)
    
    if (!emailSent) {
      console.error("Failed to send password reset email")
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}