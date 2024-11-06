import { getPlaiceholder } from 'plaiceholder'
import type { UnsplashImage } from '@/types/media'

export default async function getBase64Image(imageUrl: string) {
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) {
      throw new Error('Failed to fetch image')
    }
    const buffer = await res.arrayBuffer()
    const { base64 } = await getPlaiceholder(Buffer.from(buffer))
    return base64
  } catch (error) {
    if (error instanceof Error) console.log(error.message)
  }
}

export async function addBlurDataUrls(
  imagesPromise: () => Promise<UnsplashImage[]>,
  source: string,
): Promise<UnsplashImage[]> {
  const images = await imagesPromise()
  const base64Promises = images.map((image) => getBase64Image(image.urls.small))
  const base64Images = await Promise.all(base64Promises)
  const imagesWithBlur = images.map((image, index) => {
    image.blurDataURL = base64Images[index]
    image.soucre = source
    if (source === 'unsplash') {
      image.user.portfolio_url = `https://unsplash.com/@${image.user.username}`
    }
    return image
  })
  return imagesWithBlur
}
