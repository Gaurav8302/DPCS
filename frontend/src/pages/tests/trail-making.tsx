import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

interface Node {
  id: string
  x: number
  y: number
  type: 'number' | 'letter'
}

interface Line {
  from: string
  to: string
  color: string
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788']

export default function TrailMakingTest() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [userPath, setUserPath] = useState<string[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [crossingErrors, setCrossingErrors] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const expectedSequence = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E']

  useEffect(() => {
    // Get user info from sessionStorage
    const storedUserId = sessionStorage.getItem('userId')
    const storedSessionId = sessionStorage.getItem('sessionId')
    
    if (!storedUserId) {
      router.push('/consent')
      return
    }
    
    setUserId(storedUserId)
    setSessionId(storedSessionId)
    
    // Generate randomized node positions
    generateNodes()
  }, [])

  const generateNodes = () => {
    const numbers = ['1', '2', '3', '4', '5']
    const letters = ['A', 'B', 'C', 'D', 'E']
    const newNodes: Node[] = []
    const margin = 80
    const usedPositions: {x: number, y: number}[] = []

    const isPositionValid = (x: number, y: number) => {
      return usedPositions.every(pos => {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        return distance > 100 // Minimum distance between nodes
      })
    }

    const getRandomPosition = () => {
      let x, y
      let attempts = 0
      do {
        x = margin + Math.random() * (800 - 2 * margin)
        y = margin + Math.random() * (500 - 2 * margin)
        attempts++
      } while (!isPositionValid(x, y) && attempts < 100)
      
      usedPositions.push({x, y})
      return {x, y}
    }

    // Add numbers
    numbers.forEach(num => {
      const pos = getRandomPosition()
      newNodes.push({ id: num, ...pos, type: 'number' })
    })

    // Add letters
    letters.forEach(letter => {
      const pos = getRandomPosition()
      newNodes.push({ id: letter, ...pos, type: 'letter' })
    })

    setNodes(newNodes)
  }

  const handleNodeClick = (nodeId: string) => {
    if (isComplete) return

    const nextExpected = expectedSequence[userPath.length]
    
    if (nodeId === nextExpected) {
      const newPath = [...userPath, nodeId]
      setUserPath(newPath)

      // Add line with unique color
      if (newPath.length > 1) {
        const colorIndex = (newPath.length - 2) % COLORS.length
        setLines([...lines, {
          from: newPath[newPath.length - 2],
          to: nodeId,
          color: COLORS[colorIndex]
        }])
      }

      // Check if complete
      if (newPath.length === expectedSequence.length) {
        setIsComplete(true)
      }
    } else {
      // Wrong sequence - could track errors here
      alert('Please follow the correct sequence: 1-A-2-B-3-C-4-D-5-E')
    }
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw lines
    lines.forEach(line => {
      const fromNode = nodes.find(n => n.id === line.from)
      const toNode = nodes.find(n => n.id === line.to)
      
      if (fromNode && toNode) {
        ctx.strokeStyle = line.color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach(node => {
      const isClicked = userPath.includes(node.id)
      
      // Draw circle
      ctx.fillStyle = isClicked ? '#4CAF50' : '#fff'
      ctx.strokeStyle = node.type === 'number' ? '#2196F3' : '#FF9800'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Draw text
      ctx.fillStyle = isClicked ? '#fff' : '#000'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.id, node.x, node.y)
    })
  }

  useEffect(() => {
    drawCanvas()
  }, [nodes, lines, userPath])

  const handleSubmit = async () => {
    if (!userId || !sessionId) {
      alert('Session information missing')
      return
    }

    setSubmitting(true)

    try {
      const nodePositions = nodes.reduce((acc, node) => {
        acc[node.id] = { x: node.x, y: node.y }
        return acc
      }, {} as Record<string, {x: number, y: number}>)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/score/trail-making`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: userId,
          user_path: userPath,
          node_positions: nodePositions,
          crossing_errors: crossingErrors
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Trail Making Result:', result)
        
        // Navigate to next test
        router.push('/tests/cube-copy')
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
        <title>Trail Making Test - Dimentia Project</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
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
              Trail Making Test
            </h1>
            <p className="text-gray-600">
              Connect the circles in order: 1-A-2-B-3-C-4-D-5-E
            </p>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {userPath.length} / {expectedSequence.length}</span>
                <span>Expected next: <strong>{expectedSequence[userPath.length] || 'Complete!'}</strong></span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(userPath.length / expectedSequence.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="border-2 border-gray-300 rounded-lg cursor-pointer w-full"
                onClick={(e) => {
                  const canvas = canvasRef.current
                  if (!canvas) return

                  const rect = canvas.getBoundingClientRect()
                  const scaleX = canvas.width / rect.width
                  const scaleY = canvas.height / rect.height
                  const x = (e.clientX - rect.left) * scaleX
                  const y = (e.clientY - rect.top) * scaleY

                  // Find clicked node
                  const clickedNode = nodes.find(node => {
                    const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
                    return distance <= 30
                  })

                  if (clickedNode) {
                    handleNodeClick(clickedNode.id)
                  }
                }}
              />
              
              {isComplete && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-10 flex items-center justify-center rounded-lg">
                  <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Test Complete!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      You successfully completed the trail making test.
                    </p>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Continue to Next Test'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Click on the circles in alternating order: 1-A-2-B-3-C-4-D-5-E</li>
                <li>• Each connecting line will have a unique color</li>
                <li>• Try not to cross any lines</li>
                <li>• Click on the correct sequence - errors will be alerted</li>
              </ul>
            </div>

            {/* Reset Button */}
            {!isComplete && userPath.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setUserPath([])
                    setLines([])
                    setCrossingErrors(0)
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
