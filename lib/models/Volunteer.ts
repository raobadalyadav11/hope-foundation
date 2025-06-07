import mongoose from "mongoose"

export interface IVolunteer extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  applicationStatus: "pending" | "approved" | "rejected" | "on-hold"
  skills: string[]
  availability: string
  experience: string
  motivation: string
  preferredCauses: string[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  backgroundCheck: {
    status: "pending" | "completed" | "failed"
    completedAt?: Date
    notes?: string
  }
  assignments: Array<{
    campaignId?: mongoose.Types.ObjectId
    eventId?: mongoose.Types.ObjectId
    role: string
    startDate: Date
    endDate?: Date
    status: "active" | "completed" | "cancelled"
    hoursLogged: number
    feedback?: string
  }>
  totalHours: number
  rating: number
  reviews: Array<{
    reviewerId: mongoose.Types.ObjectId
    rating: number
    comment: string
    date: Date
  }>
  isActive: boolean
  joinedAt: Date
  lastActiveAt: Date
  createdAt: Date
  updatedAt: Date
}

const volunteerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "on-hold"],
      default: "pending",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "evenings", "flexible"],
      required: true,
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [1000, "Experience cannot exceed 1000 characters"],
    },
    motivation: {
      type: String,
      required: [true, "Motivation is required"],
      trim: true,
      maxlength: [1000, "Motivation cannot exceed 1000 characters"],
    },
    preferredCauses: [
      {
        type: String,
        enum: [
          "education",
          "healthcare",
          "environment",
          "poverty",
          "disaster-relief",
          "women-empowerment",
          "child-welfare",
          "elderly-care",
        ],
      },
    ],
    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      relationship: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    backgroundCheck: {
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      completedAt: Date,
      notes: String,
    },
    assignments: [
      {
        campaignId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Campaign",
        },
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        status: {
          type: String,
          enum: ["active", "completed", "cancelled"],
          default: "active",
        },
        hoursLogged: {
          type: Number,
          default: 0,
          min: [0, "Hours logged cannot be negative"],
        },
        feedback: String,
      },
    ],
    totalHours: {
      type: Number,
      default: 0,
      min: [0, "Total hours cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviews: [
      {
        reviewerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [1, "Rating must be at least 1"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          trim: true,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate average rating
volunteerSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = totalRating / this.reviews.length
  }
  next()
})

// Index for better query performance
volunteerSchema.index({ applicationStatus: 1, isActive: 1 })
volunteerSchema.index({ skills: 1, isActive: 1 })
volunteerSchema.index({ preferredCauses: 1, isActive: 1 })

export default mongoose.models.Volunteer || mongoose.model<IVolunteer>("Volunteer", volunteerSchema)
