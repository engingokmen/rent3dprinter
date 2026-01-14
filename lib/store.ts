import { create } from "zustand";
import { Printer, Order, mockPrinters, mockOrders } from "./mock-data";

interface AppState {
  printers: Printer[];
  orders: Order[];
  addPrinter: (printer: Printer) => void;
  updatePrinter: (id: string, printer: Partial<Printer>) => void;
  deletePrinter: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
}

export const useStore = create<AppState>((set) => ({
  printers: mockPrinters,
  orders: mockOrders,
  addPrinter: (printer) =>
    set((state) => ({ printers: [...state.printers, printer] })),
  updatePrinter: (id, updates) =>
    set((state) => ({
      printers: state.printers.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  deletePrinter: (id) =>
    set((state) => ({
      printers: state.printers.filter((p) => p.id !== id),
    })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),
}));
