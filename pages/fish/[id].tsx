import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts"
import Layout from "@/components/Layout"

export default function FishProfile() {
  const router = useRouter()
  const { id } = router.query
  const [fish, setFish] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('weight')

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      fetch(`http://127.0.0.1:8000/fish`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch fish data")
          }
          return res.json()
        })
        .then(data => {
          const found = data.find((f: any) => f.id === parseInt(id as string))
          if (found) {
            setFish(found)
          } else {
            setError("Fish not found")
          }
          setIsLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setIsLoading(false)
        })
    }
  }, [id])

  if (isLoading) {
    return (
      <Layout title="Loading... | BamaBass Tracker">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-blue-400 h-32 w-32"></div>
            <div className="h-6 bg-blue-400 rounded w-48 mt-4"></div>
            <div className="h-4 bg-blue-400 rounded w-64 mt-4"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !fish) {
    return (
      <Layout title="Error | BamaBass Tracker">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error || "Fish not found"}</p>
            <button 
              onClick={() => router.push('/fish')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Fish Collection
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const sortedWeighIns = [...fish.weigh_ins].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Process data for charts
  const weightData = sortedWeighIns.map(w => ({
    date: new Date(w.date).toLocaleDateString(),
    weight: w.weight
  }))

  // Location frequency data
  const locationData: Record<string, number> = {}
  sortedWeighIns.forEach(w => {
    if (w.location) {
      locationData[w.location] = (locationData[w.location] || 0) + 1
    }
  })
  const locationChartData = Object.entries(locationData).map(([location, count]) => ({
    location,
    count
  }))

  // Bait frequency data
  const baitData: Record<string, number> = {}
  sortedWeighIns.forEach(w => {
    if (w.bait) {
      baitData[w.bait] = (baitData[w.bait] || 0) + 1
    }
  })
  const baitChartData = Object.entries(baitData).map(([bait, count]) => ({
    bait,
    count
  }))

  return (
    <Layout title={`${fish.name} | BamaBass Tracker`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fish profile header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{fish.name}</h1>
                <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  #{fish.id}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{fish.notes || "No notes yet."}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-blue-600">Total Weigh-Ins</p>
                <p className="text-xl font-bold">{sortedWeighIns.length}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-sm text-green-600">Max Weight</p>
                <p className="text-xl font-bold">
                  {Math.max(...sortedWeighIns.map(w => w.weight || 0))} lbs
                </p>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <p className="text-sm text-amber-600">Last Weigh-In</p>
                <p className="text-xl font-bold">
                  {sortedWeighIns.length > 0 
                    ? new Date(sortedWeighIns[sortedWeighIns.length - 1].date).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('weight')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'weight' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📈 Weight History
              </button>
              <button
                onClick={() => setActiveTab('locations')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'locations' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📍 Locations
              </button>
              <button
                onClick={() => setActiveTab('baits')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'baits' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🪱 Baits
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'history' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📝 Log History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'weight' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Weight History</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        name="Weight (lbs)" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'locations' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Location Frequency</h2>
                {locationChartData.length === 0 ? (
                  <p className="text-gray-500 text-center">No location data available</p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locationChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Frequency" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'baits' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Bait Frequency</h2>
                {baitChartData.length === 0 ? (
                  <p className="text-gray-500 text-center">No bait data available</p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={baitChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bait" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Frequency" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Weigh-In History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Length
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Girth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bait
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedWeighIns.map((entry, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {entry.weight} lbs
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {entry.length ? `${entry.length} in` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {entry.girth ? `${entry.girth} in` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {entry.location || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {entry.bait || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {sortedWeighIns.length === 0 && (
                  <p className="text-gray-500 text-center mt-4">No weigh-in history available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}