// ImageKit configuration for client-side usage
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
}

// Helper to build ImageKit URLs with transformations
export function getImageUrl(
  path: string,
  options?: {
    width?: number
    height?: number
    quality?: number
  }
) {
  const { width, height, quality = 80 } = options || {}

  let transformations = `q-${quality}`
  if (width) transformations += `,w-${width}`
  if (height) transformations += `,h-${height}`

  return `${imagekitConfig.urlEndpoint}tr:${transformations}/${path}`
}

// Next.js Image loader for ImageKit
export const imagekitLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  if (!src) return '';
  
  let path = src;
  const endpoint = imagekitConfig.urlEndpoint;

  // If path starts with endpoint, strip it to get relative path
  if (path.startsWith(endpoint)) {
    path = path.replace(endpoint, '');
  }

  // Remove leading slash
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  const q = quality || 75
  return `${endpoint}tr:w-${width},q-${q}/${path}`
}
