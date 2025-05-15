'use client';

import React from 'react'
import { TextField , Button , Box }  from  '@mui/material';
import { useTheme } from '@mui/material/styles';


const SearchField = ({value, onChange,onSearch}) => {

  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        
        gap: 2,
        width: '100%',
        maxWidth: 'md',
        justifyContent: 'flex-end',
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search letter type..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        
        size="small"
        sx={{
          borderRadius: '10px',
          input: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      />
      <Button
        onClick={onSearch}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark' ? '#dddddd' : '#333333',
          },
        }}
      >
        Search
      </Button>
    </Box>
  )
}

export default SearchField;
