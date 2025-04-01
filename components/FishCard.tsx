import Link from "next/link"

type FishCardProps = {
  id: number
  name: string
  notes?: string
  maxWeight: number
  totalWeighIns: number
  favoriteBait?: string
  favoriteLocation?: string
}

export default function FishCard({
  id,
  name,
  notes,
  maxWeight,
  totalWeighIns,
  favoriteBait,
  favoriteLocation,
}: FishCardProps) {
  return (
    <Link href={`/fish/${id}`}>
      <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg cursor-pointer transition">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">#{id}</span>
        </div>

        <div className="text-sm text-gray-600 mb-2">{notes || "No notes yet"}</div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>🏋️ Max Weight:</strong> {maxWeight} lbs</div>
          <div><strong>📆 Weigh-Ins:</strong> {totalWeighIns}</div>
          {favoriteBait && <div><strong>🪱 Favorite Bait:</strong> {favoriteBait}</div>}
          {favoriteLocation && <div><strong>📍 Location:</strong> {favoriteLocation}</div>}
        </div>
      </div>
    </Link>
  )
}
