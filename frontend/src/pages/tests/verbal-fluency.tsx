import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Brain, Mic, MicOff } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

  useEffect(() => {
    // Initialize speech recognition
    let recognition: any = null;
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
          
          // Split by space in case multiple words were spoken
          const spokenWords = transcript.split(/\s+/);
          
          setWords(prev => {
            const newWords = [...prev];
            for (const word of spokenWords) {
              // Remove punctuation
              const cleanWord = word.replace(/[.,!?]/g, '');
              if (cleanWord.startsWith('f') && !newWords.includes(cleanWord)) {
                newWords.push(cleanWord);
              }
            }
            return newWords;
          });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setSpeechError(event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          if (isRecording && timeLeft > 0) {
            // Auto-restart if we're still supposed to be recording
            try {
              recognition?.start();
            } catch (e) {
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };
      } else {
        setSpeechError('Speech recognition is not supported in this browser.');
      }
    }

    if (isRecording && timeLeft > 0 && recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        setSpeechError(null);
      } catch (e) {
        console.error(e);
      }
    } else if ((!isRecording || timeLeft === 0) && recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }

    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, [isRecording, timeLeft, isListening]);

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
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/score/verbal-fluency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          words: words
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Verbal Fluency Result:', result)
        router.push('/tests/abstraction')
      } else {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        console.error('Submission error:', errorData)
        alert(`Failed to submit results: ${errorData.detail || 'Server error'}. Proceeding to next test...`)
        router.push('/tests/abstraction')
      }
      
    } catch (error) {
      console.error('Error submitting verbal fluency:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/abstraction')
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
              <h1 className="text-lg font-semibold text-gray-900">Verbal Fluency</h1>
            </div>
          </div>
        </nav>

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

                {/* Word Input / Speech Control */}
                {isRecording && (
                  <div className="space-y-4">
                    {speechError ? (
                       <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
                         {speechError} - Please use manual input below.
                       </div>
                    ) : null}
                    
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="flex flex-col items-center">
                        <div className={`p-6 rounded-full ${isListening ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
                          {isListening ? <Mic className="w-12 h-12 text-red-600" /> : <MicOff className="w-12 h-12 text-gray-400" />}
                        </div>
                        <p className="mt-4 text-lg font-medium text-gray-700">
                          {isListening ? 'Listening... Speak words starting with F' : 'Microphone is off'}
                        </p>
                      </div>

                      <div className="w-full flex items-center justify-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>

                      <div className="flex gap-2 w-full max-w-lg">
                        <input
                          type="text"
                          value={currentWord}
                          onChange={(e) => setCurrentWord(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a word starting with F..."
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-lg"
                        />
                        <button
                          onClick={handleAddWord}
                          disabled={!currentWord.trim()}
                          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </div>
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
