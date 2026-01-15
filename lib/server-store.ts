import { Printer, Order, mockPrinters, mockOrders } from "./mock-data";

/**
 * Server-side in-memory storage class
 * This will be replaced with a database later
 */
class ServerStore {
  private printers: Printer[] = [...mockPrinters];
  private orders: Order[] = [...mockOrders];

  // Printer methods
  getPrinters(): Printer[] {
    return this.printers;
  }

  getPrinterById(id: string): Printer | undefined {
    return this.printers.find((p) => p.id === id);
  }

  getPrintersByOwner(ownerId: string): Printer[] {
    return this.printers.filter((p) => p.ownerId === ownerId);
  }

  getAvailablePrinters(): Printer[] {
    return this.printers.filter((p) => p.status === "available");
  }

  addPrinter(printer: Printer): Printer {
    this.printers.push(printer);
    return printer;
  }

  updatePrinter(id: string, updates: Partial<Printer>): Printer | null {
    const index = this.printers.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    this.printers[index] = {
      ...this.printers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.printers[index];
  }

  deletePrinter(id: string): boolean {
    const index = this.printers.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    this.printers.splice(index, 1);
    return true;
  }

  // Order methods
  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  getOrdersByCustomer(customerId: string): Order[] {
    return this.orders.filter((o) => o.customerId === customerId);
  }

  getOrdersByPrinterOwner(ownerId: string): Order[] {
    return this.orders.filter((o) => {
      const printer = this.printers.find((p) => p.id === o.printerId);
      return printer?.ownerId === ownerId;
    });
  }

  addOrder(order: Order): Order {
    this.orders.push(order);
    return order;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return null;
    }
    this.orders[index] = {
      ...this.orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.orders[index];
  }

  // Utility methods
  clearAllData(): void {
    this.printers = [];
    this.orders = [];
  }

  resetToMockData(): void {
    this.printers = [...mockPrinters];
    this.orders = [...mockOrders];
  }
}

// Create a singleton instance
const serverStore = new ServerStore();

// Export only the instance
export default serverStore;
