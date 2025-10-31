import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft, Clock, Camera, Pencil } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ClockDrawingTest() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [targetTime, setTargetTime] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('user_id')
    const storedSessionId = sessionStorage.getItem('session_id')
    
    if (!storedUserId) {
      router.push('/consent')
      return
    }
    
    setUserId(storedUserId)
    setSessionId(storedSessionId)
    
    // Randomize target time
    const hours = [10, 11, 1, 2, 3]
    const minutes = [10, 15, 20, 25, 30, 45, 50]
    const randomHour = hours[Math.floor(Math.random() * hours.length)]
    const randomMinute = minutes[Math.floor(Math.random() * minutes.length)]
    setTargetTime(`${randomHour}:${randomMinute.toString().padStart(2, '0')}`)

    // Setup canvas
    const canvas = canvasRef.current
    if (canvas) {
      // Set canvas size to match its display size
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 3
        ctx.strokeStyle = '#000'
        setContext(ctx)
      }
    }
    
    // Resize canvas on window resize
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
        
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.lineWidth = 3
          ctx.strokeStyle = '#000'
          setContext(ctx)
        }
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setUseCamera(true)
    } catch (error) {
      console.error('Camera access error:', error)
      alert('Unable to access camera')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setUseCamera(false)
  }

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const canvas = canvasRef.current
    const video = videoRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      return canvas.toDataURL('image/png')
    }
    return null
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || useCamera) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || useCamera) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const stopDrawing = () => {
    if (!context) return
    setIsDrawing(false)
    context.closePath()
  }

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const handleSubmit = async () => {
    if (!userId || !sessionId || !canvasRef.current) {
      alert('Missing required information')
      return
    }

    setSubmitting(true)

    try {
      let imageData: string | null = null
      
      if (useCamera) {
        imageData = captureFromCamera()
        if (!imageData) {
          alert('Failed to capture image from camera')
          setSubmitting(false)
          return
        }
      } else {
        imageData = canvasRef.current.toDataURL('image/png')
      }

      const response = await fetch(`${apiUrl}/api/score/clock-drawing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          image_data: imageData,
          target_time: targetTime
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Clock Drawing Result:', result)
        
        alert(`Score: ${result.score}/3\nContour: ${result.scores.contour}\nNumbers: ${result.scores.numbers}\nHands: ${result.scores.hands}\nConfidence: ${(result.confidence * 100).toFixed(0)}%`)
        
        router.push('/tests/naming')
      } else {
        alert('Failed to submit results')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Error submitting results')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Clock Drawing Test - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Clock Drawing Test
            </h1>
            <p className="text-gray-600">
              Draw a clock face showing the time: <strong className="text-2xl text-blue-600">{targetTime}</strong>
            </p>
          </div>

          {/* Target Time Display */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <Clock className="w-20 h-20 mx-auto mb-4 text-blue-500" />
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{targetTime}</h2>
            <p className="text-gray-600">Draw a clock showing this time</p>
          </div>

          {/* Drawing Mode Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => { stopCamera(); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${!useCamera ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Pencil className="w-5 h-5" />
                Draw on Canvas
              </button>
              <button
                onClick={startCamera}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${useCamera ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Camera className="w-5 h-5" />
                Use Camera
              </button>
            </div>
          </div>

          {/* Canvas or Camera */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {useCamera ? (
              <div className="text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-2xl mx-auto rounded-lg border-2 border-gray-300"
                />
                <p className="mt-4 text-gray-600">
                  Position your drawing in front of the camera
                </p>
              </div>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className="border-2 border-gray-300 rounded-lg w-full max-w-2xl mx-auto cursor-crosshair"
                  style={{ aspectRatio: '1/1' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Clear Canvas
                  </button>
                </div>
              </>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Draw a complete clock face with a circular outline</li>
                <li>• Include all numbers (1-12) in their correct positions</li>
                <li>• Draw hour and minute hands pointing to {targetTime}</li>
                <li>• Make sure the hands are clearly distinguishable</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit and Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
