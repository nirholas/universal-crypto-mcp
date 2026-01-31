/**
 * @file index.ts
 * @description Unified notification service (email, push, webhook)
 * @author nirholas
 */

export interface NotificationPayload {
  type: 'email' | 'push' | 'webhook';
  recipient: string;
  subject?: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Send email notification via SendGrid/Resend
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Notifications] No email API key configured');
    return false;
  }

  try {
    // SendGrid API
    if (process.env.SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.FROM_EMAIL || 'noreply@ucm.cash' },
          subject,
          content: [{ type: 'text/plain', value: body }],
        }),
      });
      return response.ok;
    }

    // Resend API
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'noreply@ucm.cash',
          to,
          subject,
          text: body,
        }),
      });
      return response.ok;
    }

    return false;
  } catch (error) {
    console.error('[Notifications] Email failed:', error);
    return false;
  }
}

/**
 * Send webhook notification
 */
export async function sendWebhook(
  url: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok;
  } catch (error) {
    console.error('[Notifications] Webhook failed:', error);
    return false;
  }
}

/**
 * Send push notification via web-push
 */
export async function sendPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  message: string
): Promise<boolean> {
  try {
    // Requires web-push package
    const webpush = await import('web-push');
    
    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY || '',
      privateKey: process.env.VAPID_PRIVATE_KEY || '',
    };

    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      console.warn('[Notifications] VAPID keys not configured');
      return false;
    }

    webpush.setVapidDetails(
      'mailto:admin@ucm.cash',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    await webpush.sendNotification(subscription, message);
    return true;
  } catch (error) {
    console.error('[Notifications] Push failed:', error);
    return false;
  }
}

/**
 * Unified notification sender
 */
export async function notify(payload: NotificationPayload): Promise<boolean> {
  switch (payload.type) {
    case 'email':
      return sendEmail(payload.recipient, payload.subject || 'Notification', payload.message);
    case 'webhook':
      return sendWebhook(payload.recipient, { message: payload.message, ...payload.data });
    case 'push':
      console.warn('[Notifications] Push requires subscription object');
      return false;
    default:
      return false;
  }
}

export default { sendEmail, sendWebhook, sendPush, notify };
