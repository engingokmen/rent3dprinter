"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { PrinterCard } from "@/components/printers/PrinterCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function BrowsePage() {
  const { printers } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")

  const filteredPrinters = printers.filter((printer) => {
    const matchesSearch =
      printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      printer.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = locationFilter
      ? printer.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true
    return matchesSearch && matchesLocation && printer.status === "available"
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse 3D Printers</h1>
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search printers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="sm:w-64"
          />
        </div>
      </div>

      {filteredPrinters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No printers found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrinters.map((printer) => (
            <PrinterCard key={printer.id} printer={printer} />
          ))}
        </div>
      )}
    </div>
  )
}

