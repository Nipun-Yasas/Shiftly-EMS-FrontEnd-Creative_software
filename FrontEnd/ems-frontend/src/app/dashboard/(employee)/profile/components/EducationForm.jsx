import React from 'react';
import { TextField, Button } from '@mui/material';

const EducationForm = ({ formData, handleInputChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Degree (e.g., Bachelor of Science)"
        name="degree"
        value={formData.degree}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        label="Institution"
        name="institution"
        value={formData.institution}
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
        <Button type="submit" variant="contained" color="primary"
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

export default EducationForm;