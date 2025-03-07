import React from 'react'
import { useState, useRef, useEffect } from "react";

export default function AutoResizeInput({ label, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const spanRef = useRef(null);
  const inputRef = useRef(null);


  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 10}px`;
    }
  }, [value]);
    

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <div className="relative">
        {/* Hidden span to calculate width dynamically */}
          <span
            ref={spanRef}
            className="absolute invisible whitespace-pre px-4 py-2 border bg-gray-100"
          >
            {value || " "}
          </span>
        {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="px-4 py-2 border-none rounded-md bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black-100"
          />
      </div>
    </div>


  )
}


