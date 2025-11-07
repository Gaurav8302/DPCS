import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AttentionForwardTest() {
  const router = useRouter()
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<string[]>(['', '', '', '', ''])
  const [showInstructions, setShowInstructions] = useState(true)
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showSequence, setShowSequence] = useState(false)
  const [currentDigit, setCurrentDigit] = useState(0)
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
    
    // Generate random 5-digit sequence
    const randomSeq = Array.from({length: 5}, () => Math.floor(Math.random() * 10))
    setSequence(randomSeq)
  }, [])

  const startTest = async () => {
    setShowInstructions(false)
    setShowCountdown(true)
    
    // Countdown: 3, 2, 1
    for (let i = 3; i > 0; i--) {
      setCountdown(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setShowCountdown(false)
    setShowSequence(true)
    
    // Show digits sequentially - 2 seconds apart
    for (let i = 0; i < sequence.length; i++) {
      setCurrentDigit(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    setShowSequence(false)
  }

  const handleSubmit = async () => {
    if (!userId || !sessionId) return
    if (userInput.some(val => val === '')) {
      alert('Please enter all digits')
      return
    }

    setSubmitting(true)

    try {
      const userResponse = userInput.map(val => parseInt(val))
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/attention/forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          user_response: userResponse,
          correct_sequence: sequence
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Forward Attention Result:', result)
        alert(`Score: ${result.score}/1${result.correct ? ' ✓ Correct!' : ' ✗ Incorrect'}`)
        router.push('/tests/attention-backward')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/attention-backward')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/attention-backward')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Forward Digit Span - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forward Digit Span
            </h1>
            <p className="text-gray-600">
              Remember the sequence of numbers in the same order
            </p>
          </div>

          {showInstructions ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔢</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Forward Digit Span
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                You will see a sequence of 5 numbers appear one at a time. 
                Remember them in the <strong className="text-indigo-600">same order</strong> they were shown.
              </p>

              <div className="bg-indigo-50 p-6 rounded-lg mb-8 max-w-xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Example:</h3>
                <p className="text-gray-700 mb-2">
                  If you see: <strong className="text-2xl">2</strong> → <strong className="text-2xl">8</strong> → <strong className="text-2xl">5</strong>
                </p>
                <p className="text-gray-700">
                  You should enter: <strong className="text-indigo-600">2-8-5</strong>
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 max-w-xl mx-auto">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tips:</strong>
                </p>
                <ul className="text-left text-sm text-yellow-800 mt-2 space-y-1">
                  <li>• Each digit will appear for 2 seconds</li>
                  <li>• Pay close attention to the order</li>
                  <li>• Try to visualize or repeat the numbers mentally</li>
                </ul>
              </div>

              <button
                onClick={startTest}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors"
              >
                Start Test
              </button>
            </div>
          ) : showCountdown ? (
            <div className="bg-white rounded-lg shadow-md p-16 text-center">
              <p className="text-xl text-gray-600 mb-8">Get ready...</p>
              <div className="text-9xl font-bold text-indigo-600 animate-pulse">
                {countdown}
              </div>
            </div>
          ) : showSequence ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-8">Watch carefully and remember...</p>
              <div className="text-9xl font-bold text-blue-600 animate-pulse">
                {sequence[currentDigit]}
              </div>
              <p className="mt-8 text-gray-500">Digit {currentDigit + 1} of {sequence.length}</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Enter the sequence in the same order:
                </h2>
                
                <div className="flex gap-4 justify-center mb-6">
                  {userInput.map((val, index) => (
                    <input
                      key={index}
                      type="number"
                      min="0"
                      max="9"
                      value={val}
                      onChange={(e) => {
                        const newInput = [...userInput]
                        newInput[index] = e.target.value.slice(0, 1)
                        setUserInput(newInput)
                        // Auto-focus next input
                        if (e.target.value && index < 4) {
                          const nextInput = document.querySelector(`input[name="digit-${index + 1}"]`) as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      name={`digit-${index}`}
                      className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                <strong>Instructions:</strong> Enter the digits in the same order they were shown.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
