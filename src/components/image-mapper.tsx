'use client'
import type React from 'react'
import { useCallback, useRef, useState } from 'react'

import useImagesLib, { $ImageSource } from '@/hooks/useImageLib'
import ImageCard from './ImageCard'
import ImagesHeader from './images-header'

export default function ImageMapper() {
  const { images, loadMore, loading, error, searchImages, source, setSource } =
    useImagesLib()


  const observer = useRef<IntersectionObserver | null>(null)

  const lastImageRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, loadMore],
  )


  return (
    <div className="w-full  h-screen overflow-y-auto pb-3 scroll-smooth">
    <ImagesHeader 
      source={source}
      setSource={setSource}
      searchImages={searchImages}
    />
      <div className="max-w-sm mx-auto mx-w-auto md:max-w-lg lg:max-w-full columns-2 lg:columns-3   gap-2 space-y-3 w-full">
        {images &&
          Array.isArray(images) &&
          images.length > 0 &&
          images.map((image, index) => {
            if (index === images.length - 1) {
              return (
                <div
                  className=" sm:max-w-sm md:max-w-md"
                  ref={lastImageRef}
                  key={image.id}
                >
                  <ImageCard image={image}  />
                </div>
              )
            }
            return (
              <ImageCard key={image.id}  image={image} />
            )
          })}
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 border-r-blue-600 animate-spin rounded-full" />
          <p className="text-sm text-gray-500">Loading more images...</p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center py-6 px-4">
          <div className="bg-neutral-900 border border-red-800/40 rounded-lg p-4 max-w-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-md text-red-600">
                Failed to load images. {error} 
              </p>
          
            </div>
            <p className="text-sm text-red-300">
                check your internet connection and reload the page.
              </p>
          </div>
        </div>
      )}
    </div>
  )
}
