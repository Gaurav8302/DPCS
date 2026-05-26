import Head from 'next/head'
import Link from 'next/link'
import { Brain, FileText, TrendingUp, Clock, User, ArrowRight, Activity } from 'lucide-react'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - MoCA Digital</title>
        <meta name="description" content="View your cognitive assessment history and results" />
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
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link 
                href="/consent" 
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all"
              >
                New Assessment
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-28 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
                <Activity className="w-4 h-4" />
                Your Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Welcome Back
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">0</span>
                </div>
                <h3 className="text-gray-600">Total Assessments</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">-</span>
                </div>
                <h3 className="text-gray-600">Latest Score</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">-</span>
                </div>
                <h3 className="text-gray-600">Last Assessment</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">Active</span>
                </div>
                <h3 className="text-gray-600">Account Status</h3>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Assessments</h3>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-6">No assessments yet</p>
                <Link 
                  href="/consent" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all"
                >
                  Start Your First Assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/consent" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">New Assessment</h4>
                <p className="text-gray-600">Start a new cognitive assessment</p>
              </Link>

              <Link href="/about" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">View History</h4>
                <p className="text-gray-600">See your assessment history</p>
              </Link>

              <Link href="/about" className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-green-600 transition-colors">Progress Report</h4>
                <p className="text-gray-600">Track your cognitive health</p>
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
