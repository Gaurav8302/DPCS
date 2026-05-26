import Head from 'next/head'
import Link from 'next/link'
import { Brain, Activity, Shield, BarChart3, ArrowRight, Clock, Users, Award } from 'lucide-react'

export default function Home() {
  const testModules = [
    { name: 'Memory Learning', description: 'Word memorization' },
    { name: 'Trail Making', description: 'Visual-motor tracking' },
    { name: 'Figure Copy', description: '2D/3D spatial skills' },
    { name: 'Clock Drawing', description: 'Executive function' },
    { name: 'Naming', description: 'Language & recognition' },
    { name: 'Digit Span Forward', description: 'Attention span' },
    { name: 'Digit Span Backward', description: 'Working memory' },
    { name: 'Vigilance', description: 'Sustained attention' },
    { name: 'Serial 7s', description: 'Calculation' },
    { name: 'Sentence Repetition', description: 'Verbal memory' },
    { name: 'Verbal Fluency', description: 'Language production' },
    { name: 'Abstraction', description: 'Conceptual thinking' },
    { name: 'Delayed Recall', description: 'Memory retrieval' },
    { name: 'Orientation', description: 'Time & place awareness' },
  ]
  
  return (
    <>
      <Head>
        <title>MoCA Digital - AI-Powered Cognitive Assessment</title>
        <meta name="description" content="Digital Montreal Cognitive Assessment with AI-powered scoring" />
      </Head>
      
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MoCA Digital</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
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
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-6">
                <Activity className="w-4 h-4" />
                AI-Powered Cognitive Screening
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Early Detection for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600"> Better Outcomes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A comprehensive digital implementation of the Montreal Cognitive Assessment (MoCA) 
                featuring 14 clinically-validated tests with automated AI scoring.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/consent" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all"
                >
                  Begin Assessment
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">14</div>
                <div className="text-gray-600">Test Modules</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">30</div>
                <div className="text-gray-600">Point Scale</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">20</div>
                <div className="text-gray-600">Minutes Average</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">HIPAA</div>
                <div className="text-gray-600">Compliant</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Test Modules Grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Cognitive Assessment</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform covers all cognitive domains tested in the standard MoCA, 
                providing comprehensive screening for early signs of cognitive impairment.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {testModules.map((module, idx) => (
                <div 
                  key={idx} 
                  className="group p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {module.name}
                      </h3>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              The assessment takes approximately 20 minutes. Your data is encrypted 
              and handled securely in compliance with healthcare regulations.
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
