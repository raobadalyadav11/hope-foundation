import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300,
  },
  featuredImage: {
    type: String,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: String,
    required: true,
    enum: [
      "Impact Stories",
      "Fundraising Updates",
      "Community News",
      "Educational Content",
      "Event Coverage",
      "Volunteer Spotlights",
    ],
  },
  status: {
    type: String,
    enum: ["draft", "pending", "published", "rejected"],
    default: "draft",
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorEmail: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  adminFeedback: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create slug from title before saving
BlogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  this.updatedAt = new Date()
  next()
})

// Set publishedAt when status changes to published
BlogSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

BlogSchema.index({ authorId: 1, status: 1 })
BlogSchema.index({ status: 1, publishedAt: -1 })
BlogSchema.index({ tags: 1 })
BlogSchema.index({ category: 1 })

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema)
