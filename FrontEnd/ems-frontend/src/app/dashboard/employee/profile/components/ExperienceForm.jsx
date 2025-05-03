import React from 'react';
import { TextField, Button } from '@mui/material';

const ExperienceForm = ({ formData, handleInputChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Job Title"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        label="Company"
        name="company"
        value={formData.company}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        label="Duration (e.g., Jan 2020 - Dec 2022)"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
        required
      />
      <div className="flex justify-end space-x-2">
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" 
        style={{
            margin:'5px',
            paddingTop: '10px',
            backgroundColor: 'var(--primary)',
        }}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;