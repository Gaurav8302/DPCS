import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Brain, Mic, MicOff } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// PRD-specified sentences for repetition (Section 3.5 A)
const SENTENCES = [
  "The child walked his dog in the park after midnight.",
  "The artist finished his painting at the right moment for the exhibition."
]

export default function SentenceRepetition() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [userInputs, setUserInputs] = useState<string[]>(['', ''])
  const [showSentence, setShowSentence] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)

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

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    let recognition: any = null;
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleInputChange(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setSpeechError(event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        try {
          recognition.start();
          setIsListening(true);
          setSpeechError(null);
        } catch (e) {
          console.error(e);
          setIsListening(false);
        }
      } else {
        setSpeechError('Speech recognition is not supported in this browser. Please type the sentence.');
      }
    }
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
              <h1 className="text-lg font-semibold text-gray-900">Sentence Repetition</h1>
            </div>
          </div>
        </nav>

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

                {speechError ? (
                  <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
                    {speechError}
                  </div>
                ) : null}

                <div className="flex flex-col items-center mb-6">
                  <button
                    onClick={toggleListening}
                    className={`p-6 rounded-full transition-colors ${isListening ? 'bg-red-100 animate-pulse' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {isListening ? <Mic className="w-12 h-12 text-red-600" /> : <MicOff className="w-12 h-12 text-gray-400" />}
                  </button>
                  <p className="mt-4 text-lg font-medium text-gray-700">
                    {isListening ? 'Listening... Speak the sentence' : 'Click microphone to record, or type below'}
                  </p>
                </div>

                <textarea
                  value={userInputs[currentSentenceIndex]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onPaste={(e) => e.preventDefault()} // Prevent paste
                  onCopy={(e) => e.preventDefault()} // Prevent copy
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                  placeholder="Or type the sentence here..."
                  autoFocus
                />

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Copy and paste are disabled. You must speak or type from memory.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
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
