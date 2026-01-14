import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Printer, Search, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Rent or Share Your 3D Printer
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with 3D printer owners and customers. Get your models printed
          or monetize your printer.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/browse">Browse Printers</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">List Your Printer</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Printer className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Find Printers</CardTitle>
              <CardDescription>
                Browse available 3D printers in your area and compare prices
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Upload className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Upload Models</CardTitle>
              <CardDescription>
                Upload your 3D model files and get them printed by verified
                owners
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Search className="h-12 w-12 mb-4 text-primary" />
              <CardTitle>Easy Search</CardTitle>
              <CardDescription>
                Search by location, price, printer type, and specifications
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
