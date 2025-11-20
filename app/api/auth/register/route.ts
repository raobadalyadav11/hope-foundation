import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { z } from "zod"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["donor", "volunteer", "creator"]).optional(),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role = "donor", phone } = registerSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      isActive: true,
      isVerified: false, // Require email verification
      verificationToken,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    // Send verification email
    const emailSent = await sendVerificationEmail(email, name, verificationToken)
    
    if (!emailSent) {
      console.error("Failed to send verification email")
    }

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email for verification.",
        user: userWithoutPassword,
        verificationEmailSent: emailSent,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
