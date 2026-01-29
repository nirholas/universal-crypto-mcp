/**
 * Format Utilities - Text formatting, tables, and display helpers
 * Beautiful CLI output utilities
 */

import chalk from "chalk";

export interface TableColumn {
  key: string;
  header: string;
  width?: number;
  align?: "left" | "right" | "center";
  format?: (value: any) => string;
  color?: (value: any) => chalk.Chalk;
}

export interface BoxOptions {
  title?: string;
  padding?: number;
  borderColor?: string;
  borderStyle?: "single" | "double" | "rounded";
}

const BORDERS = {
  single: {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
    cross: "┼",
    topCross: "┬",
    bottomCross: "┴",
    leftCross: "├",
    rightCross: "┤",
  },
  double: {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║",
    cross: "╬",
    topCross: "╦",
    bottomCross: "╩",
    leftCross: "╠",
    rightCross: "╣",
  },
  rounded: {
    topLeft: "╭",
    topRight: "╮",
    bottomLeft: "╰",
    bottomRight: "╯",
    horizontal: "─",
    vertical: "│",
    cross: "┼",
    topCross: "┬",
    bottomCross: "┴",
    leftCross: "├",
    rightCross: "┤",
  },
};

/**
 * Create a formatted table string
 */
export function createTable(columns: TableColumn[], rows: any[]): string {
  // Calculate column widths
  const widths = columns.map(col => {
    if (col.width) return col.width;
    
    const headerLen = col.header.length;
    const maxDataLen = Math.max(
      ...rows.map(row => {
        const value = row[col.key];
        const formatted = col.format ? col.format(value) : String(value ?? "");
        return stripAnsi(formatted).length;
      })
    );
    
    return Math.max(headerLen, maxDataLen, 3);
  });

  const lines: string[] = [];
  const border = BORDERS.single;

  // Top border
  lines.push(
    border.topLeft +
    widths.map(w => border.horizontal.repeat(w + 2)).join(border.topCross) +
    border.topRight
  );

  // Header row
  lines.push(
    border.vertical +
    columns.map((col, i) => {
      const padded = alignText(col.header, widths[i], col.align || "left");
      return ` ${chalk.bold(padded)} `;
    }).join(border.vertical) +
    border.vertical
  );

  // Header separator
  lines.push(
    border.leftCross +
    widths.map(w => border.horizontal.repeat(w + 2)).join(border.cross) +
    border.rightCross
  );

  // Data rows
  for (const row of rows) {
    lines.push(
      border.vertical +
      columns.map((col, i) => {
        const value = row[col.key];
        let formatted = col.format ? col.format(value) : String(value ?? "");
        const colorFn = col.color ? col.color(value) : chalk.white;
        const displayLen = stripAnsi(formatted).length;
        const padding = widths[i] - displayLen;
        
        if (col.align === "right") {
          formatted = " ".repeat(padding) + formatted;
        } else if (col.align === "center") {
          const leftPad = Math.floor(padding / 2);
          const rightPad = padding - leftPad;
          formatted = " ".repeat(leftPad) + formatted + " ".repeat(rightPad);
        } else {
          formatted = formatted + " ".repeat(padding);
        }
        
        return ` ${colorFn(formatted)} `;
      }).join(border.vertical) +
      border.vertical
    );
  }

  // Bottom border
  lines.push(
    border.bottomLeft +
    widths.map(w => border.horizontal.repeat(w + 2)).join(border.bottomCross) +
    border.bottomRight
  );

  return lines.join("\n");
}

/**
 * Create a box around text
 */
export function createBox(content: string, options: BoxOptions = {}): string {
  const { 
    title, 
    padding = 1, 
    borderColor = "cyan",
    borderStyle = "rounded" 
  } = options;

  const border = BORDERS[borderStyle];
  const colorFn = (chalk as any)[borderColor] || chalk.white;
  
  const contentLines = content.split("\n");
  const maxWidth = Math.max(
    ...contentLines.map(line => stripAnsi(line).length),
    title ? stripAnsi(title).length + 4 : 0
  );

  const lines: string[] = [];
  const innerWidth = maxWidth + padding * 2;

  // Top border with optional title
  if (title) {
    const titleLen = stripAnsi(title).length;
    const leftLen = Math.floor((innerWidth - titleLen - 2) / 2);
    const rightLen = innerWidth - titleLen - 2 - leftLen;
    
    lines.push(
      colorFn(border.topLeft) +
      colorFn(border.horizontal.repeat(leftLen)) +
      ` ${chalk.bold(title)} ` +
      colorFn(border.horizontal.repeat(rightLen)) +
      colorFn(border.topRight)
    );
  } else {
    lines.push(
      colorFn(border.topLeft) +
      colorFn(border.horizontal.repeat(innerWidth)) +
      colorFn(border.topRight)
    );
  }

  // Padding top
  for (let i = 0; i < padding; i++) {
    lines.push(
      colorFn(border.vertical) +
      " ".repeat(innerWidth) +
      colorFn(border.vertical)
    );
  }

  // Content lines
  for (const line of contentLines) {
    const displayLen = stripAnsi(line).length;
    const rightPad = maxWidth - displayLen;
    
    lines.push(
      colorFn(border.vertical) +
      " ".repeat(padding) +
      line +
      " ".repeat(rightPad + padding) +
      colorFn(border.vertical)
    );
  }

  // Padding bottom
  for (let i = 0; i < padding; i++) {
    lines.push(
      colorFn(border.vertical) +
      " ".repeat(innerWidth) +
      colorFn(border.vertical)
    );
  }

  // Bottom border
  lines.push(
    colorFn(border.bottomLeft) +
    colorFn(border.horizontal.repeat(innerWidth)) +
    colorFn(border.bottomRight)
  );

  return lines.join("\n");
}

/**
 * Create a progress bar
 */
export function progressBar(
  current: number, 
  total: number, 
  width: number = 30,
  options: {
    showPercentage?: boolean;
    filledChar?: string;
    emptyChar?: string;
    filledColor?: string;
    emptyColor?: string;
  } = {}
): string {
  const {
    showPercentage = true,
    filledChar = "█",
    emptyChar = "░",
    filledColor = "cyan",
    emptyColor = "dim",
  } = options;

  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  const filledFn = (chalk as any)[filledColor] || chalk.white;
  const emptyFn = (chalk as any)[emptyColor] || chalk.dim;

  let bar = filledFn(filledChar.repeat(filled)) + emptyFn(emptyChar.repeat(empty));
  
  if (showPercentage) {
    bar += ` ${percentage.toFixed(0)}%`;
  }

  return bar;
}

/**
 * Create a sparkline chart
 */
export function sparkline(values: number[], options: {
  width?: number;
  color?: string;
} = {}): string {
  const { width = values.length, color = "cyan" } = options;
  const bars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  
  if (values.length === 0) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Resample if needed
  const resampled = resampleArray(values, width);

  const colorFn = (chalk as any)[color] || chalk.white;
  return resampled.map(v => {
    const index = Math.floor(((v - min) / range) * (bars.length - 1));
    return colorFn(bars[index]);
  }).join("");
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`;
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

/**
 * Format relative time
 */
export function formatRelative(date: Date | string | number): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;

  if (diff < 0) return "in the future";
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
  if (diff < 2592000000) return `${Math.floor(diff / 604800000)} weeks ago`;
  
  return new Date(date).toLocaleDateString();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number, ellipsis: string = "…"): string {
  if (stripAnsi(str).length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Align text within width
 */
export function alignText(text: string, width: number, align: "left" | "right" | "center" = "left"): string {
  const len = stripAnsi(text).length;
  if (len >= width) return text;

  const padding = width - len;

  switch (align) {
    case "right":
      return " ".repeat(padding) + text;
    case "center":
      const leftPad = Math.floor(padding / 2);
      return " ".repeat(leftPad) + text + " ".repeat(padding - leftPad);
    default:
      return text + " ".repeat(padding);
  }
}

/**
 * Strip ANSI codes from string
 */
export function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "");
}

/**
 * Resample array to new length
 */
function resampleArray(arr: number[], newLength: number): number[] {
  if (arr.length === newLength) return arr;
  if (arr.length === 0) return new Array(newLength).fill(0);

  const result: number[] = [];
  const ratio = arr.length / newLength;

  for (let i = 0; i < newLength; i++) {
    const index = Math.floor(i * ratio);
    result.push(arr[index]);
  }

  return result;
}

/**
 * Create indented list
 */
export function bulletList(items: string[], options: {
  indent?: number;
  bullet?: string;
  bulletColor?: string;
} = {}): string {
  const { indent = 2, bullet = "•", bulletColor = "cyan" } = options;
  const colorFn = (chalk as any)[bulletColor] || chalk.white;
  const prefix = " ".repeat(indent);

  return items.map(item => `${prefix}${colorFn(bullet)} ${item}`).join("\n");
}

/**
 * Create key-value display
 */
export function keyValue(obj: Record<string, any>, options: {
  keyWidth?: number;
  keyColor?: string;
  valueColor?: string;
  indent?: number;
} = {}): string {
  const { 
    keyWidth = 15, 
    keyColor = "dim", 
    valueColor = "white",
    indent = 2 
  } = options;

  const keyFn = (chalk as any)[keyColor] || chalk.dim;
  const valueFn = (chalk as any)[valueColor] || chalk.white;
  const prefix = " ".repeat(indent);

  return Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([key, value]) => {
      const formattedKey = keyFn((key + ":").padEnd(keyWidth));
      const formattedValue = valueFn(String(value));
      return `${prefix}${formattedKey}${formattedValue}`;
    })
    .join("\n");
}
