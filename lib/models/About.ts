import mongoose, { Schema } from "mongoose";

// Team Member Schema
const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
  education: { type: String, required: true },
  experience: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: { type: String, required: true },
});

// Milestone Schema
const MilestoneSchema = new Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  impact: { type: String, required: true },
});

// Value Schema
const ValueSchema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Achievement Schema
const AchievementSchema = new Schema({
  metric: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
});

// About Schema
const AboutSchema = new Schema({
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  impact: { type: String, required: true },
  teamMembers: [TeamMemberSchema],
  milestones: [MilestoneSchema],
  values: [ValueSchema],
  achievements: [AchievementSchema],
});

export default mongoose.models.About || mongoose.model("About", AboutSchema);