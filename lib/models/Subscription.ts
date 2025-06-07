import mongoose from "mongoose"

export interface ISubscription extends mongoose.Document {
  donorId: mongoose.Types.ObjectId
  campaignId?: mongoose.Types.ObjectId
  subscriptionId: string
  planId: string
  amount: number
  currency: string
  frequency: "monthly" | "quarterly" | "yearly"
  status: "active" | "paused" | "cancelled" | "expired"
  startDate: Date
  nextPaymentDate: Date
  endDate?: Date
  donorName: string
  donorEmail: string
  donorPhone?: string
  isAnonymous: boolean
  paymentMethod: "razorpay" | "bank_transfer"
  failedPayments: number
  totalPayments: number
  totalAmount: number
  lastPaymentDate?: Date
  cancelReason?: string
  cancelledAt?: Date
  metadata: Record<string, any>
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
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },
    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
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
    endDate: Date,
    donorName: {
      type: String,
      required: [true, "Donor name is required"],
      trim: true,
    },
    donorEmail: {
      type: String,
      required: [true, "Donor email is required"],
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
    paymentMethod: {
      type: String,
      enum: ["razorpay", "bank_transfer"],
      default: "razorpay",
    },
    failedPayments: {
      type: Number,
      default: 0,
    },
    totalPayments: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    lastPaymentDate: Date,
    cancelReason: String,
    cancelledAt: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
subscriptionSchema.index({ donorId: 1, status: 1 })
subscriptionSchema.index({ status: 1, nextPaymentDate: 1 })
subscriptionSchema.index({ subscriptionId: 1 })

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", subscriptionSchema)
