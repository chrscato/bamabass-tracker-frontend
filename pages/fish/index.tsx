import { useEffect, useState } from "react"
import FishCard from "@/components/FishCard"

export default function FishDirectory() {
  const [fishData, setFishData] = useState<any[]>([])

  useEffect(() => {
    fetch("http://127.0.0.1:8000/fish")
      .then(res => res.json())
      .then(data => setFishData(data))
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🐟 Meet the Fish</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  )
}
