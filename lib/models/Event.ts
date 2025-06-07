import mongoose from "mongoose"

export interface IEvent extends mongoose.Document {
  title: string
  description: string
  longDescription: string
  date: Date
  endDate?: Date
  location: string
  address: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  maxAttendees?: number
  currentAttendees: number
  attendees: Array<{
    userId: mongoose.Types.ObjectId
    registeredAt: Date
    status: "registered" | "attended" | "cancelled"
    notes?: string
  }>
  image: string
  gallery: string[]
  category: string
  tags: string[]
  isActive: boolean
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  isFree: boolean
  ticketPrice?: number
  requirements: string[]
  agenda: Array<{
    time: string
    activity: string
    speaker?: string
  }>
  contactPerson: {
    name: string
    email: string
    phone: string
  }
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    longDescription: {
      type: String,
      required: [true, "Long description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    endDate: Date,
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    maxAttendees: {
      type: Number,
      min: [1, "Max attendees must be at least 1"],
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    attendees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["registered", "attended", "cancelled"],
          default: "registered",
        },
        notes: String,
      },
    ],
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    gallery: [String],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["workshop", "fundraiser", "awareness", "volunteer-drive", "community-service", "training", "conference"],
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    ticketPrice: {
      type: Number,
      min: [0, "Ticket price cannot be negative"],
    },
    requirements: [String],
    agenda: [
      {
        time: {
          type: String,
          required: true,
        },
        activity: {
          type: String,
          required: true,
        },
        speaker: String,
      },
    ],
    contactPerson: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Update status based on date
eventSchema.pre("save", function (next) {
  const now = new Date()
  const eventDate = new Date(this.date)
  const endDate = this.endDate ? new Date(this.endDate) : eventDate

  if (this.status !== "cancelled") {
    if (now < eventDate) {
      this.status = "upcoming"
    } else if (now >= eventDate && now <= endDate) {
      this.status = "ongoing"
    } else {
      this.status = "completed"
    }
  }
  next()
})

// Index for better query performance
eventSchema.index({ date: 1, isActive: 1 })
eventSchema.index({ category: 1, isActive: 1 })
eventSchema.index({ status: 1, isActive: 1 })

export default mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema)
