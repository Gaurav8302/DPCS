import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Brain } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// PRD-specified word pairs (Section 3.6)
const WORD_PAIRS = [
  { 
    pair: ['hammer', 'screwdriver'], 
    question: 'How are a HAMMER and a SCREWDRIVER alike?',
    hint: 'Think about what category they belong to'
  },
  { 
    pair: ['matches', 'lamp'], 
    question: 'How are MATCHES and a LAMP alike?',
    hint: 'Think about what they both provide'
  }
]

export default function Abstraction() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<string[]>(['', ''])

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('session_id')
    const storedUserId = sessionStorage.getItem('user_id')
    
    if (!storedSessionId || !storedUserId) {
      router.push('/consent')
      return
    }
    
    setSessionId(storedSessionId)
    setUserId(storedUserId)
  }, [router])

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses]
    newResponses[index] = value
    setResponses(newResponses)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/abstraction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          responses: responses
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Abstraction Result:', result)
        router.push('/tests/delayed-recall')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/delayed-recall')
      }
      
    } catch (error) {
      console.error('Error submitting abstraction:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/delayed-recall')
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
        <title>Abstraction | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">MoCA Digital</span>
            </div>
            <div className="ml-auto">
              <h1 className="text-lg font-semibold text-gray-900">Abstraction</h1>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🧩</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Similarity Test
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tell me how the following pairs of items are alike. What do they have in common?
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8 max-w-xl mx-auto">
              <h3 className="font-semibold text-gray-900 mb-2">Example:</h3>
              <p className="text-gray-700">
                <strong>Question:</strong> "How are an apple and a pear alike?"
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Good answer:</strong> "They are both <strong>fruits</strong>" (the category they belong to)
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Note: "They are both round" or "They are both edible" would not be the best answers.
              </p>
            </div>

            <div className="space-y-8">
              {WORD_PAIRS.map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Question {index + 1}:
                    </p>
                    <p className="text-xl text-gray-800 mb-2">
                      {item.question}
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      💡 {item.hint}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your answer:
                    </label>
                    <input
                      type="text"
                      value={responses[index]}
                      onChange={(e) => handleResponseChange(index, e.target.value)}
                      placeholder="Enter what they have in common..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Think about the category or characteristic that both items share.
                For example: tools, lighting, vehicles, etc.
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setResponses(['', ''])}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear Answers
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || responses.some(r => !r.trim())}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit & Continue'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
