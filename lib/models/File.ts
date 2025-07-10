import mongoose from "mongoose"

const FileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
      required: true,
    },
    width: Number,
    height: Number,
    duration: Number,
    usageCount: {
      type: Number,
      default: 0,
    },
    usedIn: [
      {
        type: {
          type: String,
          enum: ["campaign", "event", "blog", "user"],
        },
        id: mongoose.Schema.Types.ObjectId,
        title: String,
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
)

// Indexes for performance
FileSchema.index({ uploadedBy: 1 })
FileSchema.index({ resourceType: 1 })
FileSchema.index({ format: 1 })
FileSchema.index({ usageCount: 1 })
FileSchema.index({ tags: 1 })
FileSchema.index({ originalName: "text", filename: "text" })

export default mongoose.models.File || mongoose.model("File", FileSchema)
