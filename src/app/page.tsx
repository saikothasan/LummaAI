"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Copy, Download, Sparkles, Zap, Wand2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface GenerateImageResponse {
  url?: string
  error?: string
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    } else {
      setTimer(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const enhancePrompt = async () => {
    if (!prompt) return

    setIsEnhancing(true)
    setError(null)
    try {
      const response = await fetch(`/api/enhance-prompt?prompt=${encodeURIComponent(prompt)}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data: unknown = await response.json()

      if (typeof data === "object" && data !== null) {
        if ("enhancedPrompt" in data && typeof data.enhancedPrompt === "string") {
          setPrompt(data.enhancedPrompt)
          toast({
            title: "Prompt Enhanced",
            description: "Your prompt has been enhanced for better results.",
          })
        } else if ("error" in data && typeof data.error === "string") {
          throw new Error(data.error)
        } else {
          throw new Error("Unexpected response format from server")
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      setError(`Failed to enhance prompt: ${(error as Error).message}`)
      console.error("Error enhancing prompt:", error)
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  const generateImage = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/generate-image?prompt=${encodeURIComponent(prompt)}`)
      const data: GenerateImageResponse = await response.json()
      if (data.url) {
        setImageUrl(data.url)
      } else {
        setError(data.error || "Failed to generate image")
      }
    } catch (error) {
      setError((error as Error).message || "An unexpected error occurred")
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

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "lumma-ai-generated-image.png"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "Downloaded!",
        description: "Image has been downloaded successfully.",
      })
    } catch (error: unknown) {
      console.error("Error downloading image:", error)
      toast({
        title: "Error",
        description: "Failed to download the image.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <div className="bg-purple-700 dark:bg-purple-900 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Try our Telegram bot:{" "}
            <a
              href="https://t.me/DreamPixelBot"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-purple-200"
            >
              @DreamPixelBot
            </a>
          </p>
        </div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl font-bold text-center">Generate Your AI Image</CardTitle>
              <CardDescription className="text-center text-purple-100">
                Enter a prompt to create stunning AI-generated images
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter your prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={enhancePrompt}
                        disabled={isEnhancing || !prompt}
                        className="h-8 w-8"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 text-purple-500" />
                        )}
                      </Button>
                      <Sparkles className="h-4 w-4 text-purple-500 self-center" />
                    </div>
                  </div>
                  <Button
                    onClick={generateImage}
                    disabled={isLoading || !prompt}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <AnimatePresence mode="wait">
                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">Generating Image...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time elapsed: {timer} seconds</p>
                    </motion.div>
                  )}
                  {imageUrl && !isLoading && (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="space-y-4"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt="AI-generated image"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={copyImageUrl}
                          className="flex-1 bg-purple-500 hover:bg-purple-600"
                          variant="secondary"
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy URL
                        </Button>
                        <Button
                          onClick={downloadImage}
                          className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                          variant="secondary"
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4">Why Choose LummaAI?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">Cutting-Edge AI</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Powered by state-of-the-art machine learning models for high-quality image generation.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">User-Friendly</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Simple and intuitive interface makes it easy for anyone to create stunning images.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  Versatile Applications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Perfect for artists, designers, marketers, and anyone looking to enhance their visual content.
                </p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

