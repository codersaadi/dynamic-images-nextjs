import { $ImageSource } from '@/hooks/useImageLib'
import { useQueryState } from 'nuqs'
import React, { useState } from 'react'
export default function ImagesHeader({
source ,
setSource,
searchImages,
} :{
    source : $ImageSource,
    setSource : (source : $ImageSource) => void,
    searchImages : (query : string) => void
}) {
 
    const [dropdownOpen, setDropdownOpen] = useState(false) // State to manage dropdown visibility
    const toggleDropdown = () => {
      setDropdownOpen((prevState) => !prevState)
    }
  
    const closeDropdown = () => {
      setDropdownOpen(false)
    }
 
  /**
   * For handling Image  Search
   */
  const [searchTerm, setSearchTerm] = useQueryState('query', {
    clearOnDefault: true,
    defaultValue: '',
  })
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (searchTerm.trim()) {
      searchImages(searchTerm.trim())
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    searchImages('')
  }
    return (
    <header className="bg-neutral-900/80 shadow-lg p-3 sm:p-4 sticky top-0 z-10 flex justify-center items-center backdrop-blur-xl gap-3">
      <form
        onSubmit={handleSearch}
        className="relative flex items-center rounded-lg overflow-hidden justify-center max-w-2xl w-full"
      >
        <input
          type="text"
          className="flex-grow py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background border border-neutral-700 shadow-lg transition-all"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-16 p-2 hover:bg-neutral-800 rounded-full transition-colors focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 hover:text-gray-700  "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 p-2  text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m2.35-6.65a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
          <span className='sr-only'>Search</span>
        </button>
      </form>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="p-2.5 rounded-lg border border-neutral-700 bg-background hover:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex gap-2 items-center transition-all"
        >
          {source}
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-blue-500 ml-1 transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 shadow-xl rounded-lg border border-neutral-700 overflow-hidden z-50">
            <ul className="bg-background divide-y divide-neutral-700">
              {['unsplash', 'pexels', 'pixabay'].map((item) => (
                <li
                  key={item}
                  className="px-4 py-2.5 cursor-pointer text-foreground hover:bg-blue-500 hover:text-white transition-colors capitalize"
                  onClick={() => {
                    setSource(item as $ImageSource)
                    closeDropdown()
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}
