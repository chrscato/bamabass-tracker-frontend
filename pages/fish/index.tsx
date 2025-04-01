import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import FishCard from "@/components/FishCard"

export default function FishDirectory() {
  const [fishData, setFishData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
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
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  const calculateFavorite = (arr: string[]) => {
    const count: Record<string, number> = {}
    arr.forEach(val => {
      if (!val) return
      count[val] = (count[val] || 0) + 1
    })
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0]
  }

  return (
    <Layout title="Fish Collection | BamaBass Tracker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🐟 Fish Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View your entire collection of tracked fish. Click on any card to see detailed weight history and more statistics.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-blue-400 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-blue-400 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-blue-400 rounded"></div>
                  <div className="h-4 bg-blue-400 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>Error: {error}</p>
            <p>Make sure your API server is running at http://127.0.0.1:8000</p>
          </div>
        ) : (
          <>
            {fishData.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-lg text-gray-600">No fish found. Add some fish in the Admin panel.</p>
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Go to Admin
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fishData.map(fish => {
                  const weighIns = fish.weigh_ins || []
                  const maxWeight = Math.max(...weighIns.map(w => w.weight || 0))
                  const baitList = weighIns.map(w => w.bait)
                  const locationList = weighIns.map(w => w.location)

                  return (
                    <FishCard
                      key={fish.id}
                      id={fish.id}
                      name={fish.name}
                      notes={fish.notes}
                      maxWeight={maxWeight}
                      totalWeighIns={weighIns.length}
                      favoriteBait={calculateFavorite(baitList)}
                      favoriteLocation={calculateFavorite(locationList)}
                    />
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}