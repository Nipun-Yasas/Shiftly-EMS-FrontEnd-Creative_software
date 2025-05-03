
import Box from '@mui/material/Box';import Image from 'next/image';
import SearchBar from './SearchBar'; 

export default function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Vertically center the logo and search bar
        justifyContent: 'space-between', // Justify logo to left, search bar to right
        width: '100%', // Ensure the Box spans the full width
        px: 2,
        gap:5 // Optional: Add padding for spacing from edges
      }}
    >
      <Image
        src="/shiftly-logo.png"
        alt="Company Logo"
        width={50}
        height={50}
        style={{
          margin: 0, 
          padding: 0, 
        }}
      />
      <SearchBar/>
    </Box>
  );
}
