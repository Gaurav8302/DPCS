import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import IdleAlert from '@/components/IdleAlert'
import ProgressProvider from '@/contexts/ProgressContext'

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  
  useEffect(() => {
    // Prevent copy-paste globally (can be overridden per component)
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      if (target.dataset.allowCopy !== 'true') {
        e.preventDefault()
      }
    }
    
    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCopy)
    document.addEventListener('paste', handleCopy)
    
    return () => {
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCopy)
      document.removeEventListener('paste', handleCopy)
    }
  }, [])
  
  return (
    <SessionProvider session={session}>
      <ProgressProvider>
        <IdleAlert />
        <Component {...pageProps} />
      </ProgressProvider>
    </SessionProvider>
  )
}
