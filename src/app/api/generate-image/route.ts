import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface GenerateImageResponse {
  url?: string
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  const searchParams = request.nextUrl.searchParams
  const prompt = searchParams.get('prompt')

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://ai.xvipp.workers.dev/?prompt=${encodeURIComponent(prompt)}`)
    const data = await response.json()

    if (data.url) {
      return NextResponse.json({ url: data.url })
    } else {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
