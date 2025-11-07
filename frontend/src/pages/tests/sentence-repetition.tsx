import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SENTENCES = [
  "I only know that John is the one to help today.",
  "The cat always hid under the couch when dogs were in the room."
]

export default function SentenceRepetition() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [userInputs, setUserInputs] = useState<string[]>(['', ''])
  const [showSentence, setShowSentence] = useState(true)

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

  const handleBeginTyping = () => {
    setShowSentence(false)
  }

  const handleInputChange = (value: string) => {
    // Prevent paste operations
    const newInputs = [...userInputs]
    newInputs[currentSentenceIndex] = value
    setUserInputs(newInputs)
  }

  const handleNextSentence = () => {
    if (currentSentenceIndex < SENTENCES.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1)
      setShowSentence(true)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/sentence-repetition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          sentences: userInputs
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Sentence Repetition Result:', result)
        router.push('/tests/verbal-fluency')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/verbal-fluency')
      }
      
    } catch (error) {
      console.error('Error submitting sentence repetition:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/verbal-fluency')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const currentSentence = SENTENCES[currentSentenceIndex]
  const isLastSentence = currentSentenceIndex === SENTENCES.length - 1

  return (
    <>
      <Head>
        <title>Sentence Repetition | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
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
                  <h1 className="text-2xl font-bold text-gray-900">Sentence Repetition</h1>
                  <p className="text-sm text-gray-600">Module 8 of 12</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📝</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sentence {currentSentenceIndex + 1} of {SENTENCES.length}
              </h2>
            </div>

            {showSentence ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-8 rounded-lg">
                  <p className="text-2xl text-gray-800 text-center font-medium leading-relaxed">
                    {currentSentence}
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Instructions:</strong> Read this sentence carefully. 
                    When you're ready, click "Begin Typing" to type it from memory. 
                    You can only see it once!
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleBeginTyping}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium"
                  >
                    Begin Typing
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    Type the sentence exactly as you remember it:
                  </p>
                </div>

                <textarea
                  value={userInputs[currentSentenceIndex]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onPaste={(e) => e.preventDefault()} // Prevent paste
                  onCopy={(e) => e.preventDefault()} // Prevent copy
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                  placeholder="Type the sentence here..."
                  autoFocus
                />

                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-sm text-red-800">
                    ⚠️ Copy and paste are disabled. You must type from memory.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowSentence(true)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    View Sentence Again
                  </button>
                  
                  {!isLastSentence ? (
                    <button
                      onClick={handleNextSentence}
                      disabled={!userInputs[currentSentenceIndex].trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Sentence
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !userInputs[currentSentenceIndex].trim()}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit & Continue'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
