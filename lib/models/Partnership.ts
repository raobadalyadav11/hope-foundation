import mongoose, { Schema, type Document } from "mongoose"

export interface IPartnership extends Document {
  organizationName: string
  organizationType: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  partnershipType: string
  description: string
  resources?: string
  timeline?: string
  message?: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const PartnershipSchema = new Schema(
  {
    organizationName: { type: String, required: true },
    organizationType: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    partnershipType: { type: String, required: true },
    description: { type: String, required: true },
    resources: { type: String },
    timeline: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Partnership || mongoose.model<IPartnership>("Partnership", PartnershipSchema)
