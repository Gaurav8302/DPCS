import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Brain } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AttentionVigilance() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [currentLetter, setCurrentLetter] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [letters, setLetters] = useState<string[]>([])
  const [targetIndices, setTargetIndices] = useState<number[]>([])
  const [tappedThisLetter, setTappedThisLetter] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [testComplete, setTestComplete] = useState(false)
  
  // Use refs for accurate tracking during async loop
  const tapsRef = useRef<number[]>([])
  const lettersRef = useRef<string[]>([])
  const targetIndicesRef = useRef<number[]>([])
  
  // Final stats (calculated after test)
  const [correctTaps, setCorrectTaps] = useState(0)
  const [incorrectTaps, setIncorrectTaps] = useState(0)

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

  const generateLetterSequence = () => {
    const allLetters = 'BCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const sequence: string[] = []
    const aIndices: number[] = []
    
    // Create a 30-letter sequence
    for (let i = 0; i < 30; i++) {
      if (Math.random() < 0.15 && aIndices.length < 8) {
        sequence.push('A')
        aIndices.push(i)
      } else {
        const randomIndex = Math.floor(Math.random() * allLetters.length)
        sequence.push(allLetters[randomIndex])
      }
    }
    
    // Ensure at least 4 A's
    while (aIndices.length < 4) {
      const randomPos = Math.floor(Math.random() * sequence.length)
      if (sequence[randomPos] !== 'A') {
        sequence[randomPos] = 'A'
        aIndices.push(randomPos)
        aIndices.sort((a, b) => a - b)
      }
    }
    
    setLetters(sequence)
    setTargetIndices(aIndices)
    lettersRef.current = sequence
    targetIndicesRef.current = aIndices
    return { sequence, aIndices }
  }

  const startTest = async () => {
    setHasStarted(true)
    tapsRef.current = []
    setCorrectTaps(0)
    setIncorrectTaps(0)
    
    const { sequence, aIndices } = generateLetterSequence()
    
    // Countdown
    setShowCountdown(true)
    for (let i = 3; i > 0; i--) {
      setCountdown(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setShowCountdown(false)
    
    setIsRunning(true)
    
    // Show each letter for 2 seconds
    for (let i = 0; i < sequence.length; i++) {
      setCurrentIndex(i)
      setCurrentLetter(sequence[i])
      setTappedThisLetter(false)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    setCurrentLetter(null)
    setCurrentIndex(-1)
    setIsRunning(false)
    setTestComplete(true)
    
    // Calculate final stats from refs (accurate)
    const taps = tapsRef.current
    const correct = taps.filter(idx => sequence[idx] === 'A').length
    const incorrect = taps.filter(idx => sequence[idx] !== 'A').length
    
    setCorrectTaps(correct)
    setIncorrectTaps(incorrect)
  }

  const handleTap = () => {
    if (!isRunning || tappedThisLetter || currentIndex < 0) return
    
    // Record tap in ref for accurate tracking
    tapsRef.current.push(currentIndex)
    setTappedThisLetter(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    // Calculate total errors
    const missedAs = targetIndicesRef.current.filter(idx => !tapsRef.current.includes(idx)).length
    const totalErrors = missedAs + incorrectTaps
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/attention/vigilance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          taps: tapsRef.current,
          target_indices: targetIndicesRef.current,
          total_targets: targetIndicesRef.current.length
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Vigilance Attention Result:', result)
        router.push('/tests/attention-serial7')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/attention-serial7')
      }
      
    } catch (error) {
      console.error('Error submitting vigilance:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/attention-serial7')
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
        <title>Attention - Vigilance | MoCA Assessment</title>
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
              <h1 className="text-lg font-semibold text-gray-900">Attention - Vigilance</h1>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            
            {!hasStarted && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-5xl">👀</span>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Letter Vigilance Test
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    You will see a series of letters appear one at a time. 
                    Tap or click when you see the letter <strong className="text-purple-600">A</strong>.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg max-w-xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Instructions:</h3>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li>• Each letter appears for <strong>2 seconds</strong></li>
                    <li>• <strong>Tap once</strong> when you see the letter "A"</li>
                    <li>• You can only tap <strong>once per letter</strong></li>
                    <li>• Try NOT to tap on other letters</li>
                    <li>• Stay focused throughout the sequence</li>
                  </ul>
                </div>

                <button
                  onClick={startTest}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-lg font-medium"
                >
                  Start Test
                </button>
              </div>
            )}

            {showCountdown && (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">Get Ready...</p>
                <div className="text-9xl font-bold text-purple-600 animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {isRunning && (
              <div className="text-center py-8">
                {/* Large tappable area - neutral styling */}
                <button
                  onClick={handleTap}
                  disabled={tappedThisLetter}
                  className="w-full py-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 cursor-pointer select-none transition-colors"
                >
                  <div className="text-9xl font-bold text-gray-800">
                    {currentLetter}
                  </div>
                  <p className="text-gray-500 mt-8">
                    Tap when you see "A"
                  </p>
                </button>
                
                {/* Progress indicator only */}
                <div className="mt-6 text-sm text-gray-500">
                  Letter {currentIndex + 1} of {letters.length}
                </div>
              </div>
            )}

            {testComplete && (
              <div className="space-y-8 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-5xl">✓</span>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Test Complete!
                  </h2>
                </div>

                {/* Simple results - just correct and incorrect */}
                <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Results:</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Correct taps:</span>
                      <span className="font-medium">{correctTaps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incorrect taps:</span>
                      <span className="font-medium">{incorrectTaps}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setHasStarted(false)
                      setTestComplete(false)
                      tapsRef.current = []
                      setCorrectTaps(0)
                      setIncorrectTaps(0)
                      setLetters([])
                      setTargetIndices([])
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Retry Test
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit & Continue'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
