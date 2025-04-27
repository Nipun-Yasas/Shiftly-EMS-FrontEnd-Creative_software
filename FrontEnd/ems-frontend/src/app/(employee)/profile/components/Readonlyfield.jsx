import React from 'react'

const Readonlyfield = ({label, value}) => {
  return (
    <div className="flex flex-col">
    <label className="text-sm font-medium " 
    style={{
        color:'var(--labelColor)',
        fontFamily:'var(--font-lexend)',
        fontSize:'16px',
        }}>
            {label}
        </label>
    <div
      className="text-base font-medium  rounded-md px-3 py-2"
      style={{
        fontFamily:'var(--font-roboto)',
        fontSize:'15px',
        background:'var(--inputFieldColor)',
        color:'var(--valueColor)',
        display: 'inline-block',
        width: 'fit-content',
        minWidth: '8rem', // Set a minimum width for the field
        maxWidth: '100%',  //prevent overflow
        whiteSpace: 'nowrap', // Prevent text wrapping
      }}
    >
      {value}
    </div>
  </div>
  )
}

export default Readonlyfield;
