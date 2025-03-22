import { FileText, MessageSquare, Search, Shield } from "lucide-react"

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Powerful Legal Tools</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our platform combines advanced OCR and NLP technologies to provide comprehensive legal assistance.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <FileText className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Document OCR</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Extract text from scanned legal documents with high accuracy using advanced OCR technology.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <Search className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">NLP Analysis</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Analyze legal documents to identify key clauses, potential issues, and important information.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <MessageSquare className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Legal Chatbot</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Get instant answers to your legal questions with our AI-powered chatbot using Gemini API.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <Shield className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Your documents and conversations are encrypted and never stored without your permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

