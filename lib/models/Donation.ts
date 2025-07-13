import mongoose from "mongoose"

export interface IDonation extends mongoose.Document {
  donorId: mongoose.Types.ObjectId | string
  campaignId?: mongoose.Types.ObjectId
  cause?: string
  amount: number
  currency: string
  orderId: string
  paymentId?: string
  signature?: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: "razorpay" | "bank_transfer" | "cash"
  donorName: string
  donorEmail: string
  donorPhone?: string
  donorAddress?: string
  isAnonymous: boolean
  message?: string
  receiptGenerated: boolean
  receiptNumber?: string
  taxDeductible: boolean
  refundReason?: string
  refundedAt?: Date
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: String,
      ref: "User",
      required: true,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    cause: {
      type: String,
      enum: ["education", "healthcare", "community", "emergency"],
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
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true,
    },
    paymentId: String,
    signature: String,
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "bank_transfer", "cash"],
      default: "razorpay",
    },
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
    donorAddress: {
      type: String,
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    receiptGenerated: {
      type: Boolean,
      default: false,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    taxDeductible: {
      type: Boolean,
      default: true,
    },
    refundReason: String,
    refundedAt: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Generate receipt number before saving
donationSchema.pre("save", function (next) {
  if (this.status === "completed" && !this.receiptNumber) {
    this.receiptNumber = `HF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  }
  next()
})

// Index for better query performance
donationSchema.index({ donorId: 1, status: 1 })
donationSchema.index({ campaignId: 1, status: 1 })
donationSchema.index({ status: 1, createdAt: -1 })

export default mongoose.models.Donation || mongoose.model<IDonation>("Donation", donationSchema)
