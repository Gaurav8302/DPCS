import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Brain, CheckCircle, AlertCircle, Clock, Download, ArrowLeft, Activity, ArrowRight } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface SectionResult {
  section_name: string
  raw_score: number
  max_score: number
  confidence: number
  requires_manual_review: boolean
}

interface SessionResults {
  session_id: string
  user_id: string
  total_score: number
  max_possible_score: number
  interpretation: string
  completed_at: string
  sections: SectionResult[]
  education_bonus_applied: boolean
}

// Map section names to display names
const sectionDisplayNames: { [key: string]: string } = {
  'memory_learning': 'Memory Learning',
  'trail_making': 'Trail Making',
  'cube_copy': 'Cube/Figure Copy',
  'clock_drawing': 'Clock Drawing',
  'naming': 'Naming',
  'attention_forward': 'Digit Span (Forward)',
  'attention_backward': 'Digit Span (Backward)',
  'attention_vigilance': 'Vigilance',
  'attention_serial7': 'Serial 7s',
  'sentence_repetition': 'Sentence Repetition',
  'verbal_fluency': 'Verbal Fluency',
  'abstraction': 'Abstraction',
  'delayed_recall': 'Delayed Recall',
  'orientation': 'Orientation'
}

// Get interpretation color and bg
const getInterpretationStyle = (interpretation: string) => {
  if (interpretation.toLowerCase().includes('normal')) return { text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' }
  if (interpretation.toLowerCase().includes('mild')) return { text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' }
  if (interpretation.toLowerCase().includes('moderate')) return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' }
  return { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' }
}

export default function Results() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SessionResults | null>(null)

  useEffect(() => {
    const sessionId = sessionStorage.getItem('session_id')
    const userId = sessionStorage.getItem('user_id')
    
    if (!sessionId || !userId) {
      router.push('/consent')
      return
    }
    
    fetchResults(sessionId, userId)
  }, [router])

  const fetchResults = async (sessionId: string, userId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/results/${sessionId}?user_id=${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        // If no results endpoint, calculate from session
        const sessionResponse = await fetch(`${apiUrl}/api/sessions/${sessionId}`)
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          // Build results from session data
          setResults({
            session_id: sessionId,
            user_id: userId,
            total_score: sessionData.aggregate_scores?.total_score || 0,
            max_possible_score: 30,
            interpretation: sessionData.interpretation || 'Assessment Complete',
            completed_at: new Date().toISOString(),
            sections: Object.entries(sessionData.aggregate_scores?.section_scores || {}).map(([name, data]: [string, any]) => ({
              section_name: name,
              raw_score: data.score || 0,
              max_score: data.max || 1,
              confidence: data.confidence || 1.0,
              requires_manual_review: data.requires_review || false
            })),
            education_bonus_applied: sessionData.education_bonus_applied || false
          })
        } else {
          setError('Unable to load results. Please try again.')
        }
      }
    } catch (err) {
      console.error('Error fetching results:', err)
      setError('Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const interpretationStyle = results?.interpretation ? getInterpretationStyle(results.interpretation) : { text: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' }

  return (
    <>
      <Head>
        <title>Assessment Results | MoCA Digital</title>
        <meta name="description" content="View your cognitive assessment results" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MoCA Digital</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-28 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="w-4 h-4" />
                Assessment Complete
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Your Results
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Completed: {results?.completed_at ? new Date(results.completed_at).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center mb-8">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div>
                  <div className="text-5xl font-bold">
                    {results?.total_score || 0}
                  </div>
                  <div className="text-indigo-200 text-sm">
                    / {results?.max_possible_score || 30}
                  </div>
                </div>
              </div>
              
              {results?.interpretation && (
                <span className={`inline-block px-6 py-2 rounded-full text-lg font-medium ${interpretationStyle.bg} ${interpretationStyle.text} ${interpretationStyle.border} border`}>
                  {results.interpretation}
                </span>
              )}
              
              {results?.education_bonus_applied && (
                <p className="text-indigo-200 text-sm mt-4">
                  * Includes +1 point education adjustment (≤12 years of education)
                </p>
              )}
            </div>

            {/* Section Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Section Breakdown</h3>
              
              <div className="space-y-4">
                {results?.sections && results.sections.length > 0 ? (
                  results.sections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {section.requires_manual_review ? (
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {sectionDisplayNames[section.section_name] || section.section_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">
                            {section.raw_score}
                          </span>
                          <span className="text-gray-500">
                            / {section.max_score}
                          </span>
                        </div>
                        {/* Score bar */}
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${(section.raw_score / section.max_score) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Section details not available. Your total score is shown above.
                  </p>
                )}
              </div>
            </div>

            {/* Score Legend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Score Interpretation Guide</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700">26-30: Normal</h4>
                  <p className="text-sm text-green-600">No significant cognitive impairment detected</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-700">18-25: Mild Impairment</h4>
                  <p className="text-sm text-yellow-600">May indicate mild cognitive impairment</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-700">10-17: Moderate Impairment</h4>
                  <p className="text-sm text-orange-600">Consider consulting a healthcare professional</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-700">&lt;10: Severe Impairment</h4>
                  <p className="text-sm text-red-600">Professional evaluation recommended</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                  <p className="text-sm text-amber-700">
                    This assessment is for screening purposes only and does not constitute a medical diagnosis. 
                    If you have concerns about your cognitive health, please consult with a qualified healthcare 
                    professional for a comprehensive evaluation.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/consent"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
              >
                Take Another Assessment
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gray-100">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">MoCA Digital</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 MoCA Digital. For screening purposes only - not a diagnostic tool.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
