import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                AI-Powered Legal Document Analysis
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Upload your legal documents for instant analysis and get expert guidance through our AI-powered chatbot.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#document-analyzer">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Analyze Documents
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline">
                  Legal Chatbot
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Legal document analysis"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              src="/placeholder.svg?height=550&width=800"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

