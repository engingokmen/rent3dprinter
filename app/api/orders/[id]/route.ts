import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import serverStore from "@/lib/server-store";
import { z } from "zod";

const updateOrderSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "completed"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
});

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = serverStore.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user is the customer or printer owner
    const printer = serverStore.getPrinterById(order.printerId);
    const isAuthorized =
      order.customerId === session.user.id ||
      printer?.ownerId === session.user.id;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = serverStore.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const printer = serverStore.getPrinterById(order.printerId);
    const isPrinterOwner = printer?.ownerId === session.user.id;
    const isCustomer = order.customerId === session.user.id;

    // Only printer owner can approve/reject orders
    // Customer can only update payment status
    const body = await request.json();
    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validation.data;

    // Check permissions
    if (updates.status && !isPrinterOwner) {
      return NextResponse.json(
        { error: "Only printer owner can update order status" },
        { status: 403 }
      );
    }

    if (updates.paymentStatus && !isCustomer && !isPrinterOwner) {
      return NextResponse.json(
        { error: "Unauthorized to update payment status" },
        { status: 403 }
      );
    }

    const updated = serverStore.updateOrder(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
