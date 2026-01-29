/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG"
}

export class Logger {
  private static formatTimestamp(): string {
    return new Date().toISOString()
  }

  private static log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = this.formatTimestamp()
    const prefix = `[${timestamp}] [${level}]`
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(prefix, message, ...args)
        break
      case LogLevel.WARN:
        console.warn(prefix, message, ...args)
        break
      case LogLevel.DEBUG:
        if (process.env.DEBUG) {
          console.debug(prefix, message, ...args)
        }
        break
      default:
        console.log(prefix, message, ...args)
    }
  }

  static info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args)
  }

  static warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args)
  }

  static error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args)
  }

  static debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args)
  }
}
