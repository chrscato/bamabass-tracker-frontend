import { useState } from 'react'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [fishName, setFishName] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const addFish = async () => {
    const formData = new FormData()
    formData.append('name', fishName)
    formData.append('notes', notes)
    formData.append('password', password)

    const res = await fetch('http://127.0.0.1:8000/admin/add_fish', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    setMessage(data.status || data.detail)
  }

  const uploadCSV = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', password)

    const res = await fetch('http://127.0.0.1:8000/admin/upload_csv', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    setMessage(data.status || data.detail)
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🔐 Admin Panel</h1>

      <label className="block text-sm font-medium">Admin Password</label>
      <input className="border p-2 w-full mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div className="border p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Add a New Fish</h2>
        <input className="border p-2 w-full mb-2" placeholder="Fish Name" value={fishName} onChange={(e) => setFishName(e.target.value)} />
        <textarea className="border p-2 w-full mb-2" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addFish}>Add Fish</button>
      </div>

      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Upload Weigh-In CSV</h2>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded" onClick={uploadCSV}>Upload</button>
      </div>

      {message && <p className="mt-4 text-blue-700 font-medium">{message}</p>}
    </div>
  )
}
