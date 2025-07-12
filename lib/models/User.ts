import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password?: string
  role: "admin" | "donor" | "volunteer" | "creator"
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  bio?: string
  skills?: string[]
  availability?: string
  experience?: string
  motivation?: string
  profileImage?: string
  preferences?: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    newsletter?: boolean
    donationReminders?: boolean
    eventUpdates?: boolean
    campaignUpdates?: boolean
    language?: string
    timezone?: string
    currency?: string
  }
  privacy?: {
    profileVisibility?: string
    showDonations?: boolean
    showVolunteerHours?: boolean
    allowMessages?: boolean
    showEmail?: boolean
    showPhone?: boolean
  }
  isActive: boolean
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "donor", "volunteer", "creator"],
      default: "donor",
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "evenings", "flexible"],
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [1000, "Experience cannot exceed 1000 characters"],
    },
    motivation: {
      type: String,
      trim: true,
      maxlength: [1000, "Motivation cannot exceed 1000 characters"],
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: true },
      donationReminders: { type: Boolean, default: true },
      eventUpdates: { type: Boolean, default: true },
      campaignUpdates: { type: Boolean, default: true },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "Asia/Kolkata" },
      currency: { type: String, default: "INR" },
    },
    privacy: {
      profileVisibility: { type: String, default: "public" },
      showDonations: { type: Boolean, default: false },
      showVolunteerHours: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema)
