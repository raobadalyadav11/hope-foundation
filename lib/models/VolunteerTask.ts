import mongoose from "mongoose"

export interface IVolunteerTask extends mongoose.Document {
  volunteerId: mongoose.Types.ObjectId
  title: string
  description: string
  status: "assigned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  dueDate: Date
  estimatedHours: number
  actualHours?: number
  campaignId?: mongoose.Types.ObjectId
  eventId?: mongoose.Types.ObjectId
  assignedBy: mongoose.Types.ObjectId
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const volunteerTaskSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["assigned", "in_progress", "completed", "cancelled"],
      default: "assigned",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    estimatedHours: {
      type: Number,
      required: [true, "Estimated hours is required"],
      min: [0.5, "Minimum estimated hours is 0.5"],
    },
    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
volunteerTaskSchema.index({ volunteerId: 1, status: 1 })
volunteerTaskSchema.index({ dueDate: 1, status: 1 })

export default mongoose.models.VolunteerTask || mongoose.model<IVolunteerTask>("VolunteerTask", volunteerTaskSchema)
