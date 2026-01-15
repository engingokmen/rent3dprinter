import { mockPrinters } from "@/lib/mock-data";
import BrowseContent from "./BrowseContent";

export default async function BrowsePage() {
  // Get all available printers - pass to client for filtering
  // This ensures all printers are in the initial HTML for better SEO
  const availablePrinters = mockPrinters.filter(
    (printer) => printer.status === "available"
  );

  return <BrowseContent printers={availablePrinters} />;
}
