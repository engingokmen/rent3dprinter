"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer } from "@/lib/mock-data"

export function PrinterForm() {
  const { addPrinter } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    buildVolume: "",
    layerHeight: "",
    technology: "FDM",
    materials: "",
    pricePerHour: "",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPrinter: Printer = {
      id: Date.now().toString(),
      ownerId: "current-user",
      name: formData.name,
      description: formData.description,
      specifications: {
        buildVolume: formData.buildVolume,
        layerHeight: formData.layerHeight,
        materials: formData.materials.split(",").map((m) => m.trim()),
        technology: formData.technology,
      },
      pricePerHour: parseFloat(formData.pricePerHour),
      location: formData.location,
      images: [],
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addPrinter(newPrinter)
    alert("Printer listed successfully! (This is a demo - no data is saved)")
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      buildVolume: "",
      layerHeight: "",
      technology: "FDM",
      materials: "",
      pricePerHour: "",
      location: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Your 3D Printer</CardTitle>
        <CardDescription>
          Add your 3D printer to start renting it out to customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Printer Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Ender 3 Pro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Describe your printer, its condition, and any special features..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildVolume">Build Volume *</Label>
              <Input
                id="buildVolume"
                value={formData.buildVolume}
                onChange={(e) => setFormData({ ...formData, buildVolume: e.target.value })}
                required
                placeholder="e.g., 220x220x250mm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layerHeight">Layer Height *</Label>
              <Input
                id="layerHeight"
                value={formData.layerHeight}
                onChange={(e) => setFormData({ ...formData, layerHeight: e.target.value })}
                required
                placeholder="e.g., 0.1-0.3mm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technology">Technology *</Label>
              <Input
                id="technology"
                value={formData.technology}
                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                required
                placeholder="FDM, SLA, SLS, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Materials (comma-separated) *</Label>
              <Input
                id="materials"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                required
                placeholder="e.g., PLA, PETG, TPU"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Price per Hour ($) *</Label>
              <Input
                id="pricePerHour"
                type="number"
                step="0.01"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                required
                placeholder="15.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="City, State"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            List Printer
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

