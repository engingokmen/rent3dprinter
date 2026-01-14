"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Printer } from "@/lib/mock-data"
import { MapPin, DollarSign } from "lucide-react"

interface PrinterCardProps {
  printer: Printer
}

export function PrinterCard({ printer }: PrinterCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{printer.name}</CardTitle>
          <Badge variant={printer.status === "available" ? "default" : "secondary"}>
            {printer.status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{printer.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {printer.location}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4" />
            ${printer.pricePerHour}/hour
          </div>
          <div className="text-sm">
            <span className="font-medium">Technology: </span>
            {printer.specifications.technology}
          </div>
          <div className="text-sm">
            <span className="font-medium">Materials: </span>
            {printer.specifications.materials.join(", ")}
          </div>
        </div>
        <Button asChild className="w-full mt-auto">
          <Link href={`/printers/${printer.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

