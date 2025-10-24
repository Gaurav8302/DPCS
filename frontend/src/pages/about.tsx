import Head from 'next/head'
import Link from 'next/link'
import { Brain, Target, Users, Award, Shield, TrendingUp } from 'lucide-react'

export default function About() {
  return (
    <>
      <Head>
        <title>About - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Brain className="w-10 h-10 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dimentia Project</h1>
            </Link>
            <Link href="/consent" className="btn-primary">
              Start Assessment
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About Dimentia Project
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A next-generation digital platform for early detection of cognitive decline 
              and dementia, powered by AI and clinical validation
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Target className="w-12 h-12 text-primary-600" />
              <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              To provide accessible, accurate, and comprehensive cognitive assessments that enable 
              early detection of cognitive decline, empowering individuals and healthcare providers 
              with actionable insights for better health outcomes.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Brain className="w-12 h-12 text-primary-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">MoCA-Based Assessment</h4>
              <p className="text-gray-600">
                Implements the clinically validated Montreal Cognitive Assessment (MoCA) 
                protocol with 9 comprehensive test modules
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Award className="w-12 h-12 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">95%+ Accuracy</h4>
              <p className="text-gray-600">
                AI-powered automated scoring with machine learning algorithms 
                validated against clinical standards
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">HIPAA Compliant</h4>
              <p className="text-gray-600">
                Enterprise-grade security with AES-256 encryption, secure data handling, 
                and GDPR compliance
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Real-time Analytics</h4>
              <p className="text-gray-600">
                Instant results with detailed insights, progress tracking, 
                and comprehensive reporting
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Users className="w-12 h-12 text-orange-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">User-Friendly</h4>
              <p className="text-gray-600">
                Intuitive interface designed for all age groups with accessibility 
                features and responsive design
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Brain className="w-12 h-12 text-pink-600 mb-4" />
              <h4 className="text-xl font-semibold mb-3">Comprehensive Tests</h4>
              <p className="text-gray-600">
                Evaluates memory, attention, language, visuospatial abilities, 
                and executive functions
              </p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Frontend</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Next.js 14 with React 18</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Konva.js for interactive graphics</li>
                  <li>• NextAuth.js for authentication</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Backend</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• FastAPI (Python 3.11+)</li>
                  <li>• Firebase Firestore database</li>
                  <li>• AI/ML scoring algorithms</li>
                  <li>• RESTful API architecture</li>
                  <li>• Deployed on Render.com</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Assessment Modules */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Assessment Modules</h3>
            <div className="grid gap-4">
              {[
                { name: 'Trail Making', desc: 'Visual attention and task switching' },
                { name: 'Visuospatial', desc: 'Cube copying and figure reproduction' },
                { name: 'Naming', desc: 'Animal identification with fuzzy matching' },
                { name: 'Memory', desc: 'Word registration and delayed recall' },
                { name: 'Attention', desc: 'Digit span and vigilance tasks' },
                { name: 'Language', desc: 'Sentence repetition and verbal fluency' },
                { name: 'Abstraction', desc: 'Similarity identification' },
                { name: 'Clock Drawing', desc: 'Time representation assessment' },
                { name: 'Orientation', desc: 'Date, time, and location verification' }
              ].map((module, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{module.name}</h5>
                    <p className="text-sm text-gray-600">{module.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring System */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Scoring System</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                The assessment uses a 30-point scale with education adjustment:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">26-30 Points</h4>
                  <p className="text-sm text-green-700">Normal cognitive function</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">18-25 Points</h4>
                  <p className="text-sm text-yellow-700">Mild cognitive impairment</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">10-17 Points</h4>
                  <p className="text-sm text-orange-700">Moderate cognitive impairment</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Below 10 Points</h4>
                  <p className="text-sm text-red-700">Severe cognitive impairment</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary-600 rounded-lg shadow-lg p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Begin Your Assessment?
            </h3>
            <p className="text-xl text-white mb-8">
              Start your comprehensive cognitive evaluation today
            </p>
            <Link href="/consent" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 font-semibold text-lg">
              Start Assessment Now
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
