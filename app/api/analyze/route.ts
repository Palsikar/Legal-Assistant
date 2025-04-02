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

// Set maxDuration to 60 seconds (valid for all Vercel plans)
export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  runtime: "nodejs",
}

export async function POST(req: Request) {
  // Add CORS headers
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Extract text from the file
    let extractedText = ""

    try {
      // For text files, just read the text
      if (file.type.includes("text")) {
        extractedText = await file.text()
      } else {
        // For images and PDFs, use Tesseract OCR with optimized settings
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Create worker with optimized settings for serverless environment
        const worker = await createWorker("eng", 1, {
          logger: (m) => console.log(m),
          errorHandler: (err) => console.error("Tesseract error:", err),
          // Use lower quality for faster processing
          cacheMethod: "memory",
          // Optimize for speed over accuracy
          engineMode: "speed",
        })

        // Set parameters for faster processing
        await worker.setParameters({
          tessedit_ocr_engine_mode: 3, // Legacy engine only
          tessedit_pageseg_mode: 1, // Automatic page segmentation with OSD
          tessedit_char_whitelist:
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:'\"()[]{}!@#$%^&*-+=<>?/ ", // Limit character set
        })

        // Recognize text in the image
        const {
          data: { text },
        } = await worker.recognize(buffer)

        // Terminate worker to free resources
        await worker.terminate()

        extractedText = text || "No text could be extracted from this document."

        // If no meaningful text was extracted, provide a helpful message
        if (extractedText.trim().length < 10) {
          extractedText =
            "Limited text was extracted from this image. The document may be low quality or contain handwriting that's difficult to recognize. For best results, consider uploading a clearer image or a text file."
        }
      }
    } catch (extractError) {
      console.error("Text extraction error:", extractError)
      extractedText =
        "Error extracting text from the document. The system encountered an issue processing this file type. Please try a different file format or a text file with the document content."
    }

    // Analyze the text using our NLP functions
    const analysis = {
      summary: summarizeText(extractedText),
      keyPoints: extractKeyPhrases(extractedText),
      potentialIssues: identifyPotentialIssues(extractedText),
    }

    // Return response with CORS headers
    return NextResponse.json(
      {
        text: extractedText,
        analysis,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("Error processing document:", error)
    return NextResponse.json(
      {
        error: "Failed to process document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

