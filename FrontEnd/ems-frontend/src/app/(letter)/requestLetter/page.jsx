'use client';

import React, { useState } from 'react';
import { Button } from "@mui/material";

const letterTypes = [
    "EPF/ETF Name Change Letter",
    "Letter for Skill Assessment",
    "Salary Undertaking Letter",
    "Salary Confirmation Letter",
    "Employment Confirmation Letter",
  ];



export default function page() {

    const [searchTerm, setSearchTerm] = useState("");

  const filteredLetters = letterTypes.filter((letter) =>
    letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

        <div className="container w-4/5 mt-20 ml-60 mr-0 pt-5 pb-5 pl-20 shadow bg-white rounded-xl">
            <div className="text-4xl text-red-600 font-bold ">Letter</div>
            <div className="sub-path">
            <span className="text-gray-400 mx-2 ">Letter <span>›</span> </span> 
            <span className="text-gray-500 mx-2 "> Letter Request <span>›</span></span>
            </div>

        </div>
        <div className="min-h-screen pt-8 pl-8 pb-0 pr-8 mt-10 ml-40 mr-10 mb-10 shadow bg-white rounded-2xl">
            <h1 className="text-xl font-semibold ml-15 mb-6">Letter Request</h1>

            <div className="flex items-center gap-2 mb-8 ml-60 mr-0">
                <input
                type="text"
                placeholder="Search letter type...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md border border-gray-300 rounded-md ml-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <Button variant="contained" sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}>
                Search
                </Button>
            </div>

            <div>
                <h2 className="text-lg font-normal mb-4">Available Letter Types</h2>
                    <div className="space-y-4">
                    {filteredLetters.map((letter, index) => (
                        <div
                        key={index}
                        className="flex justify-between items-center bg-gray-200 px-6 py-4 rounded-md"
                        >
                        <span className="text-m font-medium text-gray-900">
                            {letter}
                        </span>
                        <Button 
                            variant="contained"
                            sx={{ backgroundColor: '#E90A4D', '&:hover': { backgroundColor: '#f22966' } }}
                        >
                            Request
                        </Button>
                    </div>
                    ))}
            </div>
            </div>
        </div>
  
    </>
  )
}


