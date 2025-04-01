import { useState } from 'react'
import Layout from '@/components/Layout'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [fishName, setFishName] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addFish = async () => {
    if (!password) {
      setMessage('Please enter the admin password')
      setMessageType('error')
      return
    }
    
    if (!fishName) {
      setMessage('Please enter a fish name')
      setMessageType('error')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('name', fishName)
      formData.append('notes', notes)
      formData.append('password', password)

      const res = await fetch('http://127.0.0.1:8000/admin/add_fish', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage(data.status || 'Fish added successfully!')
        setMessageType('success')
        setFishName('')
        setNotes('')
      } else {
        setMessage(data.detail || 'Error adding fish')
        setMessageType('error')
      }
    } catch (err) {
      setMessage('Error connecting to server. Make sure your API is running.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const uploadCSV = async () => {
    if (!file) {
      setMessage('Please select a file to upload')
      setMessageType('error')
      return
    }
    
    if (!password) {
      setMessage('Please enter the admin password')
      setMessageType('error')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)

      const res = await fetch('http://127.0.0.1:8000/admin/upload_csv', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage(data.status || 'CSV uploaded successfully!')
        setMessageType('success')
        setFile(null)
      } else {
        setMessage(data.detail || 'Error uploading CSV')
        setMessageType('error')
      }
    } catch (err) {
      setMessage('Error connecting to server. Make sure your API is running.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout title="Admin | BamaBass Tracker">
      <div className="bg-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-blue-900">Admin Panel</h1>
          <p className="mt-2 text-blue-800">Manage your fish collection and data</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="px-6 py-5 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Admin Authentication
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter the admin password to manage fish records
              </p>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input 
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter admin password"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="px-6 py-5 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Add a New Fish
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new fish record in your collection
              </p>
            </div>
          </div>
          
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fish Name
              </label>
              <input 
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter fish name" 
                value={fishName} 
                onChange={(e) => setFishName(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea 
                className="border border-gray-300 rounded-md px-3 py-2 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Add optional notes about this fish" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
            
            <div>
              <button 
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`} 
                onClick={addFish}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Fish'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6 py-5 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Upload Weigh-In CSV
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Upload CSV files with weigh-in data
              </p>
            </div>
          </div>
          
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV File
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".csv"
                />
                {file && (
                  <span className="ml-2 text-sm text-gray-500">{file.name}</span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                CSV should contain columns for fish_id, date, weight, and optionally length, girth, location, and bait
              </p>
            </div>
            
            <div>
              <button 
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isSubmitting 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`} 
                onClick={uploadCSV}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Uploading...' : 'Upload CSV'}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">CSV Format Example</h3>
            <div className="bg-white p-2 rounded border border-gray-200 font-mono text-xs overflow-x-auto">
              <p>fish_id,date,weight,length,girth,location,bait</p>
              <p>1,2023-04-01,4.5,18,9,Lake Martin,Worm</p>
              <p>2,2023-04-02,3.2,15,8,Smith Lake,Minnow</p>
              <p>1,2023-04-03,4.8,18.5,9.5,Lake Martin,Crankbait</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}