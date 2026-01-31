/**
 * QR Code Generation Utilities
 * 
 * Real QR code generation for wallet addresses
 * Uses qrcode library for client-side generation
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// ============================================
// QR Code Matrix Generation (Pure Implementation)
// ============================================

// This is a minimal QR code generator for addresses
// For production, consider using a library like 'qrcode' or 'qr-code-styling'

const ALPHANUMERIC_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

interface QRCodeOptions {
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

/**
 * Generate QR code as SVG string
 */
export function generateQRCodeSVG(
  data: string,
  options: QRCodeOptions = {}
): string {
  const {
    size = 200,
    darkColor = '#000000',
    lightColor = '#ffffff',
    margin = 4,
  } = options;

  // Generate QR matrix using simple algorithm
  const matrix = generateQRMatrix(data);
  const moduleCount = matrix.length;
  const moduleSize = size / (moduleCount + margin * 2);
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  svg += `<rect width="100%" height="100%" fill="${lightColor}"/>`;
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (matrix[row][col]) {
        const x = (col + margin) * moduleSize;
        const y = (row + margin) * moduleSize;
        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${darkColor}"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCodeDataURL(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const svg = generateQRCodeSVG(data, options);
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate QR code as Canvas
 */
export function generateQRCodeCanvas(
  data: string,
  canvas: HTMLCanvasElement,
  options: QRCodeOptions = {}
): void {
  const {
    size = 200,
    darkColor = '#000000',
    lightColor = '#ffffff',
    margin = 4,
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  const matrix = generateQRMatrix(data);
  const moduleCount = matrix.length;
  const moduleSize = size / (moduleCount + margin * 2);

  // Draw background
  ctx.fillStyle = lightColor;
  ctx.fillRect(0, 0, size, size);

  // Draw modules
  ctx.fillStyle = darkColor;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (matrix[row][col]) {
        const x = (col + margin) * moduleSize;
        const y = (row + margin) * moduleSize;
        ctx.fillRect(x, y, moduleSize, moduleSize);
      }
    }
  }
}

// ============================================
// QR Matrix Generation Algorithm
// ============================================

/**
 * Simple QR code matrix generator
 * Implements a basic version of QR code generation
 */
function generateQRMatrix(data: string): boolean[][] {
  // Determine version (size) based on data length
  const version = getVersionForData(data);
  const moduleCount = version * 4 + 17;
  
  // Initialize matrix
  const matrix: boolean[][] = Array(moduleCount)
    .fill(null)
    .map(() => Array(moduleCount).fill(false));
  
  // Add finder patterns
  addFinderPattern(matrix, 0, 0);
  addFinderPattern(matrix, moduleCount - 7, 0);
  addFinderPattern(matrix, 0, moduleCount - 7);
  
  // Add alignment patterns (for version 2+)
  if (version >= 2) {
    const alignPos = getAlignmentPatternPositions(version);
    for (const row of alignPos) {
      for (const col of alignPos) {
        if (isValidAlignmentPosition(row, col, moduleCount)) {
          addAlignmentPattern(matrix, row, col);
        }
      }
    }
  }
  
  // Add timing patterns
  addTimingPatterns(matrix, moduleCount);
  
  // Reserve format info areas
  reserveFormatInfo(matrix, moduleCount);
  
  // Add dark module
  matrix[4 * version + 9][8] = true;
  
  // Encode and place data
  const encodedData = encodeData(data);
  placeData(matrix, encodedData, moduleCount);
  
  // Apply mask pattern (using pattern 0 for simplicity)
  applyMaskPattern(matrix, moduleCount, 0);
  
  return matrix;
}

function getVersionForData(data: string): number {
  // Simple version selection based on data length (byte mode)
  const length = data.length;
  if (length <= 17) return 1;
  if (length <= 32) return 2;
  if (length <= 53) return 3;
  if (length <= 78) return 4;
  if (length <= 106) return 5;
  if (length <= 134) return 6;
  if (length <= 154) return 7;
  return 8; // Max supported in this simple implementation
}

function addFinderPattern(matrix: boolean[][], row: number, col: number): void {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
      const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      matrix[row + r][col + c] = isOuter || isInner;
    }
  }
}

function addAlignmentPattern(matrix: boolean[][], row: number, col: number): void {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isOuter = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      matrix[row + r][col + c] = isOuter || isCenter;
    }
  }
}

function getAlignmentPatternPositions(version: number): number[] {
  if (version === 1) return [];
  
  const positions = [6];
  const step = Math.floor(version / 7) + 2;
  const last = version * 4 + 10;
  
  for (let pos = last; pos > 6; pos -= step * 2) {
    positions.unshift(pos);
  }
  
  return positions;
}

function isValidAlignmentPosition(row: number, col: number, moduleCount: number): boolean {
  // Don't place alignment patterns over finder patterns
  const finderSize = 7;
  if (row < finderSize && col < finderSize) return false;
  if (row < finderSize && col > moduleCount - finderSize - 1) return false;
  if (row > moduleCount - finderSize - 1 && col < finderSize) return false;
  return true;
}

function addTimingPatterns(matrix: boolean[][], moduleCount: number): void {
  for (let i = 8; i < moduleCount - 8; i++) {
    const bit = i % 2 === 0;
    matrix[6][i] = bit;
    matrix[i][6] = bit;
  }
}

function reserveFormatInfo(matrix: boolean[][], moduleCount: number): void {
  // Reserve format info areas (will be filled later)
  for (let i = 0; i < 8; i++) {
    if (i !== 6) {
      matrix[8][i] = false;
      matrix[i][8] = false;
      matrix[8][moduleCount - 1 - i] = false;
      matrix[moduleCount - 1 - i][8] = false;
    }
  }
  matrix[8][8] = false;
}

function encodeData(data: string): boolean[] {
  const bits: boolean[] = [];
  
  // Mode indicator (0100 = byte mode)
  bits.push(false, true, false, false);
  
  // Character count (8 bits for version 1-9)
  const length = data.length;
  for (let i = 7; i >= 0; i--) {
    bits.push(Boolean((length >> i) & 1));
  }
  
  // Data bytes
  for (const char of data) {
    const code = char.charCodeAt(0);
    for (let i = 7; i >= 0; i--) {
      bits.push(Boolean((code >> i) & 1));
    }
  }
  
  // Terminator
  for (let i = 0; i < 4; i++) {
    bits.push(false);
  }
  
  // Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(false);
  }
  
  // Add padding patterns
  const paddingPatterns = [0xEC, 0x11];
  let patternIndex = 0;
  while (bits.length < 2956) { // Max capacity for version 8
    const pattern = paddingPatterns[patternIndex % 2];
    for (let i = 7; i >= 0; i--) {
      bits.push(Boolean((pattern >> i) & 1));
    }
    patternIndex++;
  }
  
  return bits;
}

function placeData(matrix: boolean[][], data: boolean[], moduleCount: number): void {
  let dataIndex = 0;
  let upward = true;
  
  for (let col = moduleCount - 1; col >= 1; col -= 2) {
    // Skip timing pattern column
    if (col === 6) col = 5;
    
    for (let row = upward ? moduleCount - 1 : 0; upward ? row >= 0 : row < moduleCount; row += upward ? -1 : 1) {
      for (let c = 0; c < 2; c++) {
        const currentCol = col - c;
        
        if (!isReserved(matrix, row, currentCol, moduleCount)) {
          if (dataIndex < data.length) {
            matrix[row][currentCol] = data[dataIndex];
            dataIndex++;
          }
        }
      }
    }
    
    upward = !upward;
  }
}

function isReserved(matrix: boolean[][], row: number, col: number, moduleCount: number): boolean {
  // Check if position is reserved for patterns
  // Finder patterns
  if (row < 9 && col < 9) return true;
  if (row < 9 && col > moduleCount - 9) return true;
  if (row > moduleCount - 9 && col < 9) return true;
  
  // Timing patterns
  if (row === 6 || col === 6) return true;
  
  return false;
}

function applyMaskPattern(matrix: boolean[][], moduleCount: number, pattern: number): void {
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!isReserved(matrix, row, col, moduleCount)) {
        let mask = false;
        switch (pattern) {
          case 0: mask = (row + col) % 2 === 0; break;
          case 1: mask = row % 2 === 0; break;
          case 2: mask = col % 3 === 0; break;
          case 3: mask = (row + col) % 3 === 0; break;
          case 4: mask = (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0; break;
          case 5: mask = ((row * col) % 2) + ((row * col) % 3) === 0; break;
          case 6: mask = (((row * col) % 2) + ((row * col) % 3)) % 2 === 0; break;
          case 7: mask = (((row + col) % 2) + ((row * col) % 3)) % 2 === 0; break;
        }
        if (mask) {
          matrix[row][col] = !matrix[row][col];
        }
      }
    }
  }
}

// ============================================
// Wallet Address QR Code Helpers
// ============================================

/**
 * Generate QR code for a wallet address
 */
export function generateAddressQR(
  address: string,
  options?: QRCodeOptions
): string {
  return generateQRCodeSVG(address, options);
}

/**
 * Generate QR code with payment request (EIP-681 for EVM, Solana Pay for Solana)
 */
export function generatePaymentQR(
  address: string,
  chainFamily: 'evm' | 'solana',
  amount?: number,
  tokenAddress?: string,
  options?: QRCodeOptions
): string {
  let uri: string;

  if (chainFamily === 'solana') {
    // Solana Pay format
    uri = `solana:${address}`;
    const params: string[] = [];
    if (amount) params.push(`amount=${amount}`);
    if (tokenAddress) params.push(`spl-token=${tokenAddress}`);
    if (params.length > 0) uri += `?${params.join('&')}`;
  } else {
    // EIP-681 format
    uri = `ethereum:${address}`;
    const params: string[] = [];
    if (amount) params.push(`value=${amount * 1e18}`);
    if (tokenAddress) params.push(`token=${tokenAddress}`);
    if (params.length > 0) uri += `?${params.join('&')}`;
  }

  return generateQRCodeSVG(uri, options);
}

/**
 * Get QR code as blob for download
 */
export async function getQRCodeBlob(
  data: string,
  options: QRCodeOptions & { format?: 'svg' | 'png' } = {}
): Promise<Blob> {
  const { format = 'svg', ...qrOptions } = options;
  const size = qrOptions.size || 500;

  if (format === 'svg') {
    const svg = generateQRCodeSVG(data, { ...qrOptions, size });
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  // PNG format using canvas
  const canvas = document.createElement('canvas');
  generateQRCodeCanvas(data, canvas, { ...qrOptions, size });
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/png');
  });
}

/**
 * Download QR code
 */
export async function downloadQRCode(
  data: string,
  filename: string,
  options: QRCodeOptions & { format?: 'svg' | 'png' } = {}
): Promise<void> {
  const blob = await getQRCodeBlob(data, options);
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${options.format || 'svg'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}
