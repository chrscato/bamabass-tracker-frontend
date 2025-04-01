import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`)
  }

  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">🎣 BamaBass Tracker</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/fish"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/fish") 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              Fish Collection
            </Link>
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin") 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/fish"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/fish") 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              Fish Collection
            </Link>
            <Link
              href="/admin"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin") 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-600"
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}