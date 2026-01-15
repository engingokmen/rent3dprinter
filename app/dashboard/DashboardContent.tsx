"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { fetchPrinters, fetchOrders, updateOrder } from "@/lib/api";
import { Printer, Order } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrinterForm } from "@/components/printers/PrinterForm";
import { PrinterCard } from "@/components/printers/PrinterCard";
import { FileText, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardContent() {
  const t = useTranslations("dashboard");
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-printers");
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user ID from session
  const currentUserId = session?.user?.id || "";

  // Fetch data on mount and when session changes
  useEffect(() => {
    if (currentUserId) {
      loadData();
    }
  }, [currentUserId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [printersData, ordersData] = await Promise.all([
        fetchPrinters(),
        fetchOrders(),
      ]);
      setPrinters(printersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter printers owned by current user
  const myPrinters = printers.filter((p) => p.ownerId === currentUserId);

  // Filter orders where user is customer
  const myOrders = orders.filter((o) => o.customerId === currentUserId);

  // Filter orders for printers owned by current user
  const printerOrders = orders.filter((o) => {
    const printer = printers.find((p) => p.id === o.printerId);
    return printer?.ownerId === currentUserId;
  });

  const handleApproveOrder = async (orderId: string) => {
    try {
      await updateOrder(orderId, { status: "approved" });
      await loadData(); // Refresh data
      router.refresh();
    } catch (error) {
      console.error("Failed to approve order:", error);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await updateOrder(orderId, { status: "rejected" });
      await loadData(); // Refresh data
      router.refresh();
    } catch (error) {
      console.error("Failed to reject order:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {t("status.pending")}
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("status.approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            {t("status.rejected")}
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t("status.completed")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">Manage your printers and orders</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="my-printers">{t("myPrinters")}</TabsTrigger>
          <TabsTrigger value="list-printer">{t("listPrinter")}</TabsTrigger>
          <TabsTrigger value="my-orders">{t("myOrders")}</TabsTrigger>
          <TabsTrigger value="printer-orders">{t("printerOrders")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-printers" className="space-y-4">
          {myPrinters.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">{t("noPrinters")}</p>
                <Button onClick={() => setActiveTab("list-printer")}>
                  {t("listFirstPrinter")}
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
                <p className="text-muted-foreground mb-4">{t("noOrders")}</p>
                <Button asChild>
                  <Link href="/browse">{t("browsePrinters")}</Link>
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
                          {t("file")}: {order.modelFileName}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {t("totalPrice")}
                        </p>
                        <p className="font-semibold">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("paymentStatus")}
                        </p>
                        <p className="font-semibold capitalize">
                          {t(`payment.${order.paymentStatus}`)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("orderDate")}
                        </p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {order.status === "approved" &&
                        order.paymentStatus === "pending" && (
                          <div className="col-span-2">
                            <Button className="w-full">
                              {t("proceedToPayment")}
                            </Button>
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
                <p className="text-muted-foreground">{t("noPrinterOrders")}</p>
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
                          {t("file")}: {order.modelFileName}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">
                          {t("totalPrice")}
                        </p>
                        <p className="font-semibold">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {t("orderDate")}
                        </p>
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
  );
}
