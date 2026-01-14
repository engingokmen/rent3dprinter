export interface Printer {
  id: string
  ownerId: string
  name: string
  description: string
  specifications: {
    buildVolume: string
    layerHeight: string
    materials: string[]
    technology: string
  }
  pricePerHour: number
  location: string
  images: string[]
  status: "available" | "unavailable"
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  customerId: string
  printerId: string
  printerName: string
  status: "pending" | "approved" | "rejected" | "completed"
  modelFileUrl: string
  modelFileName: string
  totalPrice: number
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
  updatedAt: string
}

export const mockPrinters: Printer[] = [
  {
    id: "1",
    ownerId: "owner1",
    name: "Ender 3 Pro",
    description: "Reliable FDM printer perfect for large prints. Well maintained and calibrated.",
    specifications: {
      buildVolume: "220x220x250mm",
      layerHeight: "0.1-0.3mm",
      materials: ["PLA", "PETG", "TPU"],
      technology: "FDM"
    },
    pricePerHour: 15,
    location: "San Francisco, CA",
    images: ["/printer1.jpg"],
    status: "available",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    ownerId: "owner2",
    name: "Prusa i3 MK3S+",
    description: "High-quality printer with excellent print quality. Auto bed leveling included.",
    specifications: {
      buildVolume: "250x210x210mm",
      layerHeight: "0.05-0.3mm",
      materials: ["PLA", "PETG", "ASA", "TPU"],
      technology: "FDM"
    },
    pricePerHour: 25,
    location: "Oakland, CA",
    images: ["/printer2.jpg"],
    status: "available",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "3",
    ownerId: "owner3",
    name: "Elegoo Mars 3",
    description: "Resin printer for high-detail prints. Perfect for miniatures and detailed models.",
    specifications: {
      buildVolume: "143x89x175mm",
      layerHeight: "0.01-0.1mm",
      materials: ["Resin"],
      technology: "SLA"
    },
    pricePerHour: 20,
    location: "San Jose, CA",
    images: ["/printer3.jpg"],
    status: "available",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z"
  },
  {
    id: "4",
    ownerId: "owner1",
    name: "Bambu Lab X1 Carbon",
    description: "High-speed printer with multi-color capability. Advanced features and reliability.",
    specifications: {
      buildVolume: "256x256x256mm",
      layerHeight: "0.08-0.3mm",
      materials: ["PLA", "PETG", "TPU", "ABS"],
      technology: "FDM"
    },
    pricePerHour: 30,
    location: "San Francisco, CA",
    images: ["/printer4.jpg"],
    status: "available",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z"
  }
]

export const mockOrders: Order[] = [
  {
    id: "order1",
    customerId: "customer1",
    printerId: "1",
    printerName: "Ender 3 Pro",
    status: "pending",
    modelFileUrl: "/models/model1.stl",
    modelFileName: "custom_part.stl",
    totalPrice: 45,
    paymentStatus: "pending",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "order2",
    customerId: "customer2",
    printerId: "2",
    printerName: "Prusa i3 MK3S+",
    status: "approved",
    modelFileUrl: "/models/model2.stl",
    modelFileName: "prototype.stl",
    totalPrice: 75,
    paymentStatus: "paid",
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-03-06T10:00:00Z"
  }
]

