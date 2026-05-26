import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Brain, CheckCircle, Shield, FileText, Activity } from 'lucide-react'

export default function Consent() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    education: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreed) {
      alert('Please agree to the terms and conditions')
      return
    }

    try {
      // Create user in backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          education_years: parseInt(formData.education)
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Store user ID and session ID in session storage
        sessionStorage.setItem('user_id', data.user_id)
        sessionStorage.setItem('session_id', data.session_id)
        
        // Redirect to first test (memory-learning per PRD)
        router.push('/tests/memory-learning')
      } else {
        const errorData = await response.json()
        alert(`Failed to create user: ${errorData.detail || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Unable to connect to server. Please check your internet connection and try again.')
    }
  }

  return (
    <>
      <Head>
        <title>Consent & Registration - MoCA Digital</title>
        <meta name="description" content="Register and provide consent to begin your cognitive assessment" />
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
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-28 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
                <Activity className="w-4 h-4" />
                Step 1 of 2
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Informed Consent & Registration
              </h1>
              <p className="text-gray-600">
                Please read carefully and provide your information to begin the assessment
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              {/* Consent Information */}
              <div className="mb-8 space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Your Privacy & Data Protection
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2 ml-7">
                    <li>• All data is encrypted and stored securely</li>
                    <li>• Your information will only be used for assessment purposes</li>
                    <li>• You can request deletion of your data at any time</li>
                    <li>• We comply with HIPAA and GDPR regulations</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    About the Assessment
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2 ml-7">
                    <li>• The assessment takes approximately 20 minutes</li>
                    <li>• It consists of 14 different cognitive test modules</li>
                    <li>• Results are provided immediately upon completion</li>
                    <li>• This is a screening tool, not a diagnostic test</li>
                  </ul>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      required
                      min="18"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Your age"
                    />
                  </div>

                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Education *
                    </label>
                    <input
                      type="number"
                      id="education"
                      required
                      min="0"
                      max="30"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="Years of formal education"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="border-t border-gray-100 pt-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      I understand and agree that:
                      <ul className="mt-2 space-y-1 ml-4">
                        <li>• I am voluntarily participating in this cognitive assessment</li>
                        <li>• My data will be stored securely and used for assessment purposes</li>
                        <li>• This is a screening tool and not a replacement for medical diagnosis</li>
                        <li>• I can stop the assessment at any time</li>
                        <li>• I should consult a healthcare professional for medical advice</li>
                      </ul>
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/"
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 text-center font-medium transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={!agreed}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-indigo-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none font-medium transition-all"
                  >
                    Begin Assessment
                  </button>
                </div>
              </form>
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
