import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variable status
    console.log('ImageKit env check:', {
      hasPublicKey: !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
      hasUrlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT,
      privateKeyValue: process.env.IMAGEKIT_PRIVATE_KEY ? 'LOADED (length: ' + process.env.IMAGEKIT_PRIVATE_KEY.length + ')' : 'NOT LOADED',
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('IMAGEKIT')),
    })

    // Initialize ImageKit inside the function to ensure runtime env vars are used
    // TEMPORARY WORKAROUND: Hardcoded private key due to Windows/Next.js env var issue
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_WXNp8yUjqMtlBjspCGK4nedTr+o=',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    })
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name}`,
      folder: '/aphorismes/',
      tags: ['aphorism']
    })

    // Return the image URL
    return NextResponse.json({
      url: response.url,
      fileId: response.fileId
    })
  } catch (error) {
    console.error('Image upload error:', error)

    const message = error instanceof Error ? error.message : 'Failed to upload image'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
