import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const ANIMALS = [
  { id: 'lion', name: 'Lion', image: '/assets/animals/lion.jpg' },
  { id: 'elephant', name: 'Elephant', image: '/assets/animals/elephant.jpg' },
  { id: 'rhinoceros', name: 'Rhinoceros', image: '/assets/animals/rhinoceros.jpg' },
  { id: 'camel', name: 'Camel', image: '/assets/animals/camel.jpg' },
  { id: 'giraffe', name: 'Giraffe', image: '/assets/animals/giraffe.jpg' },
  { id: 'zebra', name: 'Zebra', image: '/assets/animals/zebra.jpg' }
]

export default function NamingTest() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<typeof ANIMALS>([])
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('user_id')
    const storedSessionId = sessionStorage.getItem('session_id')
    
    if (!storedUserId) {
      router.push('/consent')
      return
    }
    
    setUserId(storedUserId)
    setSessionId(storedSessionId)
    
    // Randomize 3 animals
    const shuffled = [...ANIMALS].sort(() => 0.5 - Math.random())
    setSelectedAnimals(shuffled.slice(0, 3))
  }, [])

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (!userId || !sessionId) return
    if (answers.some(a => !a.trim())) {
      alert('Please answer all questions')
      return
    }

    setSubmitting(true)

    try {
      const responses = selectedAnimals.map((animal, index) => ({
        animal: animal.name.toLowerCase(),
        user_answer: answers[index].trim()
      }))

      const response = await fetch(`${apiUrl}/api/score/naming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          responses
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Naming Result:', result)
        alert(`Score: ${result.score}/3`)
        router.push('/tests/attention-forward')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/attention-forward')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/attention-forward')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Naming Test - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Naming Test
            </h1>
            <p className="text-gray-600">
              Name the animals shown in the images below
            </p>
          </div>

          <div className="space-y-6">
            {selectedAnimals.map((animal, index) => (
              <div key={animal.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🦁</span>
                      {/* Placeholder - replace with actual images */}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Animal #{index + 1}
                    </h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What animal is this?
                    </label>
                    <input
                      type="text"
                      value={answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Type the animal name..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
