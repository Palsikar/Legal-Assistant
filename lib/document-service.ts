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

// Process text and generate analysis
function analyzeText(text: string) {
  return {
    text,
    analysis: {
      summary: summarizeText(text),
      keyPoints: extractKeyPhrases(text),
      potentialIssues: identifyPotentialIssues(text),
    },
  }
}

// Client-side document analysis with Tesseract
export async function analyzeDocument(file: File) {
  try {
    console.log("Processing file:", file.name, file.type, file.size)

    let extractedText = ""

    // For text files, just read the text
    if (file.type.includes("text")) {
      extractedText = await file.text()
      console.log("Text file processed directly")
    } else if (file.type.includes("image")) {
      // For images, use a simpler approach
      try {
        // Dynamically import Tesseract.js only when needed
        const Tesseract = await import("tesseract.js")

        // Create a URL for the image
        const imageUrl = URL.createObjectURL(file)

        console.log("Starting OCR processing...")
        const result = await Tesseract.recognize(imageUrl, "eng", {
          logger: (m) => console.log(m),
          errorHandler: (err) => console.error("Tesseract error:", err),
        })

        extractedText = result.data.text
        console.log("OCR completed")

        // Clean up the URL
        URL.revokeObjectURL(imageUrl)

        if (extractedText.trim().length < 10) {
          extractedText =
            "Limited text was extracted from this image. The document may be low quality or contain handwriting that's difficult to recognize. For best results, consider uploading a clearer image or a text file."
        }
      } catch (ocrError) {
        console.error("OCR processing error:", ocrError)
        extractedText = "Error processing image with OCR. Please try a different image or a text file."
      }
    } else {
      // For unsupported file types
      extractedText = `File type ${file.type} is not supported for text extraction. Please upload a text file (.txt) or an image file (.jpg, .png).`
    }

    // Analyze the extracted text
    return analyzeText(extractedText)
  } catch (error) {
    console.error("Error in document service:", error)
    throw error
  }
}

