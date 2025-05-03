import React from 'react';
import { TextField, Select, MenuItem, Button, InputLabel, FormControl } from '@mui/material';

const SkillsForm = ({ formData, handleInputChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <TextField
        fullWidth
        label="Skill Name (e.g., JavaScript)"
        name="skillName"
        value={formData.skillName}
        onChange={handleInputChange}
        required
      />
      <FormControl fullWidth required>
        <InputLabel id="proficiency-label">Proficiency Level</InputLabel>
        <Select
          labelId="proficiency-label"
          name="proficiency"
          value={formData.proficiency}
          onChange={handleInputChange}
          label="Proficiency Level"
        >
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </FormControl>
      <div className="flex justify-end space-x-2">
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" 
            style={{
                margin:'5px',
                paddingTop: '10px',
                backgroundColor: 'var(--primary)',
            }}
        
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SkillsForm;