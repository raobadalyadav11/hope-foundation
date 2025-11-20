"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const isDev = process.env.NODE_ENV === "development"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center space-y-6 p-8">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-600 text-4xl">⚠️</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Something went wrong!
          </h1>
          <p className="text-gray-600 max-w-md">
            We apologize for the inconvenience. An unexpected error occurred. 
            Our team has been notified and is working to fix this issue.
          </p>
        </div>

        {isDev && (
          <details className="bg-white p-4 rounded-lg border border-gray-200 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-all">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Try again
          </button>
          
          <div className="text-sm text-gray-500">
            If the problem persists, please contact us at{' '}
            <a 
              href="mailto:support@hopefoundation.org" 
              className="text-blue-600 hover:text-blue-500 underline"
            >
              support@hopefoundation.org
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}