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
      <div className="bg-white hover:bg-gray-50 shadow-sm border rounded-lg p-4 w-full mb-4 cursor-pointer transition">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-gray-600">{notes || "No notes yet"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-right">
            <div><strong>🏋️ Max:</strong> {maxWeight} lbs</div>
            <div><strong>📆 Weigh-Ins:</strong> {totalWeighIns}</div>
            {favoriteBait && <div><strong>🪱 Bait:</strong> {favoriteBait}</div>}
            {favoriteLocation && <div><strong>📍 Location:</strong> {favoriteLocation}</div>}
          </div>
        </div>
      </div>
    </Link>
  )
}
