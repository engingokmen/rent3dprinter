import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import serverStore from "@/lib/server-store";
import { Printer } from "@/lib/mock-data";
import { z } from "zod";

const printerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  specifications: z.object({
    buildVolume: z.string().min(1, "Build volume is required"),
    layerHeight: z.string().min(1, "Layer height is required"),
    materials: z.array(z.string()),
    technology: z.string().min(1, "Technology is required"),
  }),
  pricePerHour: z.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string()).default([]),
  status: z.enum(["available", "unavailable"]).default("available"),
});

// GET /api/printers - Get all printers (or available only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get("available") === "true";

    const printers = availableOnly
      ? serverStore.getAvailablePrinters()
      : serverStore.getPrinters();
    return NextResponse.json(printers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch printers" },
      { status: 500 }
    );
  }
}

// POST /api/printers - Create a new printer
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = printerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    const newPrinter: Printer = {
      id: Date.now().toString(),
      ownerId: session.user.id,
      name: data.name,
      description: data.description,
      specifications: data.specifications,
      pricePerHour: data.pricePerHour,
      location: data.location,
      images: data.images,
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const printer = serverStore.addPrinter(newPrinter);
    return NextResponse.json(printer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create printer" },
      { status: 500 }
    );
  }
}
