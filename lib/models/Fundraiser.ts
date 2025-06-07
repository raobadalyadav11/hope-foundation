import mongoose, { Schema, type Document } from "mongoose"

export interface IFundraiser extends Document {
  campaignTitle: string
  category: string
  goal: string
  description: string
  story: string
  beneficiaries?: string
  timeline?: string
  organizerName: string
  organizerEmail: string
  organizerPhone: string
  organizationType?: string
  registrationNumber?: string
  website?: string
  type: "individual" | "organization"
  organizerId: mongoose.Types.ObjectId
  amountRaised: number
  status: "pending" | "active" | "completed" | "rejected"
  image?: string
  createdAt: Date
  updatedAt: Date
}

const FundraiserSchema = new Schema(
  {
    campaignTitle: { type: String, required: true },
    category: { type: String, required: true },
    goal: { type: String, required: true },
    description: { type: String, required: true },
    story: { type: String, required: true },
    beneficiaries: { type: String },
    timeline: { type: String },
    organizerName: { type: String, required: true },
    organizerEmail: { type: String, required: true },
    organizerPhone: { type: String, required: true },
    organizationType: { type: String },
    registrationNumber: { type: String },
    website: { type: String },
    type: {
      type: String,
      enum: ["individual", "organization"],
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountRaised: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "rejected"],
      default: "pending",
    },
    image: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Fundraiser || mongoose.model<IFundraiser>("Fundraiser", FundraiserSchema)
