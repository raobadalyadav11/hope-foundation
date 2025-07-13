import mongoose from "mongoose"

export interface IContact extends mongoose.Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  inquiryType: "general" | "volunteer" | "donation" | "partnership" | "media" | "support"
  status: "new" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo?: mongoose.Types.ObjectId
  response?: string
  respondedAt?: Date
  respondedBy?: mongoose.Types.ObjectId
  tags: string[]
  source: string
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    inquiryType: {
      type: String,
      enum: ["general", "volunteer", "donation", "partnership", "media", "support"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    response: {
      type: String,
      trim: true,
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [String],
    source: {
      type: String,
      enum: ["website", "email", "phone", "social"],
      default: "website",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
contactSchema.index({ status: 1, priority: -1 })
contactSchema.index({ assignedTo: 1, status: 1 })
contactSchema.index({ createdAt: -1 })
contactSchema.index({ inquiryType: 1 })
contactSchema.index({ tags: 1 })

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema)
