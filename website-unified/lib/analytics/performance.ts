// Web Vitals tracking
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

export function trackWebVitals() {
  onCLS(metric => sendToAnalytics('CLS', metric))
  onFID(metric => sendToAnalytics('FID', metric))
  onFCP(metric => sendToAnalytics('FCP', metric))
  onLCP(metric => sendToAnalytics('LCP', metric))
  onTTFB(metric => sendToAnalytics('TTFB', metric))
}

function sendToAnalytics(name: string, metric: any) {
  // Send to Vercel Analytics
  if (window.va) {
    window.va('event', 'web-vital', {
      name,
      value: metric.value,
      rating: metric.rating,
      page: window.location.pathname,
    })
  }
  
  // Also send to custom analytics
  fetch('/api/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify({ name, metric }),
    keepalive: true,
  }).catch(() => {})
}
