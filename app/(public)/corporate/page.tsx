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
      color: "bg-purple-100 text-purple-600",
      impact: "2,50,000+ trees planted",
      programs: [
        "Skill development workshops",
        "Entrepreneurship support",
        "Health and wellness programs",
        "Legal awareness campaigns",
        "Leadership training initiatives",
      ],
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Corporate CSR Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {csrPrograms.map((program, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-4 ${program.color}`}
          >
            <div className="flex items-center mb-2">
              <program.icon className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-semibold">{program.title}</h2>
            </div>
            <p className="text-gray-600">{program.description}</p>
            <p className="text-gray-600 mt-2">
              <strong>Impact:</strong> {program.impact}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Programs:</strong> {program.programs.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}