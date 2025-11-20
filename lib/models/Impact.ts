import mongoose from "mongoose"

export interface IImpact extends mongoose.Document {
  title: string
  description: string
  category: "education" | "healthcare" | "environment" | "community" | "emergency" | "women-empowerment" | "childcare" | "elderly-care" | "other"
  metrics: {
    livesImpacted: number
    fundsUsed: number
    projectsCompleted: number
    volunteersInvolved: number
    locationsServed: number
    beneficiariesByType?: {
      children?: number
      adults?: number
      elderly?: number
      families?: number
      communities?: number
    }
  }
  dateRange: {
    start: Date
    end: Date
  }
  location: {
    country: string
    state?: string
    city?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  campaign?: mongoose.Types.ObjectId
  event?: mongoose.Types.ObjectId
  volunteer?: mongoose.Types.ObjectId
  images: string[]
  documents: {
    title: string
    url: string
    type: string
  }[]
  verified: boolean
  verifiedBy?: mongoose.Types.ObjectId
  verifiedAt?: Date
  testimonials: {
    name: string
    role: string
    content: string
    image?: string
  }[]
  media: {
    type: "image" | "video"
    url: string
    caption?: string
  }[]
  progress: {
    planned: number
    actual: number
    percentage: number
  }
  sustainabilityScore: number // 1-10 scale
  tags: string[]
  isPublished: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const impactSchema = new mongoose.Schema(
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
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      enum: [
        "education",
        "healthcare", 
        "environment",
        "community",
        "emergency",
        "women-empowerment",
        "childcare",
        "elderly-care",
        "other"
      ],
      required: true,
    },
    metrics: {
      livesImpacted: {
        type: Number,
        required: true,
        min: [0, "Lives impacted cannot be negative"],
      },
      fundsUsed: {
        type: Number,
        required: true,
        min: [0, "Funds used cannot be negative"],
      },
      projectsCompleted: {
        type: Number,
        required: true,
        min: [0, "Projects completed cannot be negative"],
      },
      volunteersInvolved: {
        type: Number,
        required: true,
        min: [0, "Volunteers involved cannot be negative"],
      },
      locationsServed: {
        type: Number,
        required: true,
        min: [0, "Locations served cannot be negative"],
      },
      beneficiariesByType: {
        children: { type: Number, min: 0 },
        adults: { type: Number, min: 0 },
        elderly: { type: Number, min: 0 },
        families: { type: Number, min: 0 },
        communities: { type: Number, min: 0 },
      },
    },
    dateRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },
    images: [
      {
        type: String,
      },
    ],
    documents: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,
    testimonials: [
      {
        name: {
          type: String,
          required: true,
        },
        role: String,
        content: {
          type: String,
          required: true,
        },
        image: String,
      },
    ],
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        caption: String,
      },
    ],
    progress: {
      planned: {
        type: Number,
        required: true,
        min: [0, "Planned value cannot be negative"],
      },
      actual: {
        type: Number,
        required: true,
        min: [0, "Actual value cannot be negative"],
      },
      percentage: {
        type: Number,
        required: true,
        min: [0, "Percentage cannot be negative"],
        max: [100, "Percentage cannot exceed 100"],
      },
    },
    sustainabilityScore: {
      type: Number,
      min: [1, "Sustainability score must be between 1-10"],
      max: [10, "Sustainability score must be between 1-10"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Calculate percentage before saving
impactSchema.pre("save", function (next) {
  if (this.progress && this.progress.planned > 0) {
    this.progress.percentage = Math.min(
      100,
      Math.round((this.progress.actual / this.progress.planned) * 100)
    )
  }
  next()
})

export default mongoose.models.Impact || mongoose.model<IImpact>("Impact", impactSchema)