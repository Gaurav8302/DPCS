import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Brain, Calculator } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AttentionSerial7() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<number[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const steps = [
    { label: '100 - 7 =', previousValue: 100 },
    { label: 'Previous - 7 =', previousValue: null },
    { label: 'Previous - 7 =', previousValue: null },
    { label: 'Previous - 7 =', previousValue: null },
    { label: 'Previous - 7 =', previousValue: null },
  ]

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
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentStep])

  const getPreviousValue = () => {
    if (currentStep === 0) return 100
    return responses[currentStep - 1] || 100
  }

  const handleNext = () => {
    const value = parseInt(currentInput)
    if (isNaN(value)) {
      alert('Please enter a valid number')
      return
    }

    const newResponses = [...responses, value]
    setResponses(newResponses)
    setCurrentInput('')

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit(newResponses)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  const handleSubmit = async (finalResponses: number[]) => {
    setLoading(true)
    
    try {
      const response = await fetch(`${apiUrl}/api/score/attention/serial7`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          responses: finalResponses
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Serial 7s Result:', result)
        router.push('/tests/sentence-repetition')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/sentence-repetition')
      }
      
    } catch (error) {
      console.error('Error submitting serial 7s:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/sentence-repetition')
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
        <title>Serial 7s | MoCA Assessment</title>
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
              <h1 className="text-lg font-semibold text-gray-900">Attention - Serial 7s</h1>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Subtract 7s from 100
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Starting from 100, subtract 7 and continue subtracting 7 from each answer.
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? '✓' : step + 1}
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Previous answers */}
            {responses.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Your calculations:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-gray-700">100</span>
                  {responses.map((r, i) => (
                    <span key={i} className="flex items-center">
                      <span className="mx-1 text-gray-400">→</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">{r}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Current question */}
            <div className="text-center p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
              <p className="text-xl text-gray-600 mb-4">
                {currentStep === 0 ? (
                  <>Starting from <span className="font-bold text-3xl text-indigo-600">100</span></>
                ) : (
                  <>Starting from <span className="font-bold text-3xl text-indigo-600">{getPreviousValue()}</span></>
                )}
              </p>
              
              <div className="flex items-center justify-center gap-4 my-6">
                <span className="text-4xl font-bold text-gray-800">{getPreviousValue()}</span>
                <span className="text-4xl font-bold text-gray-600">−</span>
                <span className="text-4xl font-bold text-red-500">7</span>
                <span className="text-4xl font-bold text-gray-600">=</span>
                <input
                  ref={inputRef}
                  type="number"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-32 px-4 py-3 text-4xl font-bold text-center border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="?"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleNext}
                disabled={loading || !currentInput}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : currentStep === 4 ? 'Submit' : 'Next'}
              </button>
            </div>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Take your time. Each answer is evaluated based on whether it's 7 less than your previous answer.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
