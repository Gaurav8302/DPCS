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
    const storedUserId = sessionStorage.getItem('userId')
    if (!storedUserId) {
      // Redirect to consent if not registered
      router.push('/consent')
    } else {
      setUserId(storedUserId)
      setLoading(false)
    }
  }, [router])

  const modules = [
    {
      id: 1,
      title: 'Trail Making Test',
      description: 'Connect numbers in sequence to test visual attention and task switching',
      duration: '2-3 minutes',
      status: 'ready'
    },
    {
      id: 2,
      title: 'Cube Copy',
      description: 'Copy a 3D cube to assess visuospatial abilities',
      duration: '2 minutes',
      status: 'ready'
    },
    {
      id: 3,
      title: 'Clock Drawing',
      description: 'Draw a clock showing a specific time',
      duration: '2 minutes',
      status: 'ready'
    },
    {
      id: 4,
      title: 'Naming Test',
      description: 'Identify animals from images',
      duration: '1 minute',
      status: 'ready'
    },
    {
      id: 5,
      title: 'Memory - Registration',
      description: 'Remember a list of words for later recall',
      duration: '2 minutes',
      status: 'ready'
    },
    {
      id: 6,
      title: 'Attention Tests',
      description: 'Digit span forward/backward and vigilance tasks',
      duration: '3-4 minutes',
      status: 'ready'
    },
    {
      id: 7,
      title: 'Language',
      description: 'Sentence repetition and verbal fluency',
      duration: '2-3 minutes',
      status: 'ready'
    },
    {
      id: 8,
      title: 'Abstraction',
      description: 'Identify similarities between pairs of items',
      duration: '1 minute',
      status: 'ready'
    },
    {
      id: 9,
      title: 'Delayed Recall',
      description: 'Recall the words from earlier',
      duration: '2 minutes',
      status: 'ready'
    },
    {
      id: 10,
      title: 'Orientation',
      description: 'Questions about date, time, and place',
      duration: '1 minute',
      status: 'ready'
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

          {/* Assessment Modules */}
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-bold">
                        {module.id}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {module.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {module.duration}
                    </div>
                  </div>
                </div>
                
                <button
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                  onClick={() => alert('Module coming soon! Full implementation in progress.')}
                >
                  Start Module
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4">
              <Link
                href="/"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium"
              >
                Save & Exit
              </Link>
              <button
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                onClick={() => alert('Please complete all modules first')}
              >
                View Results
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
