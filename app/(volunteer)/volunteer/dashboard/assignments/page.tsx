"use client"

import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Target } from "lucide-react"

interface Assignment {
  _id: string
  title: string
  description: string
  type: "event" | "campaign" | "task"
  status: "assigned" | "in-progress" | "completed"
  dueDate: string
  estimatedHours: number
  location?: string
  priority: "low" | "medium" | "high"
}

export default function AssignmentsPage() {
  const { data: session } = useSession()

  const { data: assignments } = useQuery({
    queryKey: ["volunteer-assignments", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/volunteer/assignments")
      if (!response.ok) throw new Error("Failed to fetch assignments")
      return response.json()
    },
    enabled: !!session?.user?.id,
  })

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const statusColors = {
    assigned: "bg-blue-100 text-blue-800",
    "in-progress": "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>Current and upcoming volunteer assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments?.map((assignment: Assignment) => (
              <div key={assignment._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm">{assignment.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={priorityColors[assignment.priority]}>{assignment.priority}</Badge>
                    <Badge className={statusColors[assignment.status]}>{assignment.status}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{assignment.estimatedHours} hours</span>
                  </div>
                  {assignment.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{assignment.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {assignment.status === "assigned" && <Button size="sm">Start Assignment</Button>}
                  {assignment.status === "in-progress" && <Button size="sm">Mark Complete</Button>}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No assignments yet</p>
                <p className="text-sm">Check back later for new opportunities!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}