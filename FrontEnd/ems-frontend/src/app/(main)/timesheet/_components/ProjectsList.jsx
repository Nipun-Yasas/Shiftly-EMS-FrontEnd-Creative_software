"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function ProjectsList() {
  const [projects] = useState([
    { id: 1, name: "E_Bench_Engineering", active: true },
    { id: 2, name: "E_Company_Wide_Task", active: false },
    { id: 3, name: "E_CRM_Code_Events", active: false },
    { id: 4, name: "E_CRM_Delivery_Admin", active: false },
    { id: 5, name: "E_CRM_Delivery_Sales", active: false },
    { id: 6, name: "E_CRM_Code_Events", active: false },
    { id: 7, name: "E_Community_of_Practice", active: false },
    { id: 8, name: "E_Marketing_and_Training_Support", active: false },
    { id: 9, name: "E_VTL_Upskilling", active: false },
    { id: 10, name: "E_Interview", active: true },
    { id: 11, name: "E_Performance_Evaluations", active: false },
    { id: 12, name: "E_Project_1", active: false },
  ]);
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper elevation={1} sx={{ height: '100%', p: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Projects you are assigned to ({projects.length})
        </Typography>
        <IconButton size="small">
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {isExpanded && (
        <>
          <TextField
            fullWidth
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filteredProjects.map((project) => (
              <Chip
                key={project.id}
                label={project.name}
                color={project.active ? "primary" : "default"}
                variant={project.active ? "filled" : "outlined"}
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: project.active ? 'primary.dark' : 'grey.200'
                  }
                }}
              />
            ))}
            
            {filteredProjects.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                No projects found matching your search.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
} 