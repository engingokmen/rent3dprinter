"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Printer className="h-6 w-6" />
            <span className="text-xl font-bold">Rent3DPrinter</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/browse">Browse</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

