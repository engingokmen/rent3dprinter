import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import serverStore from "@/lib/server-store";
import { Order } from "@/lib/mock-data";
import { z } from "zod";

const orderSchema = z.object({
  printerId: z.string().min(1, "Printer ID is required"),
  printerName: z.string().min(1, "Printer name is required"),
  modelFileUrl: z.string().min(1, "Model file URL is required"),
  modelFileName: z.string().min(1, "Model file name is required"),
  totalPrice: z.number().positive("Total price must be positive"),
});

// GET /api/orders - Get orders (filtered by user role)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // "customer" or "owner"

    let orders;
    if (filter === "customer") {
      orders = serverStore.getOrdersByCustomer(session.user.id);
    } else if (filter === "owner") {
      orders = serverStore.getOrdersByPrinterOwner(session.user.id);
    } else {
      // Return all orders for the user (both as customer and owner)
      const customerOrders = serverStore.getOrdersByCustomer(session.user.id);
      const ownerOrders = serverStore.getOrdersByPrinterOwner(session.user.id);
      orders = [...customerOrders, ...ownerOrders];
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = orderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newOrder: Order = {
      id: Date.now().toString(),
      customerId: session.user.id,
      printerId: data.printerId,
      printerName: data.printerName,
      status: "pending",
      modelFileUrl: data.modelFileUrl,
      modelFileName: data.modelFileName,
      totalPrice: data.totalPrice,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const order = serverStore.addOrder(newOrder);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
