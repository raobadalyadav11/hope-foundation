"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Shield, CreditCard, Users, BookOpen, Calendar, Repeat } from "lucide-react"
import { toast } from "sonner"
import Script from "next/script"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function DonatePage() {
  const { data: session } = useSession()
  const [amount, setAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [frequency, setFrequency] = useState("monthly")
  const [selectedCause, setSelectedCause] = useState("")
  const [donorInfo, setDonorInfo] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
  })
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const handleOneTimeDonation = async () => {
    if (!session) {
      toast.error("Please login to make a donation")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Please enter a valid donation amount")
      return
    }

    if (!donorInfo.name || !donorInfo.email) {
      toast.error("Please fill in your contact information")
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const response = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          campaignId: selectedCause || undefined,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          donorPhone: donorInfo.phone,
          donorAddress: donorInfo.address,
          isAnonymous,
        }),
      })

      const orderData = await response.json()

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hope Foundation",
        description: "Donation to Hope Foundation",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/donations/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              toast.success("Thank you for your donation! Payment successful.")
              // Reset form or redirect
              setAmount("")
              setSelectedCause("")
            } else {
              toast.error(verifyData.error || "Payment verification failed")
            }
          } catch (error) {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: donorInfo.name,
          email: donorInfo.email,
          contact: donorInfo.phone,
        },
        theme: {
          color: "#2563eb",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      toast.error(error.message || "Failed to process donation")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRecurringDonation = async () => {
    if (!session) {
      toast.error("Please login to set up recurring donation")
      return
    }

    if (!amount || Number.parseFloat(amount) < 100) {
      toast.error("Minimum amount for recurring donation is ₹100")
      return
    }

    if (!donorInfo.name || !donorInfo.email) {
      toast.error("Please fill in your contact information")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/donations/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          frequency,
          campaignId: selectedCause || undefined,
          donorName: donorInfo.name,
          donorEmail: donorInfo.email,
          donorPhone: donorInfo.phone,
          isAnonymous,
        }),
      })

      const subscriptionData = await response.json()

      if (!response.ok) {
        throw new Error(subscriptionData.error || "Failed to create subscription")
      }

      toast.success("Recurring donation set up successfully!")

      // Open Razorpay subscription link
      if (subscriptionData.shortUrl) {
        window.open(subscriptionData.shortUrl, "_blank")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to set up recurring donation")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDonate = () => {
    if (donationType === "one-time") {
      handleOneTimeDonation()
    } else {
      handleRecurringDonation()
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                        <Label htmlFor="one-time" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          One-time donation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recurring" id="recurring" />
                        <Label htmlFor="recurring" className="flex items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          Recurring donation
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Frequency Selection for Recurring */}
                  {donationType === "recurring" && (
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Monthly
                            </div>
                          </SelectItem>
                          <SelectItem value="quarterly">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Quarterly (Every 3 months)
                            </div>
                          </SelectItem>
                          <SelectItem value="yearly">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Yearly
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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
                    <Label className="text-base font-semibold mb-3 block">
                      Donation Amount (₹)
                      {donationType === "recurring" && (
                        <span className="text-sm font-normal text-gray-600 ml-2">(Minimum ₹100 for recurring)</span>
                      )}
                    </Label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                      {predefinedAmounts.map((preAmount) => (
                        <Button
                          key={preAmount}
                          variant={amount === preAmount.toString() ? "default" : "outline"}
                          onClick={() => setAmount(preAmount.toString())}
                          className="h-12"
                          disabled={donationType === "recurring" && preAmount < 100}
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
                        placeholder={`Enter amount ${donationType === "recurring" ? "(min ₹100)" : ""}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1"
                        min={donationType === "recurring" ? 100 : 1}
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Donor Information</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={donorInfo.phone}
                          onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={donorInfo.address}
                          onChange={(e) => setDonorInfo({ ...donorInfo, address: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Anonymous Donation */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(checked === true)} />
                    <Label htmlFor="anonymous" className="text-sm">
                      Make this donation anonymous
                    </Label>
                  </div>

                  {/* Donate Button */}
                  <Button
                    onClick={handleDonate}
                    className="w-full h-12 text-lg"
                    disabled={
                      !amount ||
                      Number.parseFloat(amount) <= 0 ||
                      (donationType === "recurring" && Number.parseFloat(amount) < 100) ||
                      !donorInfo.name ||
                      !donorInfo.email ||
                      isProcessing
                    }
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {donationType === "one-time" ? "Donate" : "Set up Recurring Donation"} ₹{amount || "0"}
                        {donationType === "recurring" && ` ${frequency}`}
                      </>
                    )}
                  </Button>

                  {donationType === "recurring" && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <p className="font-semibold mb-1">Recurring Donation Benefits:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Sustained impact over time</li>
                        <li>Cancel or modify anytime</li>
                        <li>Automatic tax receipts</li>
                        <li>Priority updates on impact</li>
                      </ul>
                    </div>
                  )}
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
                    <div className="text-sm text-gray-600">
                      {donationType === "one-time" ? "One-time donation" : `${frequency} donation`}
                    </div>
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

                      {donationType === "recurring" && (
                        <div className="pt-3 border-t">
                          <div className="flex justify-between font-semibold text-blue-600">
                            <span>Annual impact:</span>
                            <span>
                              ₹
                              {(
                                Number.parseFloat(amount) *
                                (frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 1)
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
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
                  {donationType === "recurring" && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Cancel anytime</span>
                    </div>
                  )}
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
                      <div className="text-xs text-gray-500">₹2,500 monthly • 5 hours ago</div>
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
    </>
  )
}
