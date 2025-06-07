import mongoose from "mongoose"

export interface IBlog extends mongoose.Document {
  title: string
  slug: string
  content: string
  excerpt: string
  authorId: mongoose.Types.ObjectId
  status: "draft" | "published" | "archived"
  tags: string[]
  category: string
  image: string
  gallery: string[]
  readTime: string
  views: number
  likes: mongoose.Types.ObjectId[]
  comments: Array<{
    userId: mongoose.Types.ObjectId
    content: string
    createdAt: Date
    isApproved: boolean
  }>
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  publishedAt?: Date
  scheduledAt?: Date
  createdAt: Date
  updatedAt: Date
}

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["impact-stories", "news", "education", "healthcare", "environment", "volunteer-stories", "fundraising"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    gallery: [String],
    readTime: {
      type: String,
      required: [true, "Read time is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isApproved: {
          type: Boolean,
          default: false,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
    },
    publishedAt: Date,
    scheduledAt: Date,
  },
  {
    timestamps: true,
  },
)

// Generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Set publishedAt when status changes to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

// Index for better query performance
blogSchema.index({ status: 1, publishedAt: -1 })
blogSchema.index({ category: 1, status: 1 })
blogSchema.index({ tags: 1, status: 1 })
blogSchema.index({ slug: 1 }, { unique: true })

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema)
