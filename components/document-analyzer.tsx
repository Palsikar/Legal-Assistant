"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Loader2 } from "lucide-react"
import { analyzeDocument } from "@/lib/document-service"
import { Progress } from "@/components/ui/progress"

export default function DocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult({ text: "", analysis: null })
    }
  }

  const simulateProgress = () => {
    setProgress(0)
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          return 95
        }
        return prev + 5
      })
    }, 300)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    simulateProgress()

    try {
      const result = await analyzeDocument(file)
      setResult(result)
      setProgress(100)
    } catch (error) {
      console.error("Error analyzing document:", error)
      // Set a user-friendly error message
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
    <section id="document-analyzer" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">Document Analysis</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Upload your legal document to extract text with OCR and get NLP-powered analysis.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Legal Document</CardTitle>
              <CardDescription>Supported formats: PDF, JPG, PNG (Max size: 10MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG or PNG (MAX. 10MB)</p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {isAnalyzing && (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing document...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with Tesseract OCR...
                  </>
                ) : (
                  "Analyze Document"
                )}
              </Button>
            </CardFooter>
          </Card>

          {result.text && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Extracted Text</TabsTrigger>
                    <TabsTrigger value="analysis">NLP Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{result.text}</pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="analysis" className="mt-4">
                    {result.analysis ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Summary</h3>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{result.analysis.summary}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Key Points</h3>
                          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
                            {result.analysis.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Potential Issues</h3>
                          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
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
      </div>
    </section>
  )
}

