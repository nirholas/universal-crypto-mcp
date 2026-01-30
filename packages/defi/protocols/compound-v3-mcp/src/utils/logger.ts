/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

export class Logger {
  static info(...args: any[]) {
    console.error("[INFO]", ...args)
  }

  static error(...args: any[]) {
    console.error("[ERROR]", ...args)
  }

  static warn(...args: any[]) {
    console.error("[WARN]", ...args)
  }

  static debug(...args: any[]) {
    if (process.env.DEBUG) {
      console.error("[DEBUG]", ...args)
    }
  }
}
