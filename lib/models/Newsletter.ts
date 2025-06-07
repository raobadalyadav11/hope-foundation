import mongoose from "mongoose"

export interface INewsletter extends mongoose.Document {
  email: string
  name?: string
  isActive: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  preferences: {
    campaigns: boolean
    events: boolean
    blogs: boolean
    newsletters: boolean
  }
  source: string
  createdAt: Date
  updatedAt: Date
}

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
    preferences: {
      campaigns: {
        type: Boolean,
        default: true,
      },
      events: {
        type: Boolean,
        default: true,
      },
      blogs: {
        type: Boolean,
        default: true,
      },
      newsletters: {
        type: Boolean,
        default: true,
      },
    },
    source: {
      type: String,
      enum: ["website", "event", "campaign", "manual"],
      default: "website",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
newsletterSchema.index({ email: 1 }, { unique: true })
newsletterSchema.index({ isActive: 1 })

export default mongoose.models.Newsletter || mongoose.model<INewsletter>("Newsletter", newsletterSchema)
