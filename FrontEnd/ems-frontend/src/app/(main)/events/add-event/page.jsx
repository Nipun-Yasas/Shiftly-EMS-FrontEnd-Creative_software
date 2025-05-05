import React from 'react'

import { Paper } from "@mui/material";

import EventForm from "../components/EventForm";

export default function page() {
  return (
    <Paper elevation={3} square={false}
    sx={{
      justifyItems: 'center',
      alignContent: 'center',
      height: '100%',
      width: '100%',
    }}>
        <EventForm/>
      
    </Paper>
  )
}
