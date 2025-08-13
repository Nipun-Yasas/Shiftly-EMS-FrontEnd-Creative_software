"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Paper, CircularProgress, Typography, Alert, Button } from "@mui/material";

import axiosInstance from "../../../../_utils/axiosInstance";
import { API_PATHS } from "../../../../_utils/apiPaths";
import LetterGenerationInterface from "../../../../letter/components/LetterGenerationInterface";

// Map backend enum to display name used by the generator
const mapEnumToLetterTypeName = (enumVal) => {
  switch ((enumVal || '').toString()) {
    case 'EPF_ETF_NAME_CHANGE_LETTER': return 'EPF/ETF Name Change Letter';
    case 'SKILL_ASSESSMENT_LETTER': return 'Letter for Skill Assessment';
    case 'SALARY_UNDERTAKING_LETTER': return 'Salary Undertaking Letter';
    case 'SALARY_CONFIRMATION_LETTER': return 'Salary Confirmation Letter';
    case 'EMPLOYMENT_CONFIRMATION_LETTER': return 'Employment Confirmation Letter';
    default: return enumVal || '';
  }
};

export default function AdminGenerateLetterPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.requestId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [letterType, setLetterType] = useState("");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!requestId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(API_PATHS.LETTER.REQUEST.GET_BY_ID(requestId));
        const data = res?.data?.data || res?.data || {};
        const typeName = mapEnumToLetterTypeName(data.letterType || data.type);
        if (!typeName) throw new Error('Invalid letter type');
        setLetterType(typeName);
        setFormData(data.fields || {});
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load request');
      } finally {
        setLoading(false);
      }
    })();
  }, [requestId]);

  if (loading) {
    return (
      <Paper elevation={2} sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography>Loading request…</Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="outlined" onClick={() => router.push('/admin-portal/letters')}>Back to list</Button>
        </Box>
      </Paper>
    );
  }

  return (
    <LetterGenerationInterface
      letterType={letterType}
      formData={formData || {}}
      onBack={() => router.push('/admin-portal/letters')}
      onStartOver={() => router.push('/admin-portal/letters')}
    />
  );
}
