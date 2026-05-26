import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Brain, CheckCircle, Clock, AlertCircle, ArrowRight, Activity } from 'lucide-react'

export default function Assessment() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has registered
    const storedUserId = sessionStorage.getItem('user_id')
    if (!storedUserId) {
      // Redirect to consent if not registered
      router.push('/consent')
    } else {
      setUserId(storedUserId)
      setLoading(false)
    }
  }, [router])

  const startAssessment = () => {
    // Start the assessment flow from memory learning (words are presented first)
    router.push('/tests/memory-learning')
  }

  // MoCA Test Flow per PRD:
  // 1. Memory Learning (present words first)
  // 2. Visuospatial/Executive (Trail Making, Cube Copy, Clock)
  // 3. Naming
  // 4. Attention (Forward, Backward, Vigilance, Serial 7s)
  // 5. Language (Sentence Repetition, Verbal Fluency)
  // 6. Abstraction
  // 7. Delayed Recall (recall the words from step 1)
  // 8. Orientation
  const modules = [
    {
      id: 1,
      title: 'Memory Learning',
      description: 'Learn 5 words to recall later: LEG, COTTON, SCHOOL, TOMATO, WHITE',
      duration: '30 seconds',
      status: 'ready',
      path: '/tests/memory-learning',
      section: 'Memory',
      points: '(5 pts at recall)'
    },
    {
      id: 2,
      title: 'Trail Making Test',
      description: 'Connect 1-A-2-B-3-C-4-D-5-E in sequence',
      duration: '2-3 minutes',
      status: 'ready',
      path: '/tests/trail-making',
      section: 'Visuospatial/Executive',
      points: '1 pt'
    },
    {
      id: 3,
      title: 'Cube Copy',
      description: 'Copy a 3D cube drawing',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/cube-copy',
      section: 'Visuospatial/Executive',
      points: '1 pt'
    },
    {
      id: 4,
      title: 'Clock Drawing',
      description: 'Draw a clock showing 10 past 11',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/clock-drawing',
      section: 'Visuospatial/Executive',
      points: '3 pts'
    },
    {
      id: 5,
      title: 'Naming Test',
      description: 'Identify 3 animals: Lion, Rhinoceros, Camel',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/naming',
      section: 'Naming',
      points: '3 pts'
    },
    {
      id: 6,
      title: 'Forward Digit Span',
      description: 'Repeat digits in the same order',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/attention-forward',
      section: 'Attention',
      points: '1 pt'
    },
    {
      id: 7,
      title: 'Backward Digit Span',
      description: 'Repeat digits in reverse order',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/attention-backward',
      section: 'Attention',
      points: '1 pt'
    },
    {
      id: 8,
      title: 'Vigilance Task',
      description: 'Tap when you hear/see the letter A',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/attention-vigilance',
      section: 'Attention',
      points: '1 pt'
    },
    {
      id: 9,
      title: 'Serial 7s',
      description: 'Subtract 7 from 100, then keep subtracting',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/attention-serial7',
      section: 'Attention',
      points: '3 pts'
    },
    {
      id: 10,
      title: 'Sentence Repetition',
      description: 'Repeat two sentences exactly',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/sentence-repetition',
      section: 'Language',
      points: '2 pts'
    },
    {
      id: 11,
      title: 'Verbal Fluency',
      description: 'Name as many words as possible starting with F',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/verbal-fluency',
      section: 'Language',
      points: '1 pt'
    },
    {
      id: 12,
      title: 'Abstraction',
      description: 'Find similarities: Hammer/Screwdriver, Matches/Lamp',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/abstraction',
      section: 'Abstraction',
      points: '2 pts'
    },
    {
      id: 13,
      title: 'Delayed Recall',
      description: 'Recall the 5 words from the beginning',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/delayed-recall',
      section: 'Delayed Recall',
      points: '5 pts'
    },
    {
      id: 14,
      title: 'Orientation',
      description: 'Questions about date, time, and place',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/orientation',
      section: 'Orientation',
      points: '6 pts'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Cognitive Assessment - MoCA Digital</title>
        <meta name="description" content="Begin your cognitive assessment" />
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
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
                <Activity className="w-4 h-4" />
                Step 2 of 2
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Ready to Begin Your Assessment?
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                You will complete 14 cognitive tests in sequence. Each test will automatically 
                proceed to the next one. The entire assessment takes approximately 20 minutes.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">~20 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">14 Modules</p>
                  <p className="text-sm text-gray-600">Sequential flow</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">AI Scoring</p>
                  <p className="text-sm text-gray-600">Instant results</p>
                </div>
              </div>
            </div>

            {/* Before You Begin */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Before You Begin</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Find a quiet place free from distractions</li>
                    <li>• Have a pen and paper ready for some tasks</li>
                    <li>• Complete all modules in one session</li>
                    <li>• Take your time - accuracy is more important than speed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Test Modules List */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Test Modules (in order)</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {module.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{module.title}</p>
                      <p className="text-xs text-gray-500 truncate">{module.description}</p>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium">{module.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={startAssessment}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all transform hover:scale-105"
              >
                Start Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Click to begin with Memory Learning
              </p>
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
