import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const WORD_PAIRS = [
  { pair: ['banana', 'orange'], similarity: 'fruit' },
  { pair: ['train', 'bicycle'], similarity: 'transportation' }
]

export default function Abstraction() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<string[]>(['', ''])

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

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com'
      const response = await fetch(`${apiUrl}/api/score/abstraction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          responses: answers
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit abstraction test')
      }
      
      router.push('/tests/delayed-recall')
      
    } catch (error) {
      console.error('Error submitting abstraction:', error)
      alert('Failed to submit test. Please try again.')
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

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
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
                  <h1 className="text-2xl font-bold text-gray-900">Abstraction</h1>
                  <p className="text-sm text-gray-600">Module 10 of 12</p>
                </div>
              </div>
            </div>
          </div>
        </header>

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
                <strong>Good answer:</strong> "They are both fruits" or "They are both food"
              </p>
            </div>

            <div className="space-y-8">
              {WORD_PAIRS.map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Question {index + 1}:
                    </p>
                    <p className="text-xl text-gray-800">
                      How are a <strong className="text-indigo-600">{item.pair[0]}</strong> and a{' '}
                      <strong className="text-indigo-600">{item.pair[1]}</strong> alike?
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your answer:
                    </label>
                    <input
                      type="text"
                      value={answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Think about the category or characteristic that both items share.
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setAnswers(['', ''])}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear Answers
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || answers.some(a => !a.trim())}
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
