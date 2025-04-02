"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Loader2, ArrowLeft, AlertTriangle, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { analyzeDocument } from "@/lib/document-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    text: string
    analysis: {
      summary: string
      keyPoints: string[]
      potentialIssues: string[]
    } | null
  }>({
    text: "",
    analysis: null,
  })

  // Cleanup function for the interval
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      if (
        !selectedFile.type.includes("text") &&
        !selectedFile.type.includes("image/jpeg") &&
        !selectedFile.type.includes("image/png")
      ) {
        setError("Unsupported file type. Please upload a text file (.txt) or an image file (.jpg, .png).")
        return
      }

      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File is too large. Maximum file size is 10MB.")
        return
      }

      setFile(selectedFile)
      setResult({ text: "", analysis: null })
      setError(null)
    }
  }

  const simulateProgress = () => {
    setProgress(0)

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Determine if it's an image file for slower progress simulation
    const isImage = file?.type.includes("image") || false
    const progressStep = isImage ? 1 : 5 // Slower for images
    const interval = isImage ? 500 : 300 // Longer interval for images

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          return 95
        }
        return prev + progressStep
      })
    }, interval)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)
    simulateProgress()

    try {
      // Set a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        if (isAnalyzing) {
          setError(
            "Processing is taking longer than expected. Please try a smaller or clearer image, or a text file instead.",
          )
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          setProgress(100)
          setIsAnalyzing(false)
        }
      }, 45000) // 45 second timeout

      // For text files, process directly
      if (file.type.includes("text")) {
        const text = await file.text()
        const result = {
          text,
          analysis: {
            summary: "This is a text document analysis.",
            keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
            potentialIssues: ["Potential issue 1", "Potential issue 2"],
          },
        }

        // Clear the timeout since processing completed
        clearTimeout(timeoutId)

        setResult(result)
        setProgress(100)
      } else {
        // For images, try to use Tesseract but have a fallback
        try {
          // Process the document directly in the browser
          const result = await analyzeDocument(file)

          // Clear the timeout since processing completed
          clearTimeout(timeoutId)

          setResult(result)
          setProgress(100)
        } catch (imageError) {
          console.error("Error processing image:", imageError)

          // Fallback to a simple result
          setResult({
            text: "Image text extraction failed. Please try a clearer image or a text file.",
            analysis: {
              summary: "Unable to extract text from image.",
              keyPoints: ["The image could not be processed."],
              potentialIssues: ["Try uploading a clearer image or a text file."],
            },
          })
          setProgress(100)
          clearTimeout(timeoutId)
        }
      }
    } catch (error) {
      console.error("Error analyzing document:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      setResult({
        text: "Error occurred during document processing.",
        analysis: {
          summary: "An error occurred while analyzing the document.",
          keyPoints: ["The system encountered a technical issue."],
          potentialIssues: ["Please try again or upload a different document."],
        },
      })
      setProgress(100)
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <div className="ml-auto">
            <h1 className="text-xl font-bold">Document Analysis</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-700 dark:text-blue-400">Processing Information</AlertTitle>
            <AlertDescription className="text-blue-600/80 dark:text-blue-300/80">
              All document processing happens directly in your browser. For best results, use text files (.txt) or
              small, clear images with good contrast. Large or complex images may take longer to process.
            </AlertDescription>
          </Alert>

          <Card className="mb-6 border-blue-100 dark:border-blue-900 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
              <CardTitle className="text-blue-700 dark:text-blue-400">Upload Legal Document</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading document processing tools...</p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-blue-500" />
                        <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">TXT, JPG, PNG (MAX. 10MB)</p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".txt,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {file && (
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {file?.type.includes("image")
                            ? "Processing image with OCR (this may take a moment)..."
                            : "Processing document..."}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{progress}%</span>
                      </div>
                      <Progress
                        value={progress}
                        className="w-full h-2"
                        indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={!file || isAnalyzing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {file?.type.includes("image") ? "Running OCR..." : "Analyzing..."}
                      </>
                    ) : (
                      "Analyze Document"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {result.text && (
            <Card className="border-indigo-100 dark:border-indigo-900 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
                <CardTitle className="text-indigo-700 dark:text-indigo-400">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="text">
                  <TabsList className="grid w-full grid-cols-2 bg-indigo-100 dark:bg-indigo-950/40">
                    <TabsTrigger
                      value="text"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                    >
                      Extracted Text
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                    >
                      Analysis
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 max-h-80 overflow-y-auto border-gray-200 dark:border-gray-700">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{result.text}</pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="analysis" className="mt-4">
                    {result.analysis ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                          <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">Summary</h3>
                          <p className="text-gray-700 dark:text-gray-300">{result.analysis.summary}</p>
                        </div>
                        <div className="p-4 rounded-md bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
                          <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-400 mb-2">Key Points</h3>
                          <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
                            {result.analysis.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-md bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
                          <h3 className="text-lg font-medium text-purple-700 dark:text-purple-400 mb-2">
                            Potential Issues
                          </h3>
                          <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
                            {result.analysis.potentialIssues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Analysis not available. Please analyze the document first.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

