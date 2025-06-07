import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Contact from "@/lib/models/Contact"
import { authOptions } from "@/lib/auth"
import { sendContactResponse } from "@/lib/email"
import { z } from "zod"

const responseSchema = z.object({
  response: z.string().min(1, "Response is required"),
  status: z.enum(["in-progress", "resolved", "closed"]).optional(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "creator"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { response, status } = responseSchema.parse(body)

    await dbConnect()

    const contact = await Contact.findByIdAndUpdate(
      params.id,
      {
        response,
        status: status || "resolved",
        respondedAt: new Date(),
        respondedBy: session.user.id,
      },
      { new: true },
    )

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    // Send response email
    await sendContactResponse(contact, response)

    return NextResponse.json({
      message: "Response sent successfully",
      contact,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error sending response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
