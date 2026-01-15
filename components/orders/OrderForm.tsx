"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "./FileUpload"
import { Printer } from "@/lib/mock-data"
import { Calculator, AlertCircle, CheckCircle } from "lucide-react"

interface OrderFormProps {
  printer: Printer
}

export function OrderForm({ printer }: OrderFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [estimatedHours, setEstimatedHours] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const calculateTotal = () => {
    const hours = parseFloat(estimatedHours) || 0
    return (hours * printer.pricePerHour).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!selectedFile) {
      setError("Please select a 3D model file")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would upload the file to a storage service first
      // For now, we'll use a placeholder URL
      const modelFileUrl = URL.createObjectURL(selectedFile)

      await createOrder({
        printerId: printer.id,
        printerName: printer.name,
        modelFileUrl,
        modelFileName: selectedFile.name,
        totalPrice: parseFloat(calculateTotal()),
      })

      setSuccess("Order submitted! The printer owner will review your request.")
      
      // Reset form
      setSelectedFile(null)
      setEstimatedHours("")
      setNotes("")

      // Refresh to show the new order
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to submit order")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Print</CardTitle>
        <CardDescription>
          Upload your 3D model and submit a print request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}
          <FileUpload onFileSelect={setSelectedFile} />

          <div className="space-y-2">
            <Label htmlFor="estimatedHours">Estimated Print Time (hours) *</Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.1"
              min="0.1"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              required
              placeholder="e.g., 3.5"
            />
            <p className="text-xs text-muted-foreground">
              Estimate how long the print will take
            </p>
          </div>

          {estimatedHours && parseFloat(estimatedHours) > 0 && (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Calculator className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Total</p>
                <p className="text-2xl font-bold">${calculateTotal()}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requirements or instructions..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!selectedFile || !estimatedHours || isLoading}>
            {isLoading ? "Submitting..." : "Submit Print Request"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The printer owner will review your request and approve or reject it.
            Payment will be required after approval.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

