"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useChat } from "ai/react"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <div className="ml-auto">
            <h1 className="text-xl font-bold">Legal Chatbot</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Card className="h-[calc(100vh-8rem)] flex flex-col max-w-3xl mx-auto border-indigo-100 dark:border-indigo-900 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
            <CardTitle className="text-lg text-indigo-700 dark:text-indigo-400">Legal Guidance Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-4 py-4 bg-white/80 dark:bg-gray-950/80">
            <div className="space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                  <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3">
                    <svg
                      className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">How can I help you today?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                      Ask me about legal documents, contracts, regulations, or any legal questions you might have.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {["What are my tenant rights?", "Explain contract termination", "How to file a small claim?"].map(
                      (suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300"
                          onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                        >
                          {suggestion}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start gap-2 max-w-[80%]">
                      {message.role !== "user" && (
                        <Avatar className="h-7 w-7 border-2 border-indigo-200 dark:border-indigo-800">
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-indigo-50 dark:bg-indigo-950/30 text-gray-700 dark:text-gray-300 border border-indigo-100 dark:border-indigo-900"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-7 w-7 border-2 border-purple-200 dark:border-purple-800">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            U
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Type your legal question..."
                className="flex-1 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

