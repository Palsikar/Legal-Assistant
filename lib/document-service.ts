export async function analyzeDocument(file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to analyze document")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in document service:", error)
    throw error
  }
}

