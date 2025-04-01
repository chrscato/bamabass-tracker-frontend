import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts"

type Fish = {
  id: number
  name: string
  weigh_ins: {
    date: string
    weight: number
    location?: string
    bait?: string
  }[]
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"]

export default function Dashboard() {
  const [fishData, setFishData] = useState<Fish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/fish")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch fish data")
        }
        return res.json()
      })
      .then(data => {
        setFishData(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Error fetching data:", err)
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  // 🏆 Heaviest Fish
  const topWeights = fishData
    .map(f => {
      const max = Math.max(...f.weigh_ins.map(w => w.weight || 0))
      return { name: f.name, weight: max }
    })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)

  // 📍 Most Popular Locations
  const locationCounts: Record<string, number> = {}
  fishData.forEach(f => {
    f.weigh_ins.forEach(w => {
      if (w.location) locationCounts[w.location] = (locationCounts[w.location] || 0) + 1
    })
  })
  const topLocations = Object.entries(locationCounts)
    .map(([loc, count]) => ({ name: loc, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 🪱 Top Baits
  const baitCounts: Record<string, number> = {}
  fishData.forEach(f => {
    f.weigh_ins.forEach(w => {
      if (w.bait) baitCounts[w.bait] = (baitCounts[w.bait] || 0) + 1
    })
  })
  const topBaits = Object.entries(baitCounts)
    .map(([bait, count]) => ({ name: bait, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p>Error: {error}</p>
        <p>Make sure your API server is running at http://127.0.0.1:8000</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🏆 Heaviest Fish */}
        <div className="bg-white shadow rounded-lg p-4 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🏆 Heaviest Fish (Top 5)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWeights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit=" lbs" />
                <Tooltip formatter={(value) => [`${value} lbs`, 'Weight']} />
                <Bar dataKey="weight" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📍 Most Popular Locations */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">📍 Popular Locations</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="count"
                  data={topLocations}
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {topLocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🪱 Top Baits */}
        <div className="bg-white shadow rounded-lg p-4 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">🪱 Top Baits Used</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBaits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}