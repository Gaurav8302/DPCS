import { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

const IDLE_TIMEOUT = 60000 // 60 seconds

export default function IdleAlert() {
  const [isIdle, setIsIdle] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now())
      setIsIdle(false)
    }

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    // Check for idle state
    const checkIdle = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity
      if (timeSinceLastActivity >= IDLE_TIMEOUT) {
        setIsIdle(true)
      }
    }, 1000)

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      clearInterval(checkIdle)
    }
  }, [lastActivity])

  const dismissAlert = () => {
    setIsIdle(false)
    setLastActivity(Date.now())
  }

  if (!isIdle) return null

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 animate-flash-red"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6" />
          <span className="font-semibold text-lg">
            Are you still there? Please interact with the page to continue.
          </span>
        </div>
        <button
          onClick={dismissAlert}
          className="p-2 hover:bg-red-700 rounded-lg transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
