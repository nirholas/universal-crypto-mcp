import sharp from 'sharp'

export async function optimizeImage(
  input: Buffer,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'png'
  }
) {
  let pipeline = sharp(input)
  
  if (options.width || options.height) {
    pipeline = pipeline.resize(options.width, options.height, {
      fit: 'cover',
      position: 'center',
    })
  }
  
  switch (options.format || 'webp') {
    case 'avif':
      pipeline = pipeline.avif({ quality: options.quality || 80 })
      break
    case 'webp':
      pipeline = pipeline.webp({ quality: options.quality || 85 })
      break
    case 'png':
      pipeline = pipeline.png({ quality: options.quality || 90 })
      break
  }
  
  return pipeline.toBuffer()
}

// Generate responsive image srcset
export function generateSrcSet(baseUrl: string, widths: number[]) {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ')
}
