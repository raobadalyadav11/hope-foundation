import mongoose, { Schema, type Document } from "mongoose"

export interface ISponsor extends Document {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  website?: string
  sponsorshipType: string
  budget?: string
  interests?: string
  message?: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const SponsorSchema = new Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    sponsorshipType: { type: String, required: true },
    budget: { type: String },
    interests: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export default mongoose.models.Sponsor || mongoose.model<ISponsor>("Sponsor", SponsorSchema)
