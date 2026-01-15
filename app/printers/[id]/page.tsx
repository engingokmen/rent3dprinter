import serverStore from "@/lib/server-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Package, Layers } from "lucide-react"
import Link from "next/link"
import { OrderForm } from "@/components/orders/OrderForm"

export default async function PrinterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const printer = serverStore.getPrinterById(id)

  if (!printer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Printer not found</h1>
          <Button asChild>
            <Link href="/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{printer.name}</h1>
              <Badge variant={printer.status === "available" ? "default" : "secondary"}>
                {printer.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{printer.description}</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Build Volume</div>
                  <div className="text-sm text-muted-foreground">
                    {printer.specifications.buildVolume}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Layer Height</div>
                  <div className="text-sm text-muted-foreground">
                    {printer.specifications.layerHeight}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Technology</div>
                <div className="text-sm text-muted-foreground">
                  {printer.specifications.technology}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Supported Materials</div>
                <div className="flex flex-wrap gap-2">
                  {printer.specifications.materials.map((material) => (
                    <Badge key={material} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{printer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">${printer.pricePerHour}</span>
                <span className="text-muted-foreground">per hour</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <OrderForm printer={printer} />
        </div>
      </div>
    </div>
  )
}

