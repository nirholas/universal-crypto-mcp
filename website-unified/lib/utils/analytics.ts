export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return
  
  // Add timestamp if not provided
  const eventWithTimestamp = {
    ...event,
    timestamp: event.timestamp || Date.now(),
  }
  
  // Send to analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventWithTimestamp),
    }).catch((err) => {
      console.error('Failed to track event:', err)
    })
  } else {
    console.log('[Analytics]', eventWithTimestamp)
  }
}

export function trackPageView(path: string) {
  trackEvent({
    name: 'page_view',
    properties: {
      path,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    },
  })
}
