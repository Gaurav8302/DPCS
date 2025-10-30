import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Brain, CheckCircle, Shield, FileText } from 'lucide-react'

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com'
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
        
        // Redirect to first test (trail-making)
        router.push('/tests/trail-making')
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
        <title>Consent & Registration - Dimentia Project</title>
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Informed Consent & Registration
              </h2>
              <p className="text-gray-600">
                Please read carefully and provide your information to begin the assessment
              </p>
            </div>

            {/* Consent Information */}
            <div className="mb-8 space-y-4">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Your Privacy & Data Protection
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 ml-7">
                  <li>• All data is encrypted and stored securely</li>
                  <li>• Your information will only be used for assessment purposes</li>
                  <li>• You can request deletion of your data at any time</li>
                  <li>• We comply with HIPAA and GDPR regulations</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  About the Assessment
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 ml-7">
                  <li>• The assessment takes approximately 20-30 minutes</li>
                  <li>• It consists of 9 different cognitive test modules</li>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Years of formal education"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
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
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!agreed}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  Begin Assessment
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
