"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "./FileUpload"
import { Printer } from "@/lib/mock-data"
import { Calculator } from "lucide-react"

interface OrderFormProps {
  printer: Printer
}

export function OrderForm({ printer }: OrderFormProps) {
  const { addOrder } = useStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [estimatedHours, setEstimatedHours] = useState("")
  const [notes, setNotes] = useState("")

  const calculateTotal = () => {
    const hours = parseFloat(estimatedHours) || 0
    return (hours * printer.pricePerHour).toFixed(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert("Please select a 3D model file")
      return
    }

    const newOrder = {
      id: Date.now().toString(),
      customerId: "current-user",
      printerId: printer.id,
      printerName: printer.name,
      status: "pending" as const,
      modelFileUrl: URL.createObjectURL(selectedFile),
      modelFileName: selectedFile.name,
      totalPrice: parseFloat(calculateTotal()),
      paymentStatus: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addOrder(newOrder)
    alert("Order submitted! The printer owner will review your request. (This is a demo)")
    
    // Reset form
    setSelectedFile(null)
    setEstimatedHours("")
    setNotes("")
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

          <Button type="submit" className="w-full" disabled={!selectedFile || !estimatedHours}>
            Submit Print Request
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

