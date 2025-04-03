'use client';

import React, { useState } from 'react';
import { Button } from "@mui/material";
import LetterRequestModal from '../../components/LetterRequestModal';

const letterTypes = [
    "EPF/ETF Name Change Letter",
    "Letter for Skill Assessment",
    "Salary Undertaking Letter",
    "Salary Confirmation Letter",
    "Employment Confirmation Letter",
  ];



export default function page() {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = letterTypes.filter((letter) =>
    letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

<div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Available Letter Types</h1>

      {letterTypes.map((letter) => (
        <div
          key={letter}
          className="flex justify-between items-center bg-gray-200 px-6 py-4 rounded mb-4"
        >
          <span className="text-gray-800">{letter}</span>
          <button
            onClick={() => setSelectedLetter(letter)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
          >
            Request
          </button>
        </div>
      ))}

      {selectedLetter && (
        <LetterRequestModal
          letterType={selectedLetter}
          onClose={() => setSelectedLetter(null)}
        />
      )}
    </div>

  
    </>
  )
}


