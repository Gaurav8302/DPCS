import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'

// These should match the words from the initial memory registration
const WORDS_TO_RECALL = ['FACE', 'VELVET', 'CHURCH', 'DAISY', 'RED']

export default function DelayedRecall() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [userWords, setUserWords] = useState<string[]>(['', '', '', '', ''])

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

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...userWords]
    newWords[index] = value
    setUserWords(newWords)
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com')}/scoring/delayed-recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          recalled_words: userWords.filter(w => w.trim())
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit delayed recall')
      }
      
      router.push('/tests/orientation')
      
    } catch (error) {
      console.error('Error submitting delayed recall:', error)
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
        <title>Delayed Recall | MoCA Assessment</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
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
                  <h1 className="text-2xl font-bold text-gray-900">Delayed Recall</h1>
                  <p className="text-sm text-gray-600">Module 11 of 12</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🧠</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Memory Recall
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Try to remember the 5 words you learned at the beginning of this assessment.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8 max-w-xl mx-auto">
              <p className="text-center text-gray-700">
                <strong>Recall the 5 words</strong> you were asked to remember earlier. 
                Enter as many as you can remember in any order.
              </p>
            </div>

            <div className="space-y-4 max-w-xl mx-auto">
              {userWords.map((word, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-pink-100 text-pink-600 rounded-full font-bold">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleWordChange(index, e.target.value.toUpperCase())}
                    placeholder={`Word ${index + 1}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-lg uppercase"
                    maxLength={20}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-xl mx-auto">
              <p className="text-sm text-yellow-800">
                💡 <strong>Hint:</strong> Think back to the very beginning of the assessment. 
                The words were: a texture, a place, a color, and two other things.
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setUserWords(['', '', '', '', ''])}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit & Continue'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              You can leave some fields empty if you don't remember all the words
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
