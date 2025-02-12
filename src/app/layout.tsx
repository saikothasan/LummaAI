import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LummaAI - AI-Powered Image Generation",
  description:
    "Create stunning, unique images with the power of AI. LummaAI offers cutting-edge image generation for artists, designers, and creatives.",
  keywords: "AI, image generation, artificial intelligence, creative tools, digital art",
  openGraph: {
    title: "LummaAI - AI-Powered Image Generation",
    description:
      "Create stunning, unique images with the power of AI. LummaAI offers cutting-edge image generation for artists, designers, and creatives.",
    images: [
      {
        url: "https://lummaai.pages.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LummaAI - AI-Powered Image Generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LummaAI - AI-Powered Image Generation",
    description:
      "Create stunning, unique images with the power of AI. LummaAI offers cutting-edge image generation for artists, designers, and creatives.",
    images: ["https://lummaai.pages.dev/twitter-image.jpg"],
  },
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

