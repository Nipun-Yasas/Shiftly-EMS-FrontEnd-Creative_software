'use client';

import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
} from '@mui/material';

import LetterRequestModal from '../components/LetterRequestModal';
import SearchField from '../components/SearchField';
import theme from '@/theme';

const letterTypes = [
  'EPF/ETF Name Change Letter',
  'Letter for Skill Assessment',
  'Salary Undertaking Letter',
  'Salary Confirmation Letter',
  'Employment Confirmation Letter',
];

const RequestLetter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = letterTypes.filter((letter) =>
    letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    console.log('User searched for:', searchTerm);
  };

  return (
    <>
      <Paper
        elevation={10}
        sx={{ height: '100%', width: '100%', p: 4 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 3 }}>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
          />
        </Box>

        <Box>
          <Typography
            variant="h7"
            sx={{  fontFamily: 'var(--font-poppins)', color: theme.palette.text }}
          >
            Available Letter Types
          </Typography>

          <Stack spacing={2}>
            {filteredLetters.length > 0 ? (
              filteredLetters.map((letter) => (
                <Box
                  key={letter}
                  sx={{
                   
                    backgroundColor: 'var(--requestBackground)',
                    borderRadius: 2,
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography color="textPrimary">{letter}</Typography>
                  <Button
                    onClick={() => setSelectedLetter(letter)}
                    sx={{
                      backgroundColor: 'var(--requestBtn)',
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'var(--requestBtnHover)',
                      },
                    }}
                  >
                    Request
                  </Button>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary">No matching letters found.</Typography>
            )}
          </Stack>
        </Box>
      </Paper>

      {selectedLetter && (
        <LetterRequestModal
        letterType={selectedLetter}
        open={Boolean(selectedLetter)}
        onClose={() => setSelectedLetter(null)}
      />
)}

    </>
  );
};

export default RequestLetter;
