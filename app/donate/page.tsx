"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Shield, CreditCard, Users, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DonatePage() {
  const [amount, setAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [selectedCause, setSelectedCause] = useState("")

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000]

  const causes = [
    {
      id: "education",
      title: "Education for All",
      description: "Support schools and educational programs",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "healthcare",
      title: "Healthcare Access",
      description: "Provide medical care to underserved communities",
      icon: Heart,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "community",
      title: "Community Development",
      description: "Build infrastructure and empower communities",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "emergency",
      title: "Emergency Relief",
      description: "Respond to disasters and humanitarian crises",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  const handleDonate = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid donation amount")
      return
    }

    // Here you would integrate with Razorpay
    // For now, we'll show a success message
    alert(`Thank you for your donation of ₹${amount}! Payment integration will be implemented with Razorpay.`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Make a Donation</h1>
            <p className="text-xl opacity-90">
              Your generosity helps us create lasting change in communities worldwide. Every donation, no matter the
              size, makes a meaningful difference.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Donation Details
                </CardTitle>
                <CardDescription>Choose your donation amount and frequency to support our mission.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Type */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Donation Type</Label>
                  <RadioGroup value={donationType} onValueChange={setDonationType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time">One-time donation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly recurring</Label>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </RadioGroup>
                </div>

                {/* Cause Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Choose a Cause (Optional)</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {causes.map((cause) => (
                      <div
                        key={cause.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedCause === cause.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedCause(selectedCause === cause.id ? "" : cause.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${cause.color}`}>
                            <cause.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{cause.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{cause.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Donation Amount (₹)</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                    {predefinedAmounts.map((preAmount) => (
                      <Button
                        key={preAmount}
                        variant={amount === preAmount.toString() ? "default" : "outline"}
                        onClick={() => setAmount(preAmount.toString())}
                        className="h-12"
                      >
                        ₹{preAmount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="custom-amount">Custom Amount</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Donor Information</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter phone number" />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and privacy policy
                  </Label>
                </div>

                {/* Donate Button */}
                <Button
                  onClick={handleDonate}
                  className="w-full h-12 text-lg"
                  disabled={!amount || Number.parseFloat(amount) <= 0}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Donate ₹{amount || "0"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹{amount || "0"}</div>
                  <div className="text-sm text-gray-600">Your donation amount</div>
                </div>

                {amount && Number.parseFloat(amount) > 0 && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Can provide meals for:</span>
                      <span className="font-semibold">{Math.floor(Number.parseFloat(amount) / 50)} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Can fund education for:</span>
                      <span className="font-semibold">{Math.floor(Number.parseFloat(amount) / 200)} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Can provide medical care for:</span>
                      <span className="font-semibold">{Math.floor(Number.parseFloat(amount) / 300)} treatments</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Secure Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>SSL encrypted payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Razorpay secure gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tax deductible receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>100% transparent usage</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donors */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Supporters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">A</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Anonymous</div>
                    <div className="text-xs text-gray-500">₹5,000 • 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">R</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Rahul S.</div>
                    <div className="text-xs text-gray-500">₹2,500 • 5 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-purple-600">P</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Priya M.</div>
                    <div className="text-xs text-gray-500">₹1,000 • 1 day ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
