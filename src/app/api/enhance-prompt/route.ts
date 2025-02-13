import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get("prompt")

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://dark.anonbd-info.workers.dev/?prompt=${encodeURIComponent(prompt)}`)
    const enhancedPrompt = await response.text()

    return NextResponse.json({ enhancedPrompt: enhancedPrompt.trim() })
  } catch (error) {
    console.error("Error enhancing prompt:", error)
    return NextResponse.json({ error: "Failed to enhance prompt" }, { status: 500 })
  }
}

