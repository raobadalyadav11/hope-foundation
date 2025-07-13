import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Contact from "@/lib/models/Contact"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const priority = searchParams.get("priority") || "all"
    const search = searchParams.get("search") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    const query: any = {}

    if (status !== "all") {
      query.status = status
    }

    if (priority !== "all") {
      query.priority = priority
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ]
    }

    const sortOrder = order === "desc" ? -1 : 1
    const sortObj: any = {}
    sortObj[sort] = sortOrder

    const contacts = await Contact.find(query)
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("assignedTo", "name email")
      .populate("respondedBy", "name email")
      .lean()

    const total = await Contact.countDocuments(query)

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}