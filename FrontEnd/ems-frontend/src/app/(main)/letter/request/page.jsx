'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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
  const [searchQuery, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = letterTypes.filter((letter) =>
    letter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Paper
        elevation={3}
        square={false}
        sx={{
          justifyItems: "center",
          alignContent: "center",
          height: "100%",
          width: "100%"
        }}
      >
        <Box sx={{ width: "100%", px: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 3 }}>
              <Typography
                variant="h7"
                sx={{ fontFamily: 'var(--font-poppins)', color: theme.palette.text }}
              >
                Available Letter Types
              </Typography>
            
            <SearchField
              value={searchQuery}
              onChange={setSearchTerm}
              onSearch={handleSearch}
            />
          </Box>

          <Box>
            

            <Stack spacing={2}>
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => (
                  <Box
                    key={letter}
                    sx={{
                      backgroundColor: '#0000000F',
                      borderRadius: 2,
                      px: 3,
                      py: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{
                      color:theme.palette.text,
                    }}>{letter}</Typography>
                    <Button
                      onClick={() => setSelectedLetter(letter)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.main,
                          color:theme.palette.text,
                        },
                      }}
                    >
                      Request
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No matching letters found.</Typography>
              )}
            </Stack>
          </Box>
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