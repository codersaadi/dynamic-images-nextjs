import { useCallback, useEffect, useRef, useState } from 'react'
import type { UnsplashImage } from '@/types/media'
import { fetchLibImages } from '@/actions/images/get-images'
export type $ImageSource = 'pixabay' | 'unsplash' | 'pexels'
import {useQueryState} from 'nuqs'
export default function useImagesLib() {
  
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useQueryState<number>('page', {
    parse: (value) => parseInt(value, 10),
    defaultValue: 1,
  })
  const [query, setQuery] = useQueryState('query', {
    clearOnDefault: true,
  })
  const [source, setSource] = useQueryState('source', {
    parse: (value) => value === 'unsplash' ? 'unsplash' : value === 'pixabay' ? 'pixabay' : 'pexels',
    defaultValue: 'unsplash' as $ImageSource,
  })
  const [hasMore, setHasMore] = useQueryState('hasMore', {
    parse: (value) => value === 'true',
    defaultValue: true,
  })
  const fetchedPages = useRef<Set<string>>(new Set())
  const initialRender = useRef(true)

  const fetchImages = useCallback(
    async (
      page: number,
      query: string,
      source: 'unsplash' | 'pixabay' | 'pexels',
    ) => {
      const queryKey = `${query}-${page}-${source}`
      if (fetchedPages.current.has(queryKey)) return

      setLoading(true)
      setError(null)

      try {
        const results = await fetchLibImages(page, source, query)
        if (!Array.isArray(results)) {
          throw new Error('Failed to fetch images')
        }

        setImages((prevImages) => {
          const newImages = results.filter(
            (newImage) => !prevImages.some((img) => img.id === newImage.id),
          )
          return initialRender.current
            ? newImages
            : [...prevImages, ...newImages]
        })

        setHasMore(results.length > 0)
        fetchedPages.current.add(queryKey)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
        initialRender.current = false
      }
    }
    ,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // initialRender,
      //  fetchedPages
    ],
  )

  useEffect(() => {
    fetchImages(page, query || '', source)
  }, [fetchImages, page, query, source])

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const searchImages = (newQuery: string) => {
    setImages([])
    setPage(1)
    setQuery(newQuery)
    fetchedPages.current.clear()
    initialRender.current = true
  }

  return {
    images,
    loading,
    error,
    loadMore,
    hasMore,
    searchImages,
    source,
    setSource: (newSource: $ImageSource) => {
      setSource(newSource)
      setImages([])
      setPage(1)
      fetchedPages.current.clear()
      initialRender.current = true
    },
  }
}
