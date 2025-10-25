import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Brain, CheckCircle, Clock, AlertCircle } from 'lucide-react'

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
    // Start the assessment flow from the first test
    router.push('/tests/trail-making')
  }

  const modules = [
    {
      id: 1,
      title: 'Trail Making Test',
      description: 'Connect numbers in sequence to test visual attention and task switching',
      duration: '2-3 minutes',
      status: 'ready',
      path: '/tests/trail-making'
    },
    {
      id: 2,
      title: 'Shape Drawing',
      description: 'Copy 2D shapes and a 3D cone to assess visuospatial abilities',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/cube-copy'
    },
    {
      id: 3,
      title: 'Clock Drawing',
      description: 'Draw a clock showing a specific time',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/clock-drawing'
    },
    {
      id: 4,
      title: 'Naming Test',
      description: 'Identify animals from images',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/naming'
    },
    {
      id: 5,
      title: 'Attention - Forward',
      description: 'Forward digit span test',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/attention-forward'
    },
    {
      id: 6,
      title: 'Attention - Backward',
      description: 'Backward digit span test',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/attention-backward'
    },
    {
      id: 7,
      title: 'Attention - Vigilance',
      description: 'Letter vigilance task',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/attention-vigilance'
    },
    {
      id: 8,
      title: 'Sentence Repetition',
      description: 'Repeat sentences accurately',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/sentence-repetition'
    },
    {
      id: 9,
      title: 'Verbal Fluency',
      description: 'Name words starting with F',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/verbal-fluency'
    },
    {
      id: 10,
      title: 'Abstraction',
      description: 'Identify similarities between pairs of items',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/abstraction'
    },
    {
      id: 11,
      title: 'Delayed Recall',
      description: 'Recall the words from earlier',
      duration: '2 minutes',
      status: 'ready',
      path: '/tests/delayed-recall'
    },
    {
      id: 12,
      title: 'Orientation',
      description: 'Questions about date, time, and place',
      duration: '1 minute',
      status: 'ready',
      path: '/tests/orientation'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Cognitive Assessment - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Brain className="w-10 h-10 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dimentia Project</h1>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cognitive Assessment Modules
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Total Time</p>
                  <p className="text-sm text-gray-600">20-30 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">10 Modules</p>
                  <p className="text-sm text-gray-600">Complete in order</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Brain className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">AI Scoring</p>
                  <p className="text-sm text-gray-600">Instant results</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Before You Begin</h3>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Find a quiet place free from distractions</li>
                    <li>• Have a pen and paper ready for some tasks</li>
                    <li>• Complete all modules in one session if possible</li>
                    <li>• Take your time - accuracy is more important than speed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Overview */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Begin Your Assessment?
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              You will complete 12 cognitive tests in sequence. Each test will automatically 
              proceed to the next one. The entire assessment takes approximately 20-30 minutes.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">20-30 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">12 Modules</p>
                  <p className="text-sm text-gray-600">Sequential flow</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Brain className="w-8 h-8 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">AI Scoring</p>
                  <p className="text-sm text-gray-600">Instant results</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 max-w-2xl mx-auto text-left">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Before You Begin</h3>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Find a quiet place free from distractions</li>
                    <li>• Have a pen and paper ready for some tasks</li>
                    <li>• Complete all modules in one session</li>
                    <li>• Take your time - accuracy is more important than speed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Modules (in order):</h3>
              <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto text-left">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-bold text-sm">
                      {module.id}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{module.title}</p>
                      <p className="text-xs text-gray-500">{module.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startAssessment}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Start Assessment
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Click to begin the first test
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
