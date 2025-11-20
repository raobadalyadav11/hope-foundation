import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["email", "in-app", "sms"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipients: {
      type: {
        type: String,
        enum: ["all", "role", "specific"],
        required: true,
      },
      roles: [String],
      userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      count: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sent", "failed"],
      default: "draft",
    },
    scheduledAt: Date,
    sentAt: Date,
    deliveryStats: {
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationTemplate",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    deletedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  },
)

// Indexes for performance
NotificationSchema.index({ type: 1, status: 1 })
NotificationSchema.index({ createdBy: 1 })
NotificationSchema.index({ scheduledAt: 1 })
NotificationSchema.index({ sentAt: 1 })

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)
