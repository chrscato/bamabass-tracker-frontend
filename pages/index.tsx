import Dashboard from "@/components/Dashboard"

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center py-6">📊 BamaBass Tracker Insights</h1>
        <Dashboard />
      </div>
    </div>
  )
}
