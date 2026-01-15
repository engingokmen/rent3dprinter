import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import serverStore from "@/lib/server-store";
import { z } from "zod";

const updatePrinterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  specifications: z
    .object({
      buildVolume: z.string().optional(),
      layerHeight: z.string().optional(),
      materials: z.array(z.string()).optional(),
      technology: z.string().optional(),
    })
    .optional(),
  pricePerHour: z.number().positive().optional(),
  location: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(["available", "unavailable"]).optional(),
});

// GET /api/printers/[id] - Get a specific printer
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const printer = serverStore.getPrinterById(id);

    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    return NextResponse.json(printer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch printer" },
      { status: 500 }
    );
  }
}

// PUT /api/printers/[id] - Update a printer
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
    const printer = serverStore.getPrinterById(id);

    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    // Check if user owns the printer
    if (printer.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validation = updatePrinterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updated = serverStore.updatePrinter(
      id,
      validation.data as Partial<import("@/lib/mock-data").Printer>
    );
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update printer" },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update printer" },
      { status: 500 }
    );
  }
}

// DELETE /api/printers/[id] - Delete a printer
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const printer = serverStore.getPrinterById(id);

    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    // Check if user owns the printer
    if (printer.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = serverStore.deletePrinter(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete printer" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete printer" },
      { status: 500 }
    );
  }
}
