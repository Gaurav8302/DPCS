import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Orientation() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    date: '',
    month: '',
    year: '',
    day: '',
    city: ''
  })

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('session_id')
    const storedUserId = sessionStorage.getItem('user_id')
    
    if (!storedSessionId || !storedUserId) {
      router.push('/consent')
      return
    }
    
    setSessionId(storedSessionId)
    setUserId(storedUserId)
    
    // DO NOT pre-fill - user must enter manually
    // Backend will verify against system time/GPS
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Get user's location coordinates for backend verification (not for auto-fill)
  const getUserLocation = async () => {
    return new Promise<{latitude: number, longitude: number} | null>((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => resolve(null)
      )
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Get user's GPS coordinates for backend verification (optional)
      const location = await getUserLocation()
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/orientation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          user_date: parseInt(formData.date),
          user_month: parseInt(formData.month),
          user_year: parseInt(formData.year),
          user_day: formData.day,
          user_city: formData.city,
          gps_latitude: location?.latitude,
          gps_longitude: location?.longitude
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Orientation Result:', result)
        // This is the last test - redirect to results
        router.push('/dashboard')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to dashboard...`)
        router.push('/dashboard')
      }
      
    } catch (error) {
      console.error('Error submitting orientation:', error)
      alert('Unable to connect to server. Proceeding to dashboard...')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Orientation | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/assessment')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Orientation</h1>
                  <p className="text-sm text-gray-600">Module 12 of 12 - Final Test!</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📍</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Time and Place Orientation
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Please answer the following questions about today's date and your location. 
                <strong className="text-teal-600"> Enter all information manually from memory.</strong>
              </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is today's date? (day of month, 1-31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-lg"
                  placeholder="e.g., 15"
                />
              </div>

              {/* Month */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is the current month? (1-12)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-lg"
                  placeholder="e.g., 3 for March"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is the current year?
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-lg"
                  placeholder="e.g., 2024"
                />
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What day of the week is it?
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-lg"
                >
                  <option value="">Select a day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What city are you in right now?
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-lg"
                  placeholder="Type your city name"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the name of the city you are currently in
                </p>
              </div>
            </div>

            <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4 max-w-xl mx-auto">
              <p className="text-sm text-green-800">
                🎉 <strong>Almost done!</strong> This is the final module. After submitting, 
                you'll see your complete assessment results.
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => router.push('/assessment')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Modules
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.date || !formData.month || !formData.year || !formData.day || !formData.city}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Complete Assessment'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
