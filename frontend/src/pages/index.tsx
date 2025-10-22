import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Brain, CheckCircle, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  const { data: session } = useSession()
  
  return (
    <>
      <Head>
        <title>Dimentia Project - Cognitive Assessment Platform</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Brain className="w-10 h-10 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dimentia Project</h1>
            </div>
            <div className="flex gap-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="btn-secondary">
                    Dashboard
                  </Link>
                  <Link href="/api/auth/signout" className="btn-primary">
                    Sign Out
                  </Link>
                </>
              ) : (
                <Link href="/api/auth/signin" className="btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Early Detection of Cognitive Decline
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Digital platform implementing the Montreal Cognitive Assessment (MoCA) 
              with AI-powered scoring and comprehensive analytics
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/consent" className="btn-primary text-lg px-8 py-4">
                Start Assessment
              </Link>
              <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Brain className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">9 Test Modules</h3>
              <p className="text-gray-600">
                Comprehensive assessment covering all cognitive domains
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">95%+ Accuracy</h3>
              <p className="text-gray-600">
                AI-powered automated scoring with clinical validation
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600">
                AES-256 encryption and secure data handling
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">
                Instant results with detailed insights and reporting
              </p>
            </div>
          </div>
          
          {/* Test Sections */}
          <div className="mt-16 card">
            <h3 className="text-2xl font-bold mb-6 text-center">Assessment Sections</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                'Trail Making',
                'Cube/2D Figure Copy',
                'Clock Drawing',
                'Naming',
                'Attention',
                'Language',
                'Abstraction',
                'Delayed Recall',
                'Orientation'
              ].map((section, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-800">{section}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
            <p>© 2025 Dimentia Project. Built for improved cognitive health screening.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
