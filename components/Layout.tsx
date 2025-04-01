import Navbar from "@/components/Navbar"
import Head from "next/head"

type LayoutProps = {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title = "BamaBass Tracker" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Track your fishing statistics with BamaBass Tracker" />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-blue-700 text-white text-center py-4 mt-8">
          <p className="text-sm">© {new Date().getFullYear()} BamaBass Tracker</p>
        </footer>
      </div>
    </>
  )
}