import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/languageContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkySight - Modern Weather Dashboard",
  description: "Beautiful, modern weather dashboard with real-time forecasts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  )
}
