"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Copy, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const generateImage = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/generate-image?prompt=${encodeURIComponent(prompt)}`)
      const data = await response.json()
      if (data.url) {
        setImageUrl(data.url)
      } else {
        setError(data.error || "Failed to generate image")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error generating image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyImageUrl = () => {
    navigator.clipboard.writeText(imageUrl)
    toast({
      title: "Copied!",
      description: "Image URL has been copied to clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">AI Image Generator</h1>
        <Card>
          <CardHeader>
            <CardTitle>Generate Your Image</CardTitle>
            <CardDescription>Enter a prompt to generate an AI image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter your prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button onClick={generateImage} disabled={isLoading || !prompt}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Generating..." : "Generate"}
                </Button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {imageUrl && (
                <div className="space-y-4">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt="Generated image"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <Button onClick={copyImageUrl} className="w-full">
                    <Copy className="mr-2 h-4 w-4" /> Copy Image URL
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Images are generated using AI. Results may vary.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

