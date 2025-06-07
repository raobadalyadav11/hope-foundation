"use client"

import { useState } from "react"
import { Users, Target, Globe, Heart } from "lucide-react"

export default function CorporateCSRPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    website: "",
    employeeCount: "",
    csrBudget: "",
    focusAreas: "",
    timeline: "",
    message: "",
  })

  const csrPrograms = [
    {
      title: "Education Excellence",
      description: "Transform lives through quality education and skill development",
      icon: Target,
      color: "bg-blue-100 text-blue-600",
      impact: "50,000+ students benefited",
      programs: [
        "Digital literacy programs",
        "Scholarship initiatives",
        "Teacher training programs",
        "Infrastructure development",
        "Vocational skill training",
      ],
    },
    {
      title: "Healthcare Access",
      description: "Ensure healthcare reaches every corner of society",
      icon: Heart,
      color: "bg-red-100 text-red-600",
      impact: "1,00,000+ patients served",
      programs: [
        "Mobile health clinics",
        "Preventive healthcare camps",
        "Medical equipment donation",
        "Health awareness campaigns",
        "Telemedicine initiatives",
      ],
    },
    {
      title: "Environmental Sustainability",
      description: "Build a greener future for generations to come",
      icon: Globe,
      color: "bg-green-100 text-green-600",
      impact: "2,50,000+ trees planted",
      programs: [
        "Reforestation projects",
        "Waste management systems",
        "Renewable energy initiatives",
        "Water conservation projects",
        "Climate awareness programs",
      ],
    },
    {
      title: "Women Empowerment",
      description: "Empower women through skills and opportunities",
      icon: Users,
      \
