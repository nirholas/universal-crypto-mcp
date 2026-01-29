// Type declarations for analytics integrations
declare global {
  interface Window {
    va?: (event: string, name: string, properties?: Record<string, any>) => void
    gtag?: (command: string, eventName: string, properties?: Record<string, any>) => void
  }
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  // Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', eventName, properties)
  }
  
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
  
  // Custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event: eventName, properties }),
      keepalive: true,
    }).catch(() => {
      // Silently fail if analytics endpoint is not available
    })
  }
}

// Predefined events
export const analytics = {
  // Page views
  pageView: (path: string) => {
    trackEvent('page_view', { path })
  },
  
  // Conversions
  signUp: (method: string) => {
    trackEvent('sign_up', { method })
  },
  
  deploy: (platform: string) => {
    trackEvent('deploy', { platform })
  },
  
  // Engagement
  playgroundRun: (chain: string, toolsUsed: string[]) => {
    trackEvent('playground_run', { chain, tools_used: toolsUsed })
  },
  
  documentationView: (slug: string, timeOnPage: number) => {
    trackEvent('documentation_view', { slug, time_on_page: timeOnPage })
  },
  
  // Revenue
  apiCall: (endpoint: string, price: number) => {
    trackEvent('api_call', { endpoint, price })
  },
}
