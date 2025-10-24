import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'lucide-react'

export default function AttentionForwardTest() {
  const router = useRouter()
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<string[]>(['', '', '', '', ''])
  const [showSequence, setShowSequence] = useState(true)
  const [currentDigit, setCurrentDigit] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId')
    const storedSessionId = sessionStorage.getItem('sessionId')
    
    if (!storedUserId) {
      router.push('/consent')
      return
    }
    
    setUserId(storedUserId)
    setSessionId(storedSessionId)
    
    // Generate random 5-digit sequence
    const randomSeq = Array.from({length: 5}, () => Math.floor(Math.random() * 10))
    setSequence(randomSeq)
    
    // Show digits one by one
    showDigitsSequentially(randomSeq)
  }, [])

  const showDigitsSequentially = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      setCurrentDigit(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/score/attention/forward`, {
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
        alert('Failed to submit results')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Error submitting results')
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

          {showSequence ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-8">Watch carefully...</p>
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
