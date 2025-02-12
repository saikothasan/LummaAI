import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} LummaAI. All rights reserved.
        </p>
        <nav className="flex gap-4 mt-4 sm:mt-0">
          <Link
            href="/privacy"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  )
}

