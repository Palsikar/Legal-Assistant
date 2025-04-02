"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught client-side error:", error)
      setError(error.error || new Error("An unknown error occurred"))
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)

    // Also catch unhandled promise rejections
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)))
      setHasError(true)
    }

    window.addEventListener("unhandledrejection", rejectionHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900">
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The application encountered an error. This might be due to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <li>Missing API keys or environment variables</li>
              <li>Network connectivity issues</li>
              <li>Server-side errors</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-auto max-h-32">
              {error?.message || "Unknown error"}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700">
              Reload Page
            </Button>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

