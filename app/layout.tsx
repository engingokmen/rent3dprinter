import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { SessionProvider } from "@/components/SessionProvider"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rent3DPrinter - Rent or Share Your 3D Printer",
  description: "Platform for renting 3D printers and getting your 3D models printed",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Explicitly provide default locale to avoid issues
  const messages = await getMessages({ locale: "en" })

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
