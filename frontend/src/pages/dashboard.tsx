import Head from 'next/head'
import Link from 'next/link'
import { Brain, FileText, TrendingUp, Clock, User } from 'lucide-react'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Brain className="w-10 h-10 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dimentia Project</h1>
            </Link>
            <div className="flex gap-4">
              <Link href="/consent" className="btn-primary">
                New Assessment
              </Link>
              <Link href="/" className="btn-secondary">
                Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">0</span>
              </div>
              <h3 className="text-gray-600">Total Assessments</h3>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">-</span>
              </div>
              <h3 className="text-gray-600">Latest Score</h3>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">-</span>
              </div>
              <h3 className="text-gray-600">Last Assessment</h3>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <User className="w-8 h-8 text-orange-600" />
                <span className="text-2xl font-bold text-gray-900">Active</span>
              </div>
              <h3 className="text-gray-600">Account Status</h3>
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Assessments</h3>
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">No assessments yet</p>
              <Link href="/consent" className="btn-primary">
                Start Your First Assessment
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/consent" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Brain className="w-12 h-12 text-primary-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">New Assessment</h4>
              <p className="text-gray-600">Start a new cognitive assessment</p>
            </Link>

            <Link href="/about" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">View History</h4>
              <p className="text-gray-600">See your assessment history</p>
            </Link>

            <Link href="/about" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Progress Report</h4>
              <p className="text-gray-600">Track your cognitive health</p>
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
