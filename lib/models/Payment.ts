import mongoose from "mongoose"

export interface IPayment extends mongoose.Document {
  donationId: mongoose.Types.ObjectId
  orderId: string
  paymentId: string
  signature: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  gateway: "razorpay" | "stripe" | "paypal"
  gatewayResponse: Record<string, any>
  refundId?: string
  refundAmount?: number
  refundReason?: string
  refundedAt?: Date
  fees: number
  netAmount: number
  createdAt: Date
  updatedAt: Date
}

const paymentSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    signature: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    gateway: {
      type: String,
      enum: ["razorpay", "stripe", "paypal"],
      default: "razorpay",
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    refundId: String,
    refundAmount: {
      type: Number,
      min: [0, "Refund amount cannot be negative"],
    },
    refundReason: String,
    refundedAt: Date,
    fees: {
      type: Number,
      default: 0,
      min: [0, "Fees cannot be negative"],
    },
    netAmount: {
      type: Number,
      required: true,
      min: [0, "Net amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
)

// Calculate net amount before saving
paymentSchema.pre("save", function (next) {
  if (this.isModified("amount") || this.isModified("fees")) {
    this.netAmount = this.amount - this.fees
  }
  next()
})

// Index for better query performance
paymentSchema.index({ donationId: 1 })
paymentSchema.index({ status: 1, createdAt: -1 })
paymentSchema.index({ gateway: 1, status: 1 })

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema)
