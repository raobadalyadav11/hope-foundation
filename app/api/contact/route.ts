import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Contact from "@/lib/models/Contact"
import { sendContactNotification } from "@/lib/email"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject cannot exceed 200 characters"),
  message: z.string().min(1, "Message is required").max(2000, "Message cannot exceed 2000 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const contactData = contactSchema.parse(body)

    await dbConnect()

    const contact = await Contact.create({
      ...contactData,
      source: "website",
    })

    // Send notification to admin
    await sendContactNotification(contact)

    return NextResponse.json(
      {
        message: "Your message has been sent successfully. We'll get back to you soon!",
        contactId: contact._id,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
