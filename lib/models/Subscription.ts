import mongoose from "mongoose"

export interface ISubscription extends mongoose.Document {
  donorId: mongoose.Types.ObjectId
  campaignId?: mongoose.Types.ObjectId
  subscriptionId: string
  planId: string
  amount: number
  frequency: "monthly" | "quarterly" | "yearly"
  status: "active" | "paused" | "cancelled" | "expired"
  startDate: Date
  nextPaymentDate: Date
  lastPaymentDate?: Date
  totalPayments: number
  totalAmount: number
  failedPayments: number
  donorName: string
  donorEmail: string
  donorPhone?: string
  isAnonymous: boolean
  cancelledAt?: Date
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
}

const subscriptionSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    planId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [100, "Minimum subscription amount is ₹100"],
    },
    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    nextPaymentDate: {
      type: Date,
      required: true,
    },
    lastPaymentDate: Date,
    totalPayments: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    failedPayments: {
      type: Number,
      default: 0,
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    donorPhone: {
      type: String,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    cancelledAt: Date,
    cancelReason: String,
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
subscriptionSchema.index({ donorId: 1, status: 1 })
subscriptionSchema.index({ subscriptionId: 1 }, { unique: true })
subscriptionSchema.index({ nextPaymentDate: 1, status: 1 })

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", subscriptionSchema)
