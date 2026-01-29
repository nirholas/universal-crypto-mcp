import winston from 'winston';
import { config } from './config.js';

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    const log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    return stack ? `${log}\n${stack}` : log;
  })
);

export const logger = winston.createLogger({
  level: config.logLevel,
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

export class TelegramNotifier {
  private botToken?: string;
  private chatId?: string;

  constructor() {
    this.botToken = config.telegramBotToken;
    this.chatId = config.telegramChatId;
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.botToken || !this.chatId) {
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        logger.warn('Failed to send Telegram notification');
      }
    } catch (error) {
      logger.error('Telegram notification error:', error);
    }
  }

  async notifyTrade(trade: { type: string; token: string; price: number; amount: number; pnl?: number }): Promise<void> {
    const emoji = trade.type === 'BUY' ? '🟢' : '🔴';
    const pnlText = trade.pnl !== undefined ? `\nP&L: ${trade.pnl > 0 ? '✅' : '❌'} $${trade.pnl.toFixed(2)} (${((trade.pnl / (trade.price * trade.amount)) * 100).toFixed(2)}%)` : '';
    
    const message = `${emoji} <b>${trade.type}</b> ${trade.token}\n` +
      `Price: $${trade.price.toFixed(6)}\n` +
      `Amount: ${trade.amount.toFixed(4)}\n` +
      `Value: $${(trade.price * trade.amount).toFixed(2)}${pnlText}`;

    await this.sendMessage(message);
  }

  async notifyAlert(alert: string): Promise<void> {
    await this.sendMessage(`⚠️ <b>Alert</b>\n${alert}`);
  }
}

export const notifier = new TelegramNotifier();
