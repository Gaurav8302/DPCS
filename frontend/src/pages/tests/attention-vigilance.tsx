import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'

export default function AttentionVigilance() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentLetter, setCurrentLetter] = useState<string | null>(null)
  const [letters, setLetters] = useState<string[]>([])
  const [targetCount, setTargetCount] = useState(0)
  const [userTaps, setUserTaps] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

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
    // Generate a sequence of random letters with target letter 'A' appearing randomly
    const allLetters = 'BCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const sequence: string[] = []
    let aCount = 0
    
    // Create a 60-letter sequence with approximately 5-8 'A's
    for (let i = 0; i < 60; i++) {
      if (Math.random() < 0.12 && aCount < 8) {
        sequence.push('A')
        aCount++
      } else {
        const randomIndex = Math.floor(Math.random() * allLetters.length)
        sequence.push(allLetters[randomIndex])
      }
    }
    
    setLetters(sequence)
    setTargetCount(aCount)
    return sequence
  }

  const startTest = async () => {
    setHasStarted(true)
    setIsRunning(true)
    const sequence = generateLetterSequence()
    
    // Show each letter for 1 second
    for (let i = 0; i < sequence.length; i++) {
      setCurrentLetter(sequence[i])
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setCurrentLetter(null)
    setIsRunning(false)
  }

  const handleTap = () => {
    if (isRunning && currentLetter === 'A') {
      setUserTaps(prev => prev + 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com')}/scoring/attention-vigilance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          expected_taps: targetCount,
          actual_taps: userTaps
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit vigilance test')
      }
      
      // Navigate to next test
      router.push('/tests/sentence-repetition')
      
    } catch (error) {
      console.error('Error submitting vigilance:', error)
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
        <title>Attention - Vigilance | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        {/* Header */}
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
                  <h1 className="text-2xl font-bold text-gray-900">Attention - Vigilance</h1>
                  <p className="text-sm text-gray-600">Module 7 of 12</p>
                </div>
              </div>
            </div>
          </div>
        </header>

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
                    Tap or click the screen whenever you see the letter <strong className="text-purple-600">A</strong>.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg max-w-xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Instructions:</h3>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li>• Letters will appear for 1 second each</li>
                    <li>• Click/tap the screen when you see the letter "A"</li>
                    <li>• Try to catch all the A's without clicking other letters</li>
                    <li>• Stay focused throughout the entire sequence</li>
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

            {isRunning && (
              <div 
                className="text-center py-16 cursor-pointer"
                onClick={handleTap}
              >
                <div className="text-9xl font-bold text-purple-600 animate-pulse select-none">
                  {currentLetter}
                </div>
                <p className="text-gray-600 mt-8">Tap when you see the letter "A"</p>
                <p className="text-sm text-gray-500 mt-2">Taps detected: {userTaps}</p>
              </div>
            )}

            {hasStarted && !isRunning && currentLetter === null && (
              <div className="space-y-8 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-5xl">✓</span>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Test Complete!
                  </h2>
                  <p className="text-gray-600">
                    You detected {userTaps} target letter{userTaps !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setHasStarted(false)
                      setUserTaps(0)
                      setTargetCount(0)
                      setLetters([])
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
