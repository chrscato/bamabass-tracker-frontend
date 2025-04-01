import Dashboard from "@/components/Dashboard"
import Layout from "@/components/Layout"

export default function Home() {
  return (
    <Layout title="Dashboard | BamaBass Tracker">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 BamaBass Tracker Insights</h1>
        <Dashboard />
      </div>
    </Layout>
  )
}