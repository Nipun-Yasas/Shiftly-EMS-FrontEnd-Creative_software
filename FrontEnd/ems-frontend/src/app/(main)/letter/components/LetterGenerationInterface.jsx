'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
  useTheme,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Preview,
  CheckCircle,
  Assignment,
  Work,
  AttachMoney,
  VerifiedUser,
  BusinessCenter,
  Email,
  Print
} from '@mui/icons-material';
import { BASE_URL, API_PATHS } from '../../../_utils/apiPaths';
import { Editor } from '@tinymce/tinymce-react';


// Helper to split plain text into page-sized chunks
function paginateTextContent(text, charsPerPage = 1800) {
  // Simple split by character count for now (can be improved for word boundaries)
  const pages = [];
  let i = 0;
  while (i < text.length) {
    pages.push(text.slice(i, i + charsPerPage));
    i += charsPerPage;
  }
  return pages;
}

// Helper to insert page breaks into HTML content
function insertPageBreaks(html, pageHeightPx = 1056) {
  // Create a temporary container to measure content
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.visibility = 'hidden';
  container.style.width = '700px'; // approximate content width
  document.body.appendChild(container);

  let currentHeight = 0;
  let lastBreak = 0;
  const nodes = Array.from(container.childNodes);
  const breakIndexes = [];

  nodes.forEach((node, i) => {
    if (node.nodeType === 1) {
      currentHeight += node.offsetHeight || 0;
    } else if (node.nodeType === 3) {
      // text node, rough estimate
      currentHeight += 24;
    }
    if (currentHeight > pageHeightPx) {
      breakIndexes.push(i);
      currentHeight = 0;
    }
  });

  // Remove the temp container
  document.body.removeChild(container);

  // Insert page breaks
  let result = '';
  nodes.forEach((node, i) => {
    if (breakIndexes.includes(i)) {
      result += '<div class="page-break"></div>';
    }
    result += node.outerHTML || node.textContent;
  });
  return result;
}

// Helper to split HTML content into chunks that fit a given height (approximate, for block elements)
function splitHtmlByBodyHeight(html, bodyHeightPx = 836) {
  // This is an approximation: split by <p> tags for now
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const blocks = Array.from(temp.children);
  const chunks = [];
  let currentChunk = '';
  let currentHeight = 0;
  blocks.forEach((block, i) => {
    // Estimate height: 24px per <p>, 32px per <h1>, etc.
    let est = 24;
    if (/^h[1-6]$/i.test(block.tagName)) est = 32;
    if (block.tagName === 'UL' || block.tagName === 'OL') est = 40;
    if (block.tagName === 'TABLE') est = 80;
    currentHeight += est;
    currentChunk += block.outerHTML;
    if (currentHeight >= bodyHeightPx) {
      chunks.push(currentChunk);
      currentChunk = '';
      currentHeight = 0;
    }
  });
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

const LetterGenerationInterface = ({ letterType, formData, onBack, onStartOver }) => {
  const theme = useTheme();
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedLetterHtml, setGeneratedLetterHtml] = useState('');
  const [editedLetterHtml, setEditedLetterHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    'Processing Request',
    'Generating Letter',
    'Finalizing Document',
    'Ready for Download'
  ];

  const getLetterIcon = (letterTypeName) => {
    switch (letterTypeName) {
      case "EPF/ETF Name Change Letter": return <Assignment />;
      case "Letter for Skill Assessment": return <Work />;
      case "Salary Undertaking Letter": return <AttachMoney />;
      case "Salary Confirmation Letter": return <VerifiedUser />;
      case "Employment Confirmation Letter": return <BusinessCenter />;
      default: return <Assignment />;
    }
  };

  // Map frontend letterType to backend enum
  const mapLetterTypeToEnum = (type) => {
    switch (type) {
      case 'EPF/ETF Name Change Letter': return 'EPF_ETF_NAME_CHANGE_LETTER';
      case 'Letter for Skill Assessment': return 'SKILL_ASSESSMENT_LETTER';
      case 'Salary Undertaking Letter': return 'SALARY_UNDERTAKING_LETTER';
      case 'Salary Confirmation Letter': return 'SALARY_CONFIRMATION_LETTER';
      case 'Employment Confirmation Letter': return 'EMPLOYMENT_CONFIRMATION_LETTER';
      default: return type;
    }
  };

  useEffect(() => {
    const fetchGeneratedLetter = async () => {
      setLoading(true);
      setError(null);
      setGenerationStep(0);
      try {
        // Simulate progress
        for (let i = 0; i <= 2; i++) {
          await new Promise(resolve => setTimeout(resolve, 700));
          setGenerationStep(i);
        }
        // Actual API call
        const response = await fetch(`${BASE_URL}${API_PATHS.LETTER.GENERATE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            letterType: mapLetterTypeToEnum(letterType),
            fields: formData
          })
        });
        if (!response.ok) throw new Error('Failed to generate letter');
        const result = await response.json();
        if (!result.success || !result.letterHtml) throw new Error(result.message || 'No letter generated');
        setGeneratedLetterHtml(result.letterHtml);
        setEditedLetterHtml(result.letterHtml);
        setGenerationStep(3);
      } catch (err) {
        setError(err.message || 'Error generating letter');
      } finally {
        setLoading(false);
      }
    };
    fetchGeneratedLetter();
    // eslint-disable-next-line
  }, [letterType, formData]);

  // Add a ref for the preview container
  const previewRef = React.useRef(null);

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={onBack}
            sx={{
              mr: 2,
              color: theme.palette.text,
              '&:hover': { backgroundColor: `${theme.palette.primary.main}20` }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${theme.palette.primary.main}20`,
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            {getLetterIcon(letterType)}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text,
                fontFamily: 'var(--font-poppins)'
              }}
            >
              Letter Generation
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text }}
            >
              {letterType}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Generation Progress */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text,
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                {generationStep < 3 ? 'Generating Your Letter...' : 'Letter Generated Successfully!'}
              </Typography>
              <Stepper activeStep={generationStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: completed || active 
                              ? theme.palette.primary.main 
                              : theme.palette.grey[300],
                            color: completed || active ? 'white' : theme.palette.grey[600],
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {completed ? <CheckCircle sx={{ fontSize: 16 }} /> : index + 1}
                        </Box>
                      )}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress sx={{ color: theme.palette.primary.main }} size={32} />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Letter Preview and Actions */}
      {generationStep === 3 && generatedLetterHtml && !loading && !error && (
        <>
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text, mb: 2 }}>
                Letter Preview
              </Typography>
              <Box ref={previewRef}>
                <style>{`
                  .letterhead-preview-header { position: absolute; top: 20px; left: 60px; right: 60px; height: 60px; z-index: 2; }
                  .letterhead-preview-logo { max-height: 60px; }
                  .letterhead-preview-main { position: relative; z-index: 1; padding-top: 100px; padding-bottom: 160px; min-height: 300px; margin-left: 1in; }
                  .letterhead-preview-footer { position: absolute; bottom: 20px; left: 60px; right: 60px; font-size: 12px; color: #333; z-index: 2; }
                  .footer-line { display: flex; flex-wrap: nowrap; line-height: 0.3; }
                  .footer-line > div, .footer-line > a { text-align: left; }
                  .footer-center { text-align: center; width: 100%; }
                  .letterhead-preview-triangle { position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-bottom: 100px solid #e30613; border-left: 100px solid transparent; z-index: 1; }
                  a { color:inherit; text-decoration: none; }
                  @media print {
                    body * { visibility: hidden !important; }
                    .letter-print-area, .letter-print-area * { visibility: visible !important; }
                    .letter-print-area { position: absolute !important; left: 0; top: 0; width: 100vw; background: #fff; z-index: 9999; }
                  }
                `}</style>
                <div className="letter-print-area" style={{ position: 'relative', width: 816, minHeight: 1056, maxHeight: 1056, margin: '0 auto', background: '#fff', border: '1.5px solid', borderColor: '#e30613', borderRadius: 8, overflow: 'hidden' }}>
                  <div className="letterhead-preview-header">
                    <img className="letterhead-preview-logo" src="https://cdn.prod.website-files.com/635813c46b5aa1b7a5b5ec14/641d76e8d3455bbd533433ad_Creative%20website%20logo%2072%20dpi-52.png" alt="Creative Software Logo" />
                  </div>
                  <div className="letterhead-preview-main" style={{ overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
                    {splitHtmlByBodyHeight(editedLetterHtml, 836).map((chunk, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div dangerouslySetInnerHTML={{ __html: chunk }} />
                        {idx < arr.length - 1 && (
                          <div className="page-break-indicator"><span className="page-break-label">Page Break</span></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <footer className="letterhead-preview-footer">
                    <div style={{ paddingBottom: 15 }}><strong>Creative Software (Pvt) Ltd.</strong></div>
                    <div className="footer-line">
                      <div>Level 12, One Galle Face Tower, IA.</div>
                    </div>
                    <div className="footer-center">Tel: +94 11 250 5889</div>
                    <div className="footer-line">
                      <div>02, Centre Road, Colombo 02</div>
                    </div>
                    <div className="footer-center">Fax: +94 11 250 5891</div>
                    <div className="footer-line">
                      <a href="https://www.creativesoftware.com" target="_blank" style={{ color: '#e30613' }}>www.creativesoftware.com</a>
                    </div>
                    <div className="footer-center">
                      <a href="mailto:info@creativesoftware.com">info@creativesoftware.com</a>
                    </div>
                  </footer>
                  <div className="letterhead-preview-triangle"></div>
                </div>
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                Edit below:
              </Typography>
              <Editor
                value={editedLetterHtml}
                onEditorChange={setEditedLetterHtml}
                tinymceScriptSrc="https://cdn.tiny.cloud/1/d6x9979fb070x5l3qhgstsbw5kf5ueivjkx02gur2egdfzq3/tinymce/8/tinymce.min.js"
                init={{
                  height: 300,
                  menubar: false,
                  plugins: 'lists link',
                  toolbar: 'undo redo | bold italic underline | bullist numlist | link',
                }}
              />
            </CardContent>
          </Card>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text, mb: 3, textAlign: 'center' }}>
              What would you like to do next?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Print />}
                sx={{ minWidth: 140, borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
                onClick={() => window.print()}
              >
                Print Letter
              </Button>
              <Button onClick={onStartOver} variant="text" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}>
                Request Another Letter
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default LetterGenerationInterface;