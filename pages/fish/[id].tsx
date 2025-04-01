import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function FishProfile() {
  const router = useRouter()
  const { id } = router.query
  const [fish, setFish] = useState<any>(null)

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/fish`)
        .then(res => res.json())
        .then(data => {
          const found = data.find((f: any) => f.id === parseInt(id as string))
          setFish(found)
        })
    }
  }, [id])

  if (!fish) return <p className="p-4">Loading fish data...</p>

  const sortedWeighIns = [...fish.weigh_ins].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{fish.name}</h1>
      <p className="text-gray-600 mb-4">{fish.notes || "No notes yet."}</p>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">📈 Weight History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedWeighIns.map(w => ({
            date: new Date(w.date).toLocaleDateString(),
            weight: w.weight
          }))}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {sortedWeighIns.map((w, i) => (
          <div key={i} className="border rounded p-3 bg-white shadow-sm">
            <p><strong>📆 Date:</strong> {new Date(w.date).toLocaleDateString()}</p>
            <p><strong>🏋️ Weight:</strong> {w.weight} lbs</p>
            {w.length && <p><strong>📏 Length:</strong> {w.length} in</p>}
            {w.girth && <p><strong>📐 Girth:</strong> {w.girth} in</p>}
            {w.location && <p><strong>📍 Location:</strong> {w.location}</p>}
            {w.bait && <p><strong>🪱 Bait:</strong> {w.bait}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
