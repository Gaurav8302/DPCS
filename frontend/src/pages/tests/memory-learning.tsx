import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Brain } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// PRD-specified words for memory test (Section 3.3)
const MEMORY_WORDS = ['LEG', 'COTTON', 'SCHOOL', 'TOMATO', 'WHITE']

export default function MemoryLearning() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [words, setWords] = useState<string[]>(MEMORY_WORDS)
  const [countdown, setCountdown] = useState(30)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('session_id')
    const storedUserId = sessionStorage.getItem('user_id')
    
    if (!storedSessionId || !storedUserId) {
      router.push('/consent')
      return
    }
    
    setSessionId(storedSessionId)
    setUserId(storedUserId)
    
    // Store words in sessionStorage for later recall
    sessionStorage.setItem('memory_words', JSON.stringify(words))
  }, [router])

  useEffect(() => {
    if (isStarted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      handleContinue()
    }
  }, [isStarted, countdown])

  const startLearning = () => {
    setIsStarted(true)
  }

  const handleContinue = () => {
    // Store that learning phase is completed
    sessionStorage.setItem('memory_learning_completed', 'true')
    // Navigate to next test (trail making or wherever appropriate in flow)
    router.push('/tests/trail-making')
  }

  if (!sessionId) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Memory Learning | MoCA Assessment</title>
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
              <h1 className="text-lg font-semibold text-gray-900">Memory Learning</h1>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!isStarted ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Memory Learning Phase
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  You will be shown 5 words to memorize. Try to remember them as you'll be asked to recall them later in the assessment.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg mb-8 max-w-xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Instructions:</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• You will have 30 seconds to study these words</li>
                  <li>• Read them carefully and try to memorize them</li>
                  <li>• You will be asked to recall these words later</li>
                  <li>• Use any memorization technique that works for you</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startLearning}
                  className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors"
                >
                  Start Learning
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Memorize These Words
                </h2>
                
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6 inline-block">
                  <p className="text-xl font-semibold text-gray-800">
                    Time Remaining: <span className="text-3xl text-purple-600">{countdown}s</span>
                  </p>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                {words.map((word, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-2 border-purple-300 shadow-md"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-700 mr-4">
                        {index + 1}.
                      </span>
                      <span className="text-4xl font-bold text-gray-900 uppercase tracking-wider">
                        {word}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-indigo-50 p-4 rounded-lg max-w-xl mx-auto">
                <p className="text-center text-gray-700">
                  💡 <strong>Tip:</strong> Try creating a story or mental image connecting these words
                </p>
              </div>

              {countdown <= 5 && (
                <div className="mt-6 text-center">
                  <p className="text-red-600 font-semibold animate-pulse">
                    Almost done! Keep memorizing...
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
