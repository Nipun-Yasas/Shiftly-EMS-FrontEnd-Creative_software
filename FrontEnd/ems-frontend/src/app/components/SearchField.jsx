'use client';

import React from 'react'


const SearchField = ({value, onChange,onSearch}) => {
  return (
    <div className='flex items-center gap-2 w-full max-w-md'>
        <input
         type='text'
         placeholder="Search letter type.."
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2-pink-500 text-black bg-white'
        />
        <button
            onClick={onSearch}
            className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition'
        >
            Search
        </button>
        
        
      
    </div>
  )
}

export default SearchField
