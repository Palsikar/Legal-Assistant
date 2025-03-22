import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, CheckCircle, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

        <section className="py-12 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">About LegalAssist</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Powerful AI tools for legal document analysis and guidance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="font-medium text-blue-700 dark:text-blue-400">OCR Technology</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Extract text from scanned documents and images using Tesseract OCR
                  </p>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h3 className="font-medium text-indigo-700 dark:text-indigo-400">NLP Analysis</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identify key legal terms, potential issues, and summarize documents
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg border border-purple-100 dark:border-purple-900">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <h3 className="font-medium text-purple-700 dark:text-purple-400">AI Chatbot</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get legal guidance and answers using Google's Gemini AI technology
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Frequently Asked Questions
                </h3>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      How does the document analysis work?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                      Our system uses Tesseract OCR to extract text from your uploaded documents. Then, our NLP engine
                      analyzes the content to identify key legal terms, summarize the document, and highlight potential
                      issues or concerns.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      What types of documents can I analyze?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                      You can upload PDFs, images (JPG, PNG), and text files. The system works best with clearly scanned
                      documents. For handwritten documents, results may vary depending on legibility.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Is the legal chatbot providing legal advice?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                      No, the chatbot provides general legal information and guidance but does not constitute legal
                      advice. For specific legal situations, we recommend consulting with a qualified attorney.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Is my data secure?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                      Yes, we prioritize your privacy and security. Documents are processed securely and are not stored
                      permanently without your permission. All communications are encrypted.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>

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
    </div>
  )
}

