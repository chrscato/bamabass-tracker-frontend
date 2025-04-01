import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"]

export default function Dashboard() {
  const [fishData, setFishData] = useState<Fish[]>([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/fish")
      .then(res => res.json())
      .then(data => setFishData(data))
  }, [])

  // 🏆 Heaviest Fish
  const topWeights = fishData.map(f => {
    const max = Math.max(...f.weigh_ins.map(w => w.weight || 0))
    return { name: f.name, weight: max }
  }).sort((a, b) => b.weight - a.weight).slice(0, 5)

  // 📍 Most Popular Locations
  const locationCounts: Record<string, number> = {}
  fishData.forEach(f => {
    f.weigh_ins.forEach(w => {
      if (w.location) locationCounts[w.location] = (locationCounts[w.location] || 0) + 1
    })
  })
  const topLocations = Object.entries(locationCounts).map(([loc, count]) => ({
    name: loc,
    count
  }))

  // 🪱 Top Baits
  const baitCounts: Record<string, number> = {}
  fishData.forEach(f => {
    f.weigh_ins.forEach(w => {
      if (w.bait) baitCounts[w.bait] = (baitCounts[w.bait] || 0) + 1
    })
  })
  const topBaits = Object.entries(baitCounts).map(([bait, count]) => ({
    name: bait,
    count
  }))

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎣 Fish Tracker Dashboard</h2>

      {/* 🏆 Heaviest Fish */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">🏆 Heaviest Fish (Top 5)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topWeights}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="weight" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📍 Most Popular Locations */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">📍 Most Popular Locations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="count"
              data={topLocations}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {topLocations.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🪱 Top Baits */}
      <div>
        <h3 className="text-lg font-semibold mb-2">🪱 Top Baits Used</h3>
        <ResponsiveContainer width="100%" height={300}>
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
  )
}
