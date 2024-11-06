'use server'
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY
const PIXELS_API_KEY = process.env.PIXELS_API_KEY || ''
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

import type { PexelsPhoto, PixabayHit, UnsplashImage } from '@/types/media'
import { addBlurDataUrls } from './image-utils'

const UNSPLASH_API_URL = 'https://api.unsplash.com'
const PEXELS_API_URL = 'https://api.pexels.com'

export const fetchLibImages = async (
  page: number,
  source: 'unsplash' | 'pexels' | 'pixabay',
  query: string,
) => {
  let imagesPromise: Promise<UnsplashImage[]>
  if (source === 'unsplash') imagesPromise = getUnsplash(page, query)
  if (source === 'pexels') imagesPromise = getPexels(page, query)
  if (source === 'pixabay') imagesPromise = getPixabay(page, query)
  return await addBlurDataUrls(() => imagesPromise, source)
}

export const getUnsplash = async (page: number, query?: string) => {
  let url: string
  if (query) {
    url = `${UNSPLASH_API_URL}/search/photos?page=${page}&per_page=10&query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
  } else {
    url = `${UNSPLASH_API_URL}/photos?page=${page}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`
  }
  const response = await fetch(url, {
    cache: 'no-cache',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch images')
  }
  const data = await response.json()
  if (Array.isArray(data.results)) {
    return data.results as UnsplashImage[]
  }
  if (Array.isArray(data)) {
    return data as UnsplashImage[]
  }
  return []
}

export const getPexels = async (
  page: number,
  query?: string,
): Promise<UnsplashImage[]> => {
  let url: string
  if (query) {
    url = `${PEXELS_API_URL}/v1/search?query=${query}&per_page=10&page=${page}`
  } else {
    url = `${PEXELS_API_URL}/v1/curated?per_page=10&page=${page}`
  }
  const response = await fetch(url, {
    headers: {
      Authorization: PIXELS_API_KEY,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch images')
  }
  const data = await response.json()
  if ('photos' in data && Array.isArray(data.photos)) {
    const res = data.photos.map((photo: PexelsPhoto) => {
      return {
        id: photo.id.toString(),
        width: photo.width,
        height: photo.height,
        color: photo.avg_color,
        blur_hash: '',
        description: photo.alt,
        user: {
          id: photo.photographer_id.toString(),
          username: photo.photographer,
          name: photo.photographer,
          portfolio_url: photo.photographer_url,
        },
        urls: {
          small: photo.src.medium,
        },
      } satisfies UnsplashImage
    })
    return res
  }
  return []
}

export const getPixabay = async (
  page: number,
  query?: string,
): Promise<UnsplashImage[]> => {
  let url: string
  if (query) {
    url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&per_page=10&page=${page}`
  } else {
    url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&per_page=10&page=${page}`
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch images')
  }
  const data = await response.json()
  if (!('hits' in data && Array.isArray(data.hits))) return []
  return data.hits.map((hit: PixabayHit) => {
    return {
      id: hit.id.toString(),
      width: hit.webformatWidth,
      height: hit.webformatHeight,
      description: hit.tags,
      color: '#f0f0f0',
      blur_hash: '',
      user: {
        id: hit.user_id.toString(),
        username: hit.user,

        name: hit.user,
        portfolio_url: `https://pixabay.com/users/${hit.user_id}/`,
      },
      urls: {
        small: hit.webformatURL,
      },
    } satisfies UnsplashImage
  })
}
