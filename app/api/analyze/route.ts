import { createWorker } from "tesseract.js"
import { NextResponse } from "next/server"

// Simple NLP functions to analyze text
function extractKeyPhrases(text: string): string[] {
  // Simple keyword extraction based on frequency and legal terms
  const legalTerms = [
    "agreement",
    "contract",
    "party",
    "parties",
    "clause",
    "section",
    "term",
    "provision",
    "liability",
    "damages",
    "indemnity",
    "warranty",
    "termination",
    "confidential",
    "intellectual property",
    "governing law",
    "jurisdiction",
    "arbitration",
    "dispute",
    "breach",
    "default",
    "remedy",
    "force majeure",
    "assignment",
    "waiver",
    "amendment",
  ]

  // Convert to lowercase for comparison
  const lowerText = text.toLowerCase()

  // Find matches
  const matches = legalTerms.filter((term) => lowerText.includes(term))

  // Extract sentences containing key terms (simplified)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const keyPhrases = sentences
    .filter((sentence) => matches.some((match) => sentence.toLowerCase().includes(match)))
    .map((s) => s.trim())
    .slice(0, 5) // Limit to 5 key phrases

  return keyPhrases.length > 0 ? keyPhrases : ["No key phrases identified"]
}

function identifyPotentialIssues(text: string): string[] {
  // Look for potential issue indicators
  const issueIndicators = [
    { term: "terminat", issue: "Contains termination clauses that may affect rights" },
    { term: "liabil", issue: "Contains liability limitations or waivers" },
    { term: "warrant", issue: "Contains warranty provisions or disclaimers" },
    { term: "confiden", issue: "Contains confidentiality requirements" },
    { term: "indemn", issue: "Contains indemnification clauses" },
    { term: "dispute", issue: "Contains dispute resolution mechanisms" },
    { term: "govern", issue: "Specifies governing law which may affect interpretation" },
    { term: "assign", issue: "Contains assignment restrictions or requirements" },
    { term: "amend", issue: "Specifies amendment procedures" },
    { term: "default", issue: "Defines events of default and consequences" },
  ]

  const lowerText = text.toLowerCase()
  const issues = issueIndicators.filter(({ term }) => lowerText.includes(term)).map(({ issue }) => issue)

  return issues.length > 0 ? issues.slice(0, 3) : ["No specific legal issues identified"]
}

function summarizeText(text: string): string {
  // Simple summarization by extracting first few sentences
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  if (sentences.length <= 3) {
    return text
  }

  // Get first 2-3 sentences as summary
  return sentences.slice(0, 3).join(". ") + "."
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Extract text using Tesseract OCR
    const extractedText = await extractTextFromDocument(file)

    // Analyze the text using our NLP functions
    const analysis = {
      summary: summarizeText(extractedText),
      keyPoints: extractKeyPhrases(extractedText),
      potentialIssues: identifyPotentialIssues(extractedText),
    }

    return NextResponse.json({
      text: extractedText,
      analysis,
    })
  } catch (error) {
    console.error("Error processing document:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}

async function extractTextFromDocument(file: File): Promise<string> {
  // For text files, just read the text
  if (file.type.includes("text")) {
    return await file.text()
  }

  // For images and PDFs, use Tesseract OCR
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Initialize Tesseract worker
    const worker = await createWorker("eng")

    // Recognize text in the image
    const {
      data: { text },
    } = await worker.recognize(buffer)

    // Terminate worker
    await worker.terminate()

    return text || "No text could be extracted from this document."
  } catch (error) {
    console.error("OCR processing error:", error)
    return "Error extracting text from document. Please try a clearer image or a different file format."
  }
}

