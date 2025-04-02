import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "LegalAssist - AI-Powered Legal Document Analysis",
  description: "Upload legal documents for analysis and get AI-powered legal guidance",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container py-6">
          <h1 className="text-2xl font-bold">LegalAssist</h1>
          <p className="text-blue-100 mt-1">AI-Powered Legal Document Analysis</p>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-10 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter mb-2 text-blue-700 dark:text-blue-400">
                  Legal Assistance Made Simple
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Choose an option to get started</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all border-blue-100 dark:border-blue-900 hover:border-blue-200 dark:hover:border-blue-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-t-lg">
                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
                      <FileText className="h-5 w-5 mr-2" />
                      Document Analysis
                    </CardTitle>
                    <CardDescription>Upload and analyze legal documents</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Extract text with OCR and get NLP-powered analysis of your legal documents
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/analyze" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Upload Document</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-all border-indigo-100 dark:border-indigo-900 hover:border-indigo-200 dark:hover:border-indigo-800">
                  <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-t-lg">
                    <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-400">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Legal Chatbot
                    </CardTitle>
                    <CardDescription>Get answers to legal questions</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Chat with our AI assistant for guidance on legal matters and concepts
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/chat" className="w-full">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Start Chatting</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-lg font-medium mb-2">LegalAssist</h3>
              <p className="text-gray-300 text-sm mb-4">AI-powered legal document analysis and guidance</p>
              <div className="flex justify-center space-x-4 mb-4">
                <Link href="/analyze">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                    Document Analysis
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                    Legal Chatbot
                  </Button>
                </Link>
              </div>
              <p className="text-gray-400 text-xs">© {new Date().getFullYear()} LegalAssist. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

