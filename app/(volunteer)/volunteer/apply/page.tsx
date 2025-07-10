"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Clock, Award, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { z } from "zod"

const volunteerSchema = z.object({
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  availability: z.string().min(1, "Please select your availability"),
  experience: z.string().optional(),
  motivation: z.string().min(10, "Please provide more details about your motivation"),
  preferredCauses: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
})

export default function VolunteerApplicationPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState({
    skills: [] as string[],
    availability: "",
    experience: "",
    motivation: "",
    preferredCauses: [] as string[],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  })

  const availableSkills = [
    "Teaching",
    "Healthcare",
    "Technology",
    "Marketing",
    "Event Management",
    "Fundraising",
    "Social Media",
    "Photography",
    "Writing",
    "Translation",
    "Counseling",
    "Construction",
    "Cooking",
    "Transportation",
    "Administration",
    "Legal",
    "Finance",
    "Design",
    "Music",
    "Sports",
  ]

  const causes = [
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "environment", label: "Environment" },
    { value: "poverty", label: "Poverty Alleviation" },
    { value: "disaster-relief", label: "Disaster Relief" },
    { value: "women-empowerment", label: "Women Empowerment" },
    { value: "child-welfare", label: "Child Welfare" },
    { value: "elderly-care", label: "Elderly Care" },
  ]

  const applyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/volunteer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit application")
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success("Volunteer application submitted successfully!")
      router.push("/volunteer/dashboard")
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleCauseToggle = (cause: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCauses: prev.preferredCauses.includes(cause)
        ? prev.preferredCauses.filter((c) => c !== cause)
        : [...prev.preferredCauses, cause],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error("Please login to apply as a volunteer")
      return
    }

    try {
      volunteerSchema.parse(formData)
      applyMutation.mutate(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      }
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Login Required</h3>
                <p className="text-gray-600 mb-6">Please login or create an account to apply as a volunteer.</p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/signin">Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Volunteer Application</h1>
            <p className="text-xl text-gray-600">Join our community and make a difference</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Skills & Expertise"}
                {currentStep === 2 && "Availability & Experience"}
                {currentStep === 3 && "Motivation & Interests"}
                {currentStep === 4 && "Emergency Contact"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your skills and what you can contribute"}
                {currentStep === 2 && "When are you available and what's your experience?"}
                {currentStep === 3 && "Why do you want to volunteer and what causes interest you?"}
                {currentStep === 4 && "Provide emergency contact information for safety"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Skills */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Skills & Expertise <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-4">Select all skills that apply to you</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill}
                              checked={formData.skills.includes(skill)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                            />
                            <Label htmlFor={skill} className="text-sm cursor-pointer">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {formData.skills.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">✓ {formData.skills.length} skills selected</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Availability & Experience */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="availability" className="text-base font-semibold">
                        Availability <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekdays">Weekdays (Monday - Friday)</SelectItem>
                          <SelectItem value="weekends">Weekends (Saturday - Sunday)</SelectItem>
                          <SelectItem value="evenings">Evenings (After 6 PM)</SelectItem>
                          <SelectItem value="flexible">Flexible (Any time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience" className="text-base font-semibold">
                        Previous Volunteer Experience
                      </Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about any previous volunteer work or relevant experience..."
                        value={formData.experience}
                        onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                        className="mt-2"
                        rows={4}
                      />
                      <p className="text-sm text-gray-500 mt-1">Optional - but helps us understand your background</p>
                    </div>
                  </div>
                )}

                {/* Step 3: Motivation & Interests */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="motivation" className="text-base font-semibold">
                        Why do you want to volunteer? <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="motivation"
                        placeholder="Share your motivation for volunteering and what you hope to achieve..."
                        value={formData.motivation}
                        onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                        className="mt-2"
                        rows={5}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.motivation.length}/500 characters (minimum 10)
                      </p>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">Preferred Causes</Label>
                      <p className="text-sm text-gray-600 mb-4">Select the causes you're most passionate about</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {causes.map((cause) => (
                          <div key={cause.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={cause.value}
                              checked={formData.preferredCauses.includes(cause.value)}
                              onCheckedChange={() => handleCauseToggle(cause.value)}
                            />
                            <Label htmlFor={cause.value} className="text-sm cursor-pointer">
                              {cause.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Emergency Contact */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        Emergency Contact <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-sm text-gray-600 mb-4">
                        This information is kept confidential and used only for emergency situations
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="emergencyName">Full Name</Label>
                          <Input
                            id="emergencyName"
                            placeholder="John Doe"
                            value={formData.emergencyContact.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emergencyContact: { ...prev.emergencyContact, name: e.target.value },
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyRelationship">Relationship</Label>
                          <Input
                            id="emergencyRelationship"
                            placeholder="Parent, Spouse, Friend"
                            value={formData.emergencyContact.relationship}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value },
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyPhone">Phone Number</Label>
                          <Input
                            id="emergencyPhone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.emergencyContact.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                emergencyContact: { ...prev.emergencyContact, phone: e.target.value },
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Application Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Application Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Skills Selected:</p>
                          <p className="text-gray-600">{formData.skills.length} skills</p>
                        </div>
                        <div>
                          <p className="font-medium">Availability:</p>
                          <p className="text-gray-600">{formData.availability || "Not selected"}</p>
                        </div>
                        <div>
                          <p className="font-medium">Preferred Causes:</p>
                          <p className="text-gray-600">{formData.preferredCauses.length} causes</p>
                        </div>
                        <div>
                          <p className="font-medium">Emergency Contact:</p>
                          <p className="text-gray-600">{formData.emergencyContact.name || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && formData.skills.length === 0) ||
                        (currentStep === 2 && !formData.availability) ||
                        (currentStep === 3 && formData.motivation.length < 10)
                      }
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        applyMutation.isPending ||
                        !formData.emergencyContact.name ||
                        !formData.emergencyContact.relationship ||
                        !formData.emergencyContact.phone
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {applyMutation.isPending ? (
                        "Submitting..."
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Why Volunteer Section */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Make an Impact</h3>
              <p className="text-gray-600 text-sm">
                Directly contribute to meaningful causes and see the tangible results of your efforts.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Build Community</h3>
              <p className="text-gray-600 text-sm">
                Connect with like-minded individuals and build lasting friendships.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Develop Skills</h3>
              <p className="text-gray-600 text-sm">
                Gain valuable experience and enhance your resume while helping others.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600 text-sm">Choose opportunities that fit your schedule and availability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
