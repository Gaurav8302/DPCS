import Head from 'next/head'
import Link from 'next/link'
import { Brain, Target, Users, Award, Shield, TrendingUp, ArrowRight, Clock, Activity } from 'lucide-react'

export default function About() {
  const testModules = [
    { name: 'Memory Learning', desc: 'Word memorization and encoding' },
    { name: 'Trail Making', desc: 'Visual-motor tracking and switching' },
    { name: 'Figure Copy', desc: '2D/3D spatial skills assessment' },
    { name: 'Clock Drawing', desc: 'Executive function evaluation' },
    { name: 'Naming', desc: 'Animal identification & language' },
    { name: 'Digit Span Forward', desc: 'Attention span measurement' },
    { name: 'Digit Span Backward', desc: 'Working memory assessment' },
    { name: 'Vigilance', desc: 'Sustained attention testing' },
    { name: 'Serial 7s', desc: 'Calculation and concentration' },
    { name: 'Sentence Repetition', desc: 'Verbal memory testing' },
    { name: 'Verbal Fluency', desc: 'Language production speed' },
    { name: 'Abstraction', desc: 'Conceptual thinking ability' },
    { name: 'Delayed Recall', desc: 'Memory retrieval testing' },
    { name: 'Orientation', desc: 'Time & place awareness' },
  ]

  return (
    <>
      <Head>
        <title>About - MoCA Digital</title>
        <meta name="description" content="Learn about MoCA Digital cognitive assessment platform" />
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
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link 
                href="/consent" 
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              About Our Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Cognitive
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"> Assessment</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A next-generation digital platform for early detection of cognitive decline, 
              implementing the clinically-validated Montreal Cognitive Assessment with AI-powered scoring.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-indigo-100 leading-relaxed max-w-4xl">
                To provide accessible, accurate, and comprehensive cognitive assessments that enable 
                early detection of cognitive decline, empowering individuals and healthcare providers 
                with actionable insights for better health outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose MoCA Digital?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">MoCA-Based Assessment</h3>
                <p className="text-gray-600">
                  Implements the clinically validated Montreal Cognitive Assessment (MoCA) 
                  protocol with 14 comprehensive test modules.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Scoring</h3>
                <p className="text-gray-600">
                  Advanced machine learning algorithms provide accurate, consistent scoring 
                  validated against clinical standards.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with AES-256 encryption, secure data handling, 
                  and full GDPR compliance.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-50 transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600">
                  Get detailed insights immediately upon completion with comprehensive 
                  section-by-section breakdowns.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-50 transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Friendly</h3>
                <p className="text-gray-600">
                  Intuitive interface designed for all age groups with accessibility 
                  features and responsive design.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-50 transition-all">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick & Comprehensive</h3>
                <p className="text-gray-600">
                  Complete assessment in approximately 20 minutes covering all major 
                  cognitive domains.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Test Modules */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">14 Cognitive Test Modules</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform covers all cognitive domains tested in the standard MoCA, 
                providing comprehensive screening for early signs of cognitive impairment.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {testModules.map((module, idx) => (
                <div 
                  key={idx} 
                  className="group p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {module.name}
                      </h3>
                      <p className="text-sm text-gray-500">{module.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scoring System */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Scoring System</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              The assessment uses a 30-point scale with education adjustment (+1 point for ≤12 years of education)
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-6 bg-white rounded-2xl border-l-4 border-green-500">
                <h4 className="font-bold text-green-700 text-lg mb-1">26-30 Points</h4>
                <p className="text-green-600">Normal cognitive function</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-700 text-lg mb-1">18-25 Points</h4>
                <p className="text-yellow-600">Mild cognitive impairment</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-700 text-lg mb-1">10-17 Points</h4>
                <p className="text-orange-600">Moderate impairment</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border-l-4 border-red-500">
                <h4 className="font-bold text-red-700 text-lg mb-1">Below 10</h4>
                <p className="text-red-600">Severe impairment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">F</span>
                  </div>
                  Frontend
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Next.js 14 with React 18
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    TypeScript for type safety
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Tailwind CSS for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Konva.js for interactive graphics
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">B</span>
                  </div>
                  Backend
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    FastAPI (Python 3.11+)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Firebase Firestore database
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    AI/ML scoring algorithms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    RESTful API architecture
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Assessment?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Start your comprehensive cognitive evaluation today. The assessment 
              takes approximately 20 minutes and provides instant results.
            </p>
            <Link 
              href="/consent" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
            >
              Start Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

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
