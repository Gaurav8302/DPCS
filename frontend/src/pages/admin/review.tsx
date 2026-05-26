import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Check, X, AlertCircle } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ReviewItem {
  id: string;
  session_id: string;
  test_type: string;
  score: number;
  max_score: number;
  confidence: number;
  details: any;
  status: 'pending' | 'reviewed';
}

export default function ClinicalReview() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      // Fetch mock/real reviews from backend
      const response = await fetch(`${apiUrl}/admin/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      } else {
        // Fallback to mock data if backend route isn't ready
        setReviews([
          {
            id: '1',
            session_id: 'sess_123',
            test_type: 'Clock Drawing',
            score: 2,
            max_score: 3,
            confidence: 0.65,
            details: { has_contour: true, has_hands: true, has_numbers: false },
            status: 'pending'
          },
          {
            id: '2',
            session_id: 'sess_124',
            test_type: 'Verbal Fluency',
            score: 0,
            max_score: 1,
            confidence: 0.5,
            details: { word_count: 5, valid_words: ['fox', 'frog'] },
            status: 'pending'
          }
        ])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateScore = async (id: string, newScore: number) => {
    try {
      const response = await fetch(`${apiUrl}/admin/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: newScore, status: 'reviewed' })
      })
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== id))
      } else {
        // Optimistic UI update for mock
        setReviews(reviews.filter(r => r.id !== id))
      }
    } catch (error) {
      // Optimistic UI update for mock
      setReviews(reviews.filter(r => r.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Clinical Review Panel | MoCA Admin</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Manual Clinical Review</h1>
        </div>

        {loading ? (
          <p>Loading pending reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900">All caught up!</h2>
            <p className="text-gray-500 mt-2">There are no pending tests requiring manual review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{review.test_type}</h3>
                    <p className="text-sm text-gray-500">Session ID: {review.session_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">AI Confidence: {(review.confidence * 100).toFixed(0)}%</p>
                    <p className="text-sm text-gray-500">Suggested Score: {review.score}/{review.max_score}</p>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="bg-gray-50 p-4 rounded mb-4 font-mono text-sm">
                    {JSON.stringify(review.details, null, 2)}
                  </div>
                  <div className="flex items-center gap-4 border-t pt-4 mt-4">
                    <span className="text-sm font-medium text-gray-700">Override Score:</span>
                    <div className="flex gap-2">
                      {Array.from({ length: review.max_score + 1 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleUpdateScore(review.id, i)}
                          className={`w-10 h-10 rounded-full font-medium ${
                            review.score === i 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
