'use client'

import { useEffect } from 'react'
import { analytics } from '@/lib/analytics/events'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track initial page view
    analytics.pageView(window.location.pathname)
    
    // Track page visibility for time on page
    let startTime = Date.now()
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeOnPage = Math.floor((Date.now() - startTime) / 1000)
        if (timeOnPage > 5) { // Only track if user spent more than 5 seconds
          analytics.documentationView(window.location.pathname, timeOnPage)
        }
      } else {
        startTime = Date.now()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  
  return <>{children}</>
}
