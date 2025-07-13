import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Contact from "@/lib/models/Contact"
import { authOptions } from "@/lib/auth"
import { sendContactResponse } from "@/lib/email"
import { z } from "zod"

const responseSchema = z.object({
  response: z.string().min(1, "Response is required").max(5000, "Response cannot exceed 5000 characters"),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { response } = responseSchema.parse(body)

    await connectDB()

    const contact = await Contact.findById(id)

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    // Update contact with response
    contact.response = response
    contact.respondedAt = new Date()
    contact.respondedBy = session.user.id
    contact.status = "resolved"
    
    await contact.save()

    // Send email response to the contact
    try {
      await sendContactResponse(contact, response)
    } catch (emailError) {
      console.error("Failed to send contact response email:", emailError)
      // Continue with the response even if email fails
    }

    return NextResponse.json({ 
      message: "Response sent successfully",
      contact
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error responding to contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}