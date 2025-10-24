import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Mic, MicOff } from 'lucide-react'

export default function VerbalFluency() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [words, setWords] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState('')
  const [hasStarted, setHasStarted] = useState(false)

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

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRecording(false)
    }
    
    return () => clearInterval(timer)
  }, [isRecording, timeLeft])

  const startTest = () => {
    setHasStarted(true)
    setIsRecording(true)
    setTimeLeft(60)
    setWords([])
    setCurrentWord('')
  }

  const handleAddWord = () => {
    if (currentWord.trim() && currentWord.toLowerCase().startsWith('f')) {
      setWords(prev => [...prev, currentWord.trim()])
      setCurrentWord('')
    } else if (currentWord.trim()) {
      alert('Words must start with the letter F!')
      setCurrentWord('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddWord()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scoring/verbal-fluency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          words: words
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit verbal fluency')
      }
      
      router.push('/tests/abstraction')
      
    } catch (error) {
      console.error('Error submitting verbal fluency:', error)
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
        <title>Verbal Fluency | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
                  <h1 className="text-2xl font-bold text-gray-900">Verbal Fluency</h1>
                  <p className="text-sm text-gray-600">Module 9 of 12</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            
            {!hasStarted && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-5xl">💬</span>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Letter F Verbal Fluency
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    You have <strong>60 seconds</strong> to type as many words as possible 
                    that start with the letter <strong className="text-orange-600">F</strong>.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg max-w-xl mx-auto text-left">
                  <h3 className="font-semibold text-gray-900 mb-3">Rules:</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Words must start with the letter F</li>
                    <li>• No proper nouns (names, places, brands)</li>
                    <li>• No numbers or variations of the same word</li>
                    <li>• Press Enter after each word</li>
                  </ul>
                </div>

                <button
                  onClick={startTest}
                  className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-lg font-medium"
                >
                  Start Test
                </button>
              </div>
            )}

            {hasStarted && (
              <div className="space-y-6">
                {/* Timer */}
                <div className="text-center">
                  <div className={`text-6xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                    {timeLeft}s
                  </div>
                  <p className="text-gray-600 mt-2">
                    {isRecording ? 'Time remaining' : 'Time is up!'}
                  </p>
                </div>

                {/* Word Input */}
                {isRecording && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentWord}
                        onChange={(e) => setCurrentWord(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a word starting with F..."
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-lg"
                        autoFocus
                      />
                      <button
                        onClick={handleAddWord}
                        disabled={!currentWord.trim()}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Press Enter or click Add after each word
                    </p>
                  </div>
                )}

                {/* Word Count */}
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700">{words.length}</p>
                  <p className="text-gray-600">Words recorded</p>
                </div>

                {/* Word List */}
                {words.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <h3 className="font-semibold text-gray-900 mb-2">Your words:</h3>
                    <div className="flex flex-wrap gap-2">
                      {words.map((word, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button (appears when time is up) */}
                {!isRecording && (
                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={() => {
                        setHasStarted(false)
                        setWords([])
                        setCurrentWord('')
                        setTimeLeft(60)
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit & Continue'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
