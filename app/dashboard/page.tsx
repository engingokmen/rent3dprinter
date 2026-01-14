"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PrinterForm } from "@/components/printers/PrinterForm"
import { PrinterCard } from "@/components/printers/PrinterCard"
import { FileText, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { printers, orders, updateOrder } = useStore()
  const [activeTab, setActiveTab] = useState("my-printers")

  // Get current user ID from session
  const currentUserId = session?.user?.id || ""
  
  // Filter printers owned by current user
  const myPrinters = printers.filter((p) => p.ownerId === currentUserId)
  
  // Filter orders where user is customer
  const myOrders = orders.filter((o) => o.customerId === currentUserId)
  
  // Filter orders for printers owned by current user
  const printerOrders = orders.filter((o) => {
    const printer = printers.find((p) => p.id === o.printerId)
    return printer?.ownerId === currentUserId
  })

  const handleApproveOrder = (orderId: string) => {
    updateOrder(orderId, { status: "approved" })
  }

  const handleRejectOrder = (orderId: string) => {
    updateOrder(orderId, { status: "rejected" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "completed":
        return <Badge className="bg-blue-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your printers and orders
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-printers">My Printers</TabsTrigger>
          <TabsTrigger value="list-printer">List New Printer</TabsTrigger>
          <TabsTrigger value="my-orders">My Orders</TabsTrigger>
          <TabsTrigger value="printer-orders">Orders for My Printers</TabsTrigger>
        </TabsList>

        <TabsContent value="my-printers" className="space-y-4">
          {myPrinters.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't listed any printers yet.</p>
                <Button onClick={() => setActiveTab("list-printer")}>
                  List Your First Printer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPrinters.map((printer) => (
                <PrinterCard key={printer.id} printer={printer} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list-printer">
          <PrinterForm />
        </TabsContent>

        <TabsContent value="my-orders" className="space-y-4">
          {myOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button asChild>
                  <Link href="/browse">Browse Printers</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{order.printerName}</CardTitle>
                        <CardDescription>
                          File: {order.modelFileName}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Price</p>
                        <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment Status</p>
                        <p className="font-semibold capitalize">{order.paymentStatus}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {order.status === "approved" && order.paymentStatus === "pending" && (
                        <div className="col-span-2">
                          <Button className="w-full">Proceed to Payment</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="printer-orders" className="space-y-4">
          {printerOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No orders for your printers yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {printerOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{order.printerName}</CardTitle>
                        <CardDescription>
                          File: {order.modelFileName}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Total Price</p>
                        <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {order.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveOrder(order.id)}
                          className="flex-1"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectOrder(order.id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

