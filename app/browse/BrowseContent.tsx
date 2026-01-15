"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PrinterCard } from "@/components/printers/PrinterCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Printer } from "@/lib/mock-data";
import { Suspense } from "react";

interface BrowseContentProps {
  printers: Printer[];
}

function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const locationFilter = searchParams.get("location") || "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/browse?${params.toString()}`);
  };

  const handleLocationChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("location", value);
    } else {
      params.delete("location");
    }
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search printers..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Input
        placeholder="Filter by location..."
        value={locationFilter}
        onChange={(e) => handleLocationChange(e.target.value)}
        className="sm:w-64"
      />
    </div>
  );
}

export default function BrowseContent({ printers }: BrowseContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse 3D Printers</h1>
        <Suspense fallback={<div>Loading filters...</div>}>
          <SearchFilters />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading printers...</div>}>
        <PrinterList printers={printers} />
      </Suspense>
    </div>
  );
}

function PrinterList({ printers }: BrowseContentProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const locationFilter = searchParams.get("location") || "";

  const filteredPrinters = printers.filter((printer) => {
    const matchesSearch =
      printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      printer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter
      ? printer.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    return matchesSearch && matchesLocation && printer.status === "available";
  });

  if (filteredPrinters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No printers found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPrinters.map((printer) => (
        <PrinterCard key={printer.id} printer={printer} />
      ))}
    </div>
  );
}

