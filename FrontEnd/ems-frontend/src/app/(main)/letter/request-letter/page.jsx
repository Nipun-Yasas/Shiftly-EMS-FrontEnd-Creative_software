'use client';

import  { useState } from 'react';

import { Paper } from '@mui/material';

import LetterRequestModal from '../components/LetterRequestModal';
import SearchField from '../components/SearchField';

const letterTypes = [
  "EPF/ETF Name Change Letter",
  "Letter for Skill Assessment",
  "Salary Undertaking Letter",
  "Salary Confirmation Letter",
  "Employment Confirmation Letter",
];

const RequestLetter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = letterTypes.filter((letter) =>
    letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    console.log("User searched for:", searchTerm);
  };

  return (
    <>
      <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>

        <div className='shadow p-5 justify-items-end pt-10 pr-5'>
          <SearchField value={searchTerm} onChange={setSearchTerm} onSearch={handleSearch} />
        </div>

        <div className="p-8">
          <h1
            className="text-2xl font-regular mb-6"
            style={{
              color: 'black',
              fontFamily: 'var(--font-poppins)',
              fontSize: '20px',
            }}
          >
            Available Letter Types
          </h1>

          {filteredLetters.length > 0 ? (
            filteredLetters.map((letter) => (
              <div
                key={letter}
                className="flex justify-between items-center px-6 py-4 rounded mb-4"
                style={{
                  background: 'var(--requestBackground)',
                  borderRadius: '10px',
                }}
              >
                <span className="text-gray-800">{letter}</span>
                <button
                  onClick={() => setSelectedLetter(letter)}
                  className="px-4 py-2 rounded"
                  style={{
                    color: 'white',
                    background: 'var(--requestBtn)',
                    borderRadius: '10px',
                  }}
                >
                  Request
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No matching letters found.</p>
          )}
        </div>
      </Paper>

      {/* Modal */}
      {selectedLetter && (
        <LetterRequestModal
          letterType={selectedLetter}
          onClose={() => setSelectedLetter(null)}
        />
      )}
    </>
  );
}

export default RequestLetter;
