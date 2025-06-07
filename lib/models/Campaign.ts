import mongoose from "mongoose"

export interface ICampaign extends mongoose.Document {
  title: string
  description: string
  longDescription: string
  goal: number
  raised: number
  startDate: Date
  endDate: Date
  location: string
  category: string
  image: string
  gallery: string[]
  featured: boolean
  isActive: boolean
  status: "draft" | "active" | "completed" | "paused"
  tags: string[]
  beneficiaries: number
  updates: Array<{
    title: string
    content: string
    image?: string
    date: Date
  }>
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const campaignSchema = new mongoose.Schema(
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
    goal: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [1, "Goal must be greater than 0"],
    },
    raised: {
      type: Number,
      default: 0,
      min: [0, "Raised amount cannot be negative"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (this: ICampaign, value: Date) {
          return value > this.startDate
        },
        message: "End date must be after start date",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    gallery: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "paused"],
      default: "draft",
    },
    tags: [String],
    beneficiaries: {
      type: Number,
      default: 0,
      min: [0, "Beneficiaries cannot be negative"],
    },
    updates: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        image: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

// Index for better query performance
campaignSchema.index({ status: 1, isActive: 1, featured: -1 })
campaignSchema.index({ category: 1, isActive: 1 })
campaignSchema.index({ endDate: 1, isActive: 1 })

export default mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", campaignSchema)
