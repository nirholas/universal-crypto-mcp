'use server';

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SSE stream endpoint for real-time alerts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      const sendEvent = (event: string, data: unknown) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send keepalive every 30 seconds
      const keepaliveInterval = setInterval(() => {
        try {
          sendEvent('ping', { timestamp: new Date().toISOString() });
        } catch {
          clearInterval(keepaliveInterval);
        }
      }, 30000);

      // Subscribe to notification service for real-time events
      const subscribeToNotifications = async () => {
        try {
          // Create WebSocket or long-polling connection to notification service
          const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL;
          const apiKey = process.env.NOTIFICATION_SERVICE_API_KEY;

          // Option 1: Redis Pub/Sub
          if (process.env.REDIS_URL) {
            const { createClient } = await import('redis');
            const subscriber = createClient({ url: process.env.REDIS_URL });
            await subscriber.connect();
            
            const channel = `alerts:${userId}`;
            await subscriber.subscribe(channel, (message) => {
              try {
                const alert = JSON.parse(message);
                sendEvent('alert', alert);
              } catch (e) {
                console.error('Failed to parse alert message:', e);
              }
            });

            // Clean up on close
            request.signal.addEventListener('abort', () => {
              subscriber.unsubscribe(channel);
              subscriber.disconnect();
              clearInterval(keepaliveInterval);
              controller.close();
            });
          } 
          // Option 2: Poll the notification service
          else if (notificationServiceUrl && apiKey) {
            let lastEventId: string | null = null;
            
            const pollInterval = setInterval(async () => {
              try {
                const url = new URL(`${notificationServiceUrl}/api/v1/alerts/poll`);
                url.searchParams.set('userId', userId);
                if (lastEventId) {
                  url.searchParams.set('since', lastEventId);
                }

                const response = await fetch(url.toString(), {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                  },
                });

                if (response.ok) {
                  const { alerts, lastId } = await response.json();
                  lastEventId = lastId || lastEventId;
                  
                  for (const alert of alerts) {
                    sendEvent('alert', alert);
                  }
                }
              } catch (e) {
                console.error('Failed to poll for alerts:', e);
              }
            }, 5000); // Poll every 5 seconds

            request.signal.addEventListener('abort', () => {
              clearInterval(pollInterval);
              clearInterval(keepaliveInterval);
              controller.close();
            });
          }
          // Option 3: In-memory for development
          else {
            // For development, just keep the connection alive
            request.signal.addEventListener('abort', () => {
              clearInterval(keepaliveInterval);
              controller.close();
            });
          }

          // Send connected event
          sendEvent('connected', { 
            userId,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to subscribe to notifications:', error);
          sendEvent('error', { message: 'Failed to subscribe to notifications' });
        }
      };

      subscribeToNotifications();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}
