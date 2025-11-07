import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AttentionBackward() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [showingDigits, setShowingDigits] = useState(false)
  const [currentDigit, setCurrentDigit] = useState<number | null>(null)
  const [digits, setDigits] = useState<number[]>([])
  const [userInput, setUserInput] = useState<string[]>(['', '', ''])
  const [currentInputIndex, setCurrentInputIndex] = useState(0)
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

  const showDigitsSequentially = async () => {
    setHasStarted(true)
    setShowingDigits(true)
    
    // Generate 3 random digits
    const randomDigits = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10))
    setDigits(randomDigits)
    
    // Show each digit for 1 second
    for (let i = 0; i < randomDigits.length; i++) {
      setCurrentDigit(randomDigits[i])
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setCurrentDigit(null)
    setShowingDigits(false)
  }

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    
    const newInput = [...userInput]
    newInput[index] = value
    setUserInput(newInput)
    
    // Auto-focus next input
    if (value && index < 2) {
      setCurrentInputIndex(index + 1)
      const nextInput = document.getElementById(`digit-input-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Reverse the user's input to match backend expectation (backward = reversed)
      const reversedInput = userInput.reverse().join('')
      
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/attention-backward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          expected: digits.join(''),
          actual: reversedInput
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Backward Attention Result:', result)
        // Navigate to next test (vigilance)
        router.push('/tests/attention-vigilance')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/attention-vigilance')
      }
      
    } catch (error) {
      console.error('Error submitting attention backward:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/attention-vigilance')
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
        <title>Attention - Backward | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  <h1 className="text-2xl font-bold text-gray-900">Attention Test - Backward</h1>
                  <p className="text-sm text-gray-600">Module 6 of 12</p>
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
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-5xl">🔢</span>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Backward Digit Span
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    You will see 3 digits shown one at a time. After they disappear, 
                    enter them in <strong>reverse order</strong>.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg max-w-xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Example:</h3>
                  <p className="text-gray-700 mb-2">If you see: <strong>2 → 4 → 7</strong></p>
                  <p className="text-gray-700">You should enter: <strong>7 → 4 → 2</strong></p>
                </div>

                <button
                  onClick={showDigitsSequentially}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
                >
                  Start Test
                </button>
              </div>
            )}

            {showingDigits && (
              <div className="text-center py-16">
                <div className="text-9xl font-bold text-blue-600 animate-pulse">
                  {currentDigit}
                </div>
                <p className="text-gray-600 mt-8">Remember this digit...</p>
              </div>
            )}

            {hasStarted && !showingDigits && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Enter the digits in reverse order
                  </h2>
                  <p className="text-gray-600">Type the numbers backwards from what you saw</p>
                </div>

                <div className="flex justify-center gap-4">
                  {userInput.map((value, index) => (
                    <input
                      key={index}
                      id={`digit-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-20 h-20 text-4xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={() => {
                      setHasStarted(false)
                      setUserInput(['', '', ''])
                      setCurrentInputIndex(0)
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || userInput.some(val => !val)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
