import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { NextResponse } from "next/server"

// Set maxDuration to 60 seconds (valid for all Vercel plans)
export const config = {
  maxDuration: 60,
}

// Hardcoded API key - not recommended for production but useful for troubleshooting
const GOOGLE_API_KEY = "AIzaSyDHZOiLlnHbgq-gLjgMmGDRsXCQEQdXtAg"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Use the hardcoded API key instead of environment variable
    const result = streamText({
      model: google("gemini-1.5-pro"),
      apiKey: GOOGLE_API_KEY, // Use the hardcoded key
      messages,
      system: `You are a legal assistant AI specialized in providing guidance on legal matters. 
      You can help with understanding legal documents, explaining legal concepts, and providing general legal information.
      
      Important notes:
      - You are not a lawyer and should clarify that your responses do not constitute legal advice
      - You should recommend consulting with a qualified attorney for specific legal situations
      - Be accurate, clear, and helpful in your explanations of legal concepts
      - When uncertain, acknowledge limitations rather than providing potentially incorrect information`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

