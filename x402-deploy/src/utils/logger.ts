/**
 * Logger Utilities - Consistent logging with levels and formatting
 * Professional CLI output management
 */

import chalk from "chalk";

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

interface LogOptions {
  timestamp?: boolean;
  prefix?: string;
  indent?: number;
}

const LOG_SYMBOLS = {
  debug: chalk.dim("⚙"),
  info: chalk.blue("ℹ"),
  warn: chalk.yellow("⚠"),
  error: chalk.red("✖"),
  success: chalk.green("✓"),
};

const LOG_COLORS = {
  debug: chalk.dim,
  info: chalk.white,
  warn: chalk.yellow,
  error: chalk.red,
  success: chalk.green,
};

class Logger {
  private level: LogLevel = "info";
  private silent: boolean = false;
  private defaultOptions: LogOptions = {};

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Enable/disable all output
   */
  setSilent(silent: boolean): void {
    this.silent = silent;
  }

  /**
   * Set default options
   */
  setDefaults(options: LogOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.silent) return false;

    const levels: LogLevel[] = ["debug", "info", "warn", "error", "success"];
    const currentIndex = levels.indexOf(this.level);
    const targetIndex = levels.indexOf(level);

    return targetIndex >= currentIndex || level === "success";
  }

  /**
   * Format and output a log message
   */
  private log(level: LogLevel, message: string, options: LogOptions = {}): void {
    if (!this.shouldLog(level)) return;

    const opts = { ...this.defaultOptions, ...options };
    const symbol = LOG_SYMBOLS[level];
    const color = LOG_COLORS[level];

    let output = "";

    // Indent
    if (opts.indent) {
      output += "  ".repeat(opts.indent);
    }

    // Timestamp
    if (opts.timestamp) {
      const time = new Date().toISOString().split("T")[1].slice(0, 8);
      output += chalk.dim(`[${time}] `);
    }

    // Prefix
    if (opts.prefix) {
      output += chalk.dim(`[${opts.prefix}] `);
    }

    // Symbol and message
    output += `${symbol} ${color(message)}`;

    console.log(output);
  }

  /**
   * Debug level logging
   */
  debug(message: string, options?: LogOptions): void {
    this.log("debug", message, options);
  }

  /**
   * Info level logging
   */
  info(message: string, options?: LogOptions): void {
    this.log("info", message, options);
  }

  /**
   * Warning level logging
   */
  warn(message: string, options?: LogOptions): void {
    this.log("warn", message, options);
  }

  /**
   * Error level logging
   */
  error(message: string, options?: LogOptions): void {
    this.log("error", message, options);
  }

  /**
   * Success level logging
   */
  success(message: string, options?: LogOptions): void {
    this.log("success", message, options);
  }

  /**
   * Log without prefix (raw output)
   */
  raw(message: string): void {
    if (!this.silent) {
      console.log(message);
    }
  }

  /**
   * Empty line
   */
  newline(): void {
    if (!this.silent) {
      console.log();
    }
  }

  /**
   * Section header
   */
  section(title: string): void {
    if (this.silent) return;
    console.log();
    console.log(chalk.bold(title));
    console.log(chalk.dim("─".repeat(title.length)));
  }

  /**
   * Subsection header
   */
  subsection(title: string): void {
    if (this.silent) return;
    console.log();
    console.log(chalk.cyan(`▶ ${title}`));
  }

  /**
   * Step in a process
   */
  step(current: number, total: number, message: string): void {
    if (this.silent) return;
    const progress = chalk.dim(`[${current}/${total}]`);
    console.log(`  ${progress} ${message}`);
  }

  /**
   * Bullet point
   */
  bullet(message: string, color: string = "white"): void {
    if (this.silent) return;
    const colorFn = (chalk as any)[color] || chalk.white;
    console.log(`  ${chalk.dim("•")} ${colorFn(message)}`);
  }

  /**
   * Key-value pair
   */
  kv(key: string, value: string, options?: { keyWidth?: number; valueColor?: string }): void {
    if (this.silent) return;
    const keyWidth = options?.keyWidth || 15;
    const colorFn = (chalk as any)[options?.valueColor || "white"] || chalk.white;
    console.log(`  ${chalk.dim((key + ":").padEnd(keyWidth))}${colorFn(value)}`);
  }

  /**
   * Table
   */
  table(rows: string[][], options?: { header?: boolean; columnWidths?: number[] }): void {
    if (this.silent) return;

    const { header = true, columnWidths } = options || {};

    // Calculate column widths if not provided
    const widths = columnWidths || rows[0].map((_, i) => 
      Math.max(...rows.map(row => (row[i] || "").length))
    );

    rows.forEach((row, rowIndex) => {
      const formatted = row.map((cell, i) => {
        const width = widths[i] || cell.length;
        const padded = (cell || "").padEnd(width);
        return rowIndex === 0 && header ? chalk.bold(padded) : padded;
      }).join("  ");

      console.log(`  ${formatted}`);

      // Add separator after header
      if (rowIndex === 0 && header) {
        console.log(chalk.dim("  " + widths.map(w => "─".repeat(w)).join("──")));
      }
    });
  }

  /**
   * Code block
   */
  code(code: string, language?: string): void {
    if (this.silent) return;
    console.log();
    console.log(chalk.dim("```" + (language || "")));
    console.log(chalk.cyan(code));
    console.log(chalk.dim("```"));
  }

  /**
   * Command to run
   */
  command(cmd: string): void {
    if (this.silent) return;
    console.log();
    console.log(`  ${chalk.dim("$")} ${chalk.yellow(cmd)}`);
    console.log();
  }

  /**
   * Link
   */
  link(text: string, url: string): void {
    if (this.silent) return;
    console.log(`  ${chalk.cyan(text)}: ${chalk.underline(url)}`);
  }

  /**
   * Boxed message
   */
  box(message: string, options?: { title?: string; type?: "info" | "warn" | "error" | "success" }): void {
    if (this.silent) return;

    const { title, type = "info" } = options || {};
    const colors = {
      info: "cyan",
      warn: "yellow",
      error: "red",
      success: "green",
    };
    const color = (chalk as any)[colors[type]];

    const lines = message.split("\n");
    const maxWidth = Math.max(...lines.map(l => l.length), (title || "").length);
    const paddedWidth = maxWidth + 4;

    console.log();
    console.log(color("╭" + "─".repeat(paddedWidth) + "╮"));
    
    if (title) {
      console.log(color("│") + chalk.bold(` ${title.padEnd(paddedWidth - 1)}`) + color("│"));
      console.log(color("├" + "─".repeat(paddedWidth) + "┤"));
    }
    
    for (const line of lines) {
      console.log(color("│") + `  ${line.padEnd(paddedWidth - 3)} ` + color("│"));
    }
    
    console.log(color("╰" + "─".repeat(paddedWidth) + "╯"));
    console.log();
  }

  /**
   * Spinner-like progress (for non-animated contexts)
   */
  progress(message: string): void {
    if (this.silent) return;
    process.stdout.write(`  ${chalk.cyan("◌")} ${message}...`);
  }

  /**
   * Complete a progress line
   */
  progressDone(success: boolean = true): void {
    if (this.silent) return;
    const symbol = success ? chalk.green(" ✓") : chalk.red(" ✗");
    console.log(symbol);
  }

  /**
   * Create a child logger with prefix
   */
  child(prefix: string): Logger {
    const child = new Logger();
    child.level = this.level;
    child.silent = this.silent;
    child.defaultOptions = { ...this.defaultOptions, prefix };
    return child;
  }

  /**
   * Group related logs
   */
  group(title: string, fn: () => void): void {
    if (this.silent) {
      fn();
      return;
    }

    console.log();
    console.log(chalk.bold(`▸ ${title}`));
    const originalIndent = this.defaultOptions.indent || 0;
    this.defaultOptions.indent = originalIndent + 1;
    fn();
    this.defaultOptions.indent = originalIndent;
  }
}

// Export singleton instance
export const logger = new Logger();

// Also export class for creating new instances
export { Logger };
