import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// User endpoints
export const createUser = async (userData: {
  email: string
  name: string
  education_years: number
}) => {
  const response = await api.post('/api/users', userData)
  return response.data
}

export const getUser = async (userId: string) => {
  const response = await api.get(`/api/users/${userId}`)
  return response.data
}

export const getUserByEmail = async (email: string) => {
  const response = await api.get(`/api/users/email/${email}`)
  return response.data
}

// Session endpoints
export const createSession = async (userId: string) => {
  const response = await api.post('/api/sessions', { user_id: userId })
  return response.data
}

export const getSession = async (sessionId: string) => {
  const response = await api.get(`/api/sessions/${sessionId}`)
  return response.data
}

export const updateSession = async (sessionId: string, data: any) => {
  const response = await api.put(`/api/sessions/${sessionId}`, data)
  return response.data
}

// Scoring endpoints
export const submitTrailMaking = async (data: any) => {
  const response = await api.post('/api/score/trail-making', data)
  return response.data
}

export const submitCubeCopy = async (data: any) => {
  const response = await api.post('/api/score/cube-copy', data)
  return response.data
}

export const submitClockDrawing = async (data: any) => {
  const response = await api.post('/api/score/clock-drawing', data)
  return response.data
}

export const submitNaming = async (data: any) => {
  const response = await api.post('/api/score/naming', data)
  return response.data
}

export const submitAttentionForward = async (data: any) => {
  const response = await api.post('/api/score/attention/forward', data)
  return response.data
}

export const submitAttentionBackward = async (data: any) => {
  const response = await api.post('/api/score/attention/backward', data)
  return response.data
}

export const submitAttentionVigilance = async (data: any) => {
  const response = await api.post('/api/score/attention/vigilance', data)
  return response.data
}

export const submitSentenceRepetition = async (data: any) => {
  const response = await api.post('/api/score/language/sentence-repetition', data)
  return response.data
}

export const submitVerbalFluency = async (data: any) => {
  const response = await api.post('/api/score/language/verbal-fluency', data)
  return response.data
}

export const submitAbstraction = async (data: any) => {
  const response = await api.post('/api/score/abstraction', data)
  return response.data
}

export const submitDelayedRecall = async (data: any) => {
  const response = await api.post('/api/score/delayed-recall', data)
  return response.data
}

// Verification endpoints
export const verifyLocation = async (data: any) => {
  const response = await api.post('/api/verify/location', data)
  return response.data
}

export const verifyDateTime = async (data: any) => {
  const response = await api.post('/api/verify/datetime', data)
  return response.data
}

// Results endpoints
export const getResults = async (sessionId: string) => {
  const response = await api.get(`/api/results/${sessionId}`)
  return response.data
}

export const getUserHistory = async (userId: string) => {
  const response = await api.get(`/api/results/user/${userId}/history`)
  return response.data
}

export default api
