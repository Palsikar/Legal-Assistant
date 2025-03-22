import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Use the existing environment variable for the API key
  const result = streamText({
    model: google("gemini-1.5-pro"),
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
}

