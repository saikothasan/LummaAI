import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, Github } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="transition-transform duration-300 group-hover:rotate-180">
            <Logo />
          </div>
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">LummaAI</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300">
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/yourusername/lumma-ai" target="_blank" rel="noopener noreferrer">
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

