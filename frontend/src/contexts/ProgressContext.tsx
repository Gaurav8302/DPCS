import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ProgressContextType {
  sessionId: string | null
  userId: string | null
  completedSections: string[]
  totalScore: number
  sectionScores: Record<string, number>
  setSessionId: (id: string) => void
  setUserId: (id: string) => void
  markSectionComplete: (section: string, score: number) => void
  updateTotalScore: (score: number) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return context
}

interface ProgressProviderProps {
  children: ReactNode
}

export default function ProgressProvider({ children }: ProgressProviderProps) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('dimentia_session_id')
    const savedUserId = localStorage.getItem('dimentia_user_id')
    const savedCompleted = localStorage.getItem('dimentia_completed_sections')
    const savedScore = localStorage.getItem('dimentia_total_score')
    const savedSectionScores = localStorage.getItem('dimentia_section_scores')

    if (savedSessionId) setSessionId(savedSessionId)
    if (savedUserId) setUserId(savedUserId)
    if (savedCompleted) setCompletedSections(JSON.parse(savedCompleted))
    if (savedScore) setTotalScore(parseFloat(savedScore))
    if (savedSectionScores) setSectionScores(JSON.parse(savedSectionScores))
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (sessionId) localStorage.setItem('dimentia_session_id', sessionId)
    if (userId) localStorage.setItem('dimentia_user_id', userId)
    localStorage.setItem('dimentia_completed_sections', JSON.stringify(completedSections))
    localStorage.setItem('dimentia_total_score', totalScore.toString())
    localStorage.setItem('dimentia_section_scores', JSON.stringify(sectionScores))
  }, [sessionId, userId, completedSections, totalScore, sectionScores])

  const markSectionComplete = (section: string, score: number) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section])
    }
    setSectionScores({ ...sectionScores, [section]: score })
  }

  const updateTotalScore = (score: number) => {
    setTotalScore(score)
  }

  const resetProgress = () => {
    setSessionId(null)
    setUserId(null)
    setCompletedSections([])
    setTotalScore(0)
    setSectionScores({})
    localStorage.removeItem('dimentia_session_id')
    localStorage.removeItem('dimentia_user_id')
    localStorage.removeItem('dimentia_completed_sections')
    localStorage.removeItem('dimentia_total_score')
    localStorage.removeItem('dimentia_section_scores')
  }

  return (
    <ProgressContext.Provider
      value={{
        sessionId,
        userId,
        completedSections,
        totalScore,
        sectionScores,
        setSessionId,
        setUserId,
        markSectionComplete,
        updateTotalScore,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
