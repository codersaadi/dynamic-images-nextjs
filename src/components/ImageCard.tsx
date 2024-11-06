
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { useState } from 'react'
import type { UnsplashImage } from '@/types/media'

interface ImageCardProps {
  image?: UnsplashImage
  // onAddImage: (image: UnsplashImage) => void
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const [isImageLoading, setImageLoading] = useState(true)
  if (!image) return null

  const backgroundColor = image.color ? image.color : '#f0f0f0' // Example fallback color, adjust as needed
 

  const ImageContent = (
    <>

      <Image
        src={image.urls.small}
        alt={image.description || 'Unsplash Image'}
        width={image.width}
        className={`w-full h-full ${isImageLoading ? 'blur-sm' : 'blur-0'}`}
        height={image.height}
        loading="lazy"
        objectFit="cover"
        onLoad={() => setImageLoading(false)}
        placeholder={image.blurDataURL ? 'blur' : undefined}
        blurDataURL={image.blurDataURL}
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black hidden group-hover:inline-flex bg-opacity-50 text-white text-sm">
        by
        <Link
          href={image.user.portfolio_url || '#'}
          className="block underline truncate text-surface bg-dark px-1 rounded-lg mx-1"
          target="_blank"
        >
          {image.user.username}
        </Link>
        on
        <span className="block mx-1 text-surface bg-dark px-1 rounded-lg">
          {image.soucre}
        </span>
      </div>
    </>
  )

  return (
    <div
      className="rounded-lg overflow-hidden relative group"
      style={{ backgroundColor }}
    >
      {ImageContent}
    </div>
  )
}

export default ImageCard
