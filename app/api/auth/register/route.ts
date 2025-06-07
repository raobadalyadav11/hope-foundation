import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import { z } from "zod"
import crypto from "crypto"

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

    await dbConnect()

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

    // TODO: Send verification email
    // await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      {
        message: "User created successfully. Please check your email for verification.",
        user: userWithoutPassword,
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
