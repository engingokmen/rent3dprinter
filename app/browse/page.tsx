import BrowseContent from "./BrowseContent";
import serverStore from "@/lib/server-store";

export default async function BrowsePage() {
  // Get available printers from server-side store
  // This ensures all printers are in the initial HTML for better SEO
  const availablePrinters = serverStore.getAvailablePrinters();

  return <BrowseContent printers={availablePrinters} />;
}
