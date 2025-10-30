import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft, Camera, Pencil } from 'lucide-react'

const SHAPES_2D = ['square', 'triangle', 'rectangle', 'circle']
const SHAPES_3D = ['cone'] // Always included

export default function CubeCopyTest() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [shapesToCopy, setShapesToCopy] = useState<string[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('user_id')
    const storedSessionId = sessionStorage.getItem('session_id')
    
    if (!storedUserId) {
      router.push('/consent')
      return
    }
    
    setUserId(storedUserId)
    setSessionId(storedSessionId)
    
    // Randomize 2 2D shapes + always include cone
    const random2D = SHAPES_2D.sort(() => 0.5 - Math.random()).slice(0, 2)
    setShapesToCopy([...random2D, ...SHAPES_3D])

    // Setup canvas
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 2
        ctx.strokeStyle = '#000'
        setContext(ctx)
      }
    }

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
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || useCamera) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dpcs.onrender.com'
      const response = await fetch(`${apiUrl}/api/score/cube-copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          image_data: imageData,
          shapes_to_copy: shapesToCopy
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Cube Copy Result:', result)
        
        router.push('/tests/clock-drawing')
      } else {
        alert('Failed to submit results. Proceeding to next test...')
        router.push('/tests/clock-drawing')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Unable to connect to server. Proceeding to next test...')
      router.push('/tests/clock-drawing')
    } finally {
      setSubmitting(false)
    }
  }

  const renderShapeExample = (shape: string) => {
    const size = 80
    switch (shape) {
      case 'square':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="black" strokeWidth="2" />
          </svg>
        )
      case 'circle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="black" strokeWidth="2" />
          </svg>
        )
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" fill="none" stroke="black" strokeWidth="2" />
          </svg>
        )
      case 'rectangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <rect x="10" y="25" width="80" height="50" fill="none" stroke="black" strokeWidth="2" />
          </svg>
        )
      case 'cone':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            <ellipse cx="50" cy="80" rx="40" ry="10" fill="none" stroke="black" strokeWidth="2" />
            <path d="M 10 80 L 50 10 L 90 80" fill="none" stroke="black" strokeWidth="2" />
            <path d="M 50 10 L 50 80" fill="none" stroke="black" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>Shape Drawing Test - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
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
              2D/3D Shape Drawing Test
            </h1>
            <p className="text-gray-600">
              Copy the shapes shown below as accurately as possible
            </p>
          </div>

          {/* Shapes to Copy */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Shapes to Copy:
            </h2>
            <div className="flex justify-around items-center">
              {shapesToCopy.map((shape, index) => (
                <div key={index} className="text-center">
                  {renderShapeExample(shape)}
                  <p className="mt-2 font-semibold text-gray-700 capitalize">{shape}</p>
                </div>
              ))}
            </div>
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
                  width={800}
                  height={500}
                  className="border-2 border-gray-300 rounded-lg w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="mt-4">
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
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Copy all {shapesToCopy.length} shapes as accurately as possible</li>
                <li>• You can draw on the canvas or show your drawing to the camera</li>
                <li>• The 3D cone should show depth and perspective</li>
                <li>• Take your time to make your drawings clear</li>
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
