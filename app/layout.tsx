import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LegalAssist - AI-Powered Legal Document Analysis",
  description: "Upload legal documents for analysis and get AI-powered legal guidance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload Tesseract.js resources */}
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/tesseract.js@4.1.2/dist/tesseract.min.js" as="script" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>

        {/* Fallback content that will show if JavaScript fails to load */}
        <noscript>
          <div
            style={{
              padding: "20px",
              margin: "20px auto",
              maxWidth: "600px",
              textAlign: "center",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h2>JavaScript Required</h2>
            <p>This application requires JavaScript to function. Please enable JavaScript in your browser settings.</p>
          </div>
        </noscript>
      </body>
    </html>
  )
}



import './globals.css'