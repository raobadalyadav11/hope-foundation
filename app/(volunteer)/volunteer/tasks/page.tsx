"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Task {
  _id: string
  title: string
  description: string
  status: "assigned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  dueDate: string
  estimatedHours: number
  actualHours?: number
  campaignId?: {
    _id: string
    title: string
  }
  eventId?: {
    _id: string
    title: string
    date: string
    location: string
  }
  assignedBy: {
    name: string
    email: string
  }
  createdAt: string
}

export default function VolunteerTasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [logHoursDialog, setLogHoursDialog] = useState<{
    open: boolean
    task: Task | null
  }>({
    open: false,
    task: null,
  })
  const [hoursLogged, setHoursLogged] = useState("")

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/volunteer/tasks")
      const data = await response.json()

      if (response.ok) {
        setTasks(data.tasks || [])
      } else {
        toast.error(data.error || "Failed to fetch tasks")
      }
    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, status: string, hours?: number) => {
    try {
      const response = await fetch(`/api/volunteer/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, actualHours: hours }),
      })

      if (response.ok) {
        toast.success("Task updated successfully")
        fetchTasks()
        setLogHoursDialog({ open: false, task: null })
        setHoursLogged("")
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update task")
      }
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleCompleteTask = () => {
    if (!logHoursDialog.task) return

    const hours = Number.parseFloat(hoursLogged)
    if (isNaN(hours) || hours <= 0) {
      toast.error("Please enter valid hours")
      return
    }

    updateTaskStatus(logHoursDialog.task._id, "completed", hours)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      assigned: "secondary",
      in_progress: "default",
      completed: "outline",
      cancelled: "destructive",
    }

    return <Badge variant={variants[status] || "outline"}>{status.replace("_", " ").toUpperCase()}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }

    return <Badge className={colors[priority] || "bg-gray-100 text-gray-800"}>{priority.toUpperCase()}</Badge>
  }

  useEffect(() => {
    if (session) {
      fetchTasks()
    }
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-gray-600">Manage your assigned volunteer tasks</p>
      </div>

      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Tasks Assigned</h2>
            <p className="text-gray-600 mb-6">You don't have any tasks assigned yet. Check back later!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {task.title}
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === "assigned" && (
                      <Button variant="outline" size="sm" onClick={() => updateTaskStatus(task._id, "in_progress")}>
                        Start Task
                      </Button>
                    )}
                    {task.status === "in_progress" && (
                      <Dialog
                        open={logHoursDialog.open && logHoursDialog.task?._id === task._id}
                        onOpenChange={(open) =>
                          setLogHoursDialog({
                            open,
                            task: open ? task : null,
                          })
                        }
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Complete Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>How many hours did you spend on this task?</p>
                            <div>
                              <Label htmlFor="hours">Hours Worked</Label>
                              <Input
                                id="hours"
                                type="number"
                                step="0.5"
                                min="0.5"
                                value={hoursLogged}
                                onChange={(e) => setHoursLogged(e.target.value)}
                                placeholder="Enter hours worked"
                              />
                            </div>
                            <Button onClick={handleCompleteTask} className="w-full">
                              Complete Task
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Hours</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{task.estimatedHours}h</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned By</p>
                    <p className="text-sm font-medium">{task.assignedBy.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Related To</p>
                    <p className="text-sm font-medium">{task.campaignId?.title || task.eventId?.title || "General"}</p>
                  </div>
                </div>

                {task.eventId && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Event: {task.eventId.title} on {new Date(task.eventId.date).toLocaleDateString()} at{" "}
                        {task.eventId.location}
                      </span>
                    </div>
                  </div>
                )}

                {task.status === "completed" && task.actualHours && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Completed in {task.actualHours} hours</span>
                    </div>
                  </div>
                )}

                {new Date(task.dueDate) < new Date() && task.status !== "completed" && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">This task is overdue</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
