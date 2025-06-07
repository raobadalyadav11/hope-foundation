import mongoose, { Schema, type Document } from "mongoose"

export interface ICorporateCSR extends Document {
  companyName: string
  industry: string
  contactPerson: string
  designation: string
  email: string
  phone: string
  website?: string
  employeeCount?: string
  csrBudget?: string
  focusAreas?: string
  timeline?: string
  message?: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const CorporateCSRSchema = new Schema(
  {
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    employeeCount: { type: String },
    csrBudget: { type: String },
    focusAreas: { type: String },
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

export default mongoose.models.CorporateCSR || mongoose.model<ICorporateCSR>("CorporateCSR", CorporateCSRSchema)
