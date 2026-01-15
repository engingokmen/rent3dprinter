import { Printer, Order } from "./mock-data";

const API_BASE = "/api";

// Printer API calls
export async function fetchPrinters(availableOnly = false): Promise<Printer[]> {
  const url = availableOnly
    ? `${API_BASE}/printers?available=true`
    : `${API_BASE}/printers`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch printers");
  }
  return response.json();
}

export async function fetchPrinter(id: string): Promise<Printer> {
  const response = await fetch(`${API_BASE}/printers/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch printer");
  }
  return response.json();
}

export async function createPrinter(
  printer: Omit<Printer, "id" | "ownerId" | "createdAt" | "updatedAt">
): Promise<Printer> {
  const response = await fetch(`${API_BASE}/printers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(printer),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create printer");
  }
  return response.json();
}

export async function updatePrinter(
  id: string,
  updates: Partial<Printer>
): Promise<Printer> {
  const response = await fetch(`${API_BASE}/printers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update printer");
  }
  return response.json();
}

export async function deletePrinter(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/printers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete printer");
  }
}

// Order API calls
export async function fetchOrders(filter?: "customer" | "owner"): Promise<Order[]> {
  const url = filter
    ? `${API_BASE}/orders?filter=${filter}`
    : `${API_BASE}/orders`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

export async function fetchOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return response.json();
}

export async function createOrder(
  order: Omit<Order, "id" | "customerId" | "status" | "paymentStatus" | "createdAt" | "updatedAt">
): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }
  return response.json();
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order> {
  const response = await fetch(`${API_BASE}/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update order");
  }
  return response.json();
}
