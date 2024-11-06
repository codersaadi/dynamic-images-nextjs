import ImageMapper from '@/components/image-mapper'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

export default function page() {
  
  return <Suspense fallback={
    <ImagesSkeleton />
  }>
    <ImageMapper />
  </Suspense>
}

const ImagesSkeleton = () => {
  return <div className="w-full h-screen overflow-y-auto pb-3 scroll-smooth">
    <Skeleton className="w-full h-10" />
    <div className="max-w-sm mx-auto mx-w-auto md:max-w-lg lg:max-w-full columns-2 lg:columns-3   gap-2 space-y-3 w-full">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="sm:max-w-sm md:max-w-md" key={index}>
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  </div>
}
