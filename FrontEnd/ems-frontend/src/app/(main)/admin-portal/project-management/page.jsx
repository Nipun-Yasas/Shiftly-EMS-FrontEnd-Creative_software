'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextInput from '../../../_components/inputs/TextInput';
import SelectInput from '../../../_components/inputs/SelectInput';
import { API_PATHS } from '../../../_utils/apiPaths';
import axiosInstance from '../../../_utils/axiosInstance';
import SearchBar from '@/app/_components/header/SearchBar';

const projectValidationSchema = Yup.object({
  projectName: Yup.string()
    .min(3, 'Project name must be at least 3 characters')
    .required('Project name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  client: Yup.string()
    .required('Client is required'),
  projectManager: Yup.string()
    .required('Project manager is required'),
  status: Yup.object()
    .required('Status is required'),
  priority: Yup.object()
    .required('Priority is required'),
  budget: Yup.number()
    .positive('Budget must be positive')
    .required('Budget is required'),
  startDate: Yup.date()
    .required('Start date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required'),
  teamSize: Yup.number()
    .positive('Team size must be positive')
    .integer('Team size must be a whole number')
    .required('Team size is required')
});

const projectStatuses = [
  { id: 1, name: 'Planning', label: 'Planning', color: 'info' },
  { id: 2, name: 'In Progress', label: 'In Progress', color: 'primary' },
  { id: 3, name: 'On Hold', label: 'On Hold', color: 'warning' },
  { id: 4, name: 'Completed', label: 'Completed', color: 'success' },
  { id: 5, name: 'Cancelled', label: 'Cancelled', color: 'error' }
];

const projectPriorities = [
  { id: 1, name: 'Low', label: 'Low', color: 'success' },
  { id: 2, name: 'Medium', label: 'Medium', color: 'warning' },
  { id: 3, name: 'High', label: 'High', color: 'error' },
  { id: 4, name: 'Critical', label: 'Critical', color: 'error' }
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function to calculate project progress
const calculateProgress = (project) => {
  if (project.status?.name === 'Completed') return 100;
  if (project.status?.name === 'Cancelled') return 0;
  if (project.status?.name === 'Planning') return 10;
  if (project.status?.name === 'On Hold') return 25;
  
  // For "In Progress", calculate based on time elapsed
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const now = new Date();
  
  if (now < start) return 10;
  if (now > end) return 95;
  
  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const elapsedDays = (now - start) / (1000 * 60 * 60 * 24);
  return Math.min(Math.max((elapsedDays / totalDays) * 100, 10), 95);
};

export default function ProjectManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const initialFormValues = {
    projectName: '',
    description: '',
    client: '',
    projectManager: '',
    status: null,
    priority: null,
    budget: '',
    startDate: '',
    endDate: '',
    teamSize: ''
  };

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Replace with actual API call when backend is ready
      const response = await axiosInstance.get('/api/projects');
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showSnackbar('Error fetching projects', 'error');
      // Set sample data for demo purposes
      setProjects([
        {
          id: 1,
          projectName: 'E-Commerce Platform',
          description: 'Development of a modern e-commerce platform with advanced features',
          client: 'TechCorp Inc.',
          projectManager: 'John Smith',
          status: { name: 'In Progress', color: 'primary' },
          priority: { name: 'High', color: 'error' },
          budget: 150000,
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          teamSize: 8
        },
        {
          id: 2,
          projectName: 'Mobile Banking App',
          description: 'Secure mobile banking application for iOS and Android',
          client: 'National Bank',
          projectManager: 'Sarah Johnson',
          status: { name: 'Planning', color: 'info' },
          priority: { name: 'Critical', color: 'error' },
          budget: 200000,
          startDate: '2024-03-01',
          endDate: '2024-09-15',
          teamSize: 12
        },
        {
          id: 3,
          projectName: 'Inventory Management System',
          description: 'Web-based inventory tracking and management system',
          client: 'RetailMax Ltd.',
          projectManager: 'Mike Davis',
          status: { name: 'Completed', color: 'success' },
          priority: { name: 'Medium', color: 'warning' },
          budget: 75000,
          startDate: '2023-08-01',
          endDate: '2023-12-31',
          teamSize: 5
        },
        {
          id: 4,
          projectName: 'Learning Management System',
          description: 'Online learning platform with video streaming capabilities',
          client: 'EduTech Solutions',
          projectManager: 'Emma Wilson',
          status: { name: 'On Hold', color: 'warning' },
          priority: { name: 'Low', color: 'success' },
          budget: 95000,
          startDate: '2024-02-01',
          endDate: '2024-08-30',
          teamSize: 6
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const projectData = {
        ...values,
        status: values.status?.name || values.status,
        priority: values.priority?.name || values.priority
      };

      if (editingProject) {
        // Update project
        await axiosInstance.put(`/api/projects/${editingProject.id}`, projectData);
        showSnackbar('Project updated successfully', 'success');
      } else {
        // Add new project
        await axiosInstance.post('/api/projects', projectData);
        showSnackbar('Project added successfully', 'success');
      }

      resetForm();
      setOpenDialog(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      showSnackbar('Error saving project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await axiosInstance.delete(`/api/projects/${projectToDelete.id}`);
      showSnackbar('Project deleted successfully', 'success');
      setProjects(projects.filter(project => project.id !== projectToDelete.id));
    } catch (error) {
      console.error('Error deleting project:', error);
      showSnackbar('Error deleting project', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle edit project
  const handleEdit = (project) => {
    setEditingProject(project);
    setOpenDialog(true);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.priority?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DataGrid columns
  const columns = [
    { field: 'projectName', headerName: 'Project Name', width: 200 },
    { field: 'client', headerName: 'Client', width: 150 },
    { field: 'projectManager', headerName: 'Project Manager', width: 150 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value?.name || params.value}
          color={params.value?.color || 'default'}
          size="small"
        />
      )
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value?.name || params.value}
          color={params.value?.color || 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    { 
      field: 'budget', 
      headerName: 'Budget', 
      width: 120,
      renderCell: (params) => `$${params.value?.toLocaleString()}`
    },
    { field: 'teamSize', headerName: 'Team Size', width: 100 },
    { 
      field: 'progress', 
      headerName: 'Progress', 
      width: 120,
      renderCell: (params) => {
        const progress = calculateProgress(params.row);
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setProjectToDelete(params.row);
                setDeleteConfirmOpen(true);
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Paper elevation={2} sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ p: 3 }}>
        
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Manage projects, track progress, and maintain project portfolios
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project management tabs">
          <Tab label="Project List" />
          <Tab label="Add Project" />
          <Tab label="Project Cards" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">All Projects</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <SearchBar 
                label="Search Projects"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Project
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={filteredProjects}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                }}
              />
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Add New Project</Typography>
          <Formik
            initialValues={initialFormValues}
            validationSchema={projectValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, resetForm }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextInput name="projectName" label="Project Name" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput name="client" label="Client" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput 
                      name="description" 
                      label="Description" 
                      multiline 
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput name="projectManager" label="Project Manager" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput name="teamSize" label="Team Size" type="number" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SelectInput
                      name="status"
                      label="Status"
                      options={projectStatuses}
                      getOptionLabel={(option) => option.label}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SelectInput
                      name="priority"
                      label="Priority"
                      options={projectPriorities}
                      getOptionLabel={(option) => option.label}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput name="budget" label="Budget ($)" type="number" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput name="startDate" label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput name="endDate" label="End Date" type="date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddIcon />}
                      >
                        {isSubmitting ? 'Adding...' : 'Add Project'}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        color="textblack"
                        onClick={() => resetForm()}
                      >
                        Reset
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Project Cards</Typography>
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <WorkIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                          {project.projectName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={project.status?.name || project.status}
                            size="small"
                            color={project.status?.color || 'default'}
                          />
                          <Chip
                            label={project.priority?.name || project.priority}
                            size="small"
                            color={project.priority?.color || 'default'}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2">{project.client}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2">{project.projectManager}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2">${project.budget?.toLocaleString()}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssignmentTurnedInIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2">Team: {project.teamSize} members</Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progress: {Math.round(calculateProgress(project))}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={calculateProgress(project)} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      {project.startDate} - {project.endDate}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setProjectToDelete(project);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Add/Edit Project Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setEditingProject(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
              <IconButton
                onClick={() => {
                  setOpenDialog(false);
                  setEditingProject(null);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Formik
              initialValues={editingProject ? {
                projectName: editingProject.projectName,
                description: editingProject.description,
                client: editingProject.client,
                projectManager: editingProject.projectManager,
                status: projectStatuses.find(s => s.name === editingProject.status?.name) || null,
                priority: projectPriorities.find(p => p.name === editingProject.priority?.name) || null,
                budget: editingProject.budget,
                startDate: editingProject.startDate,
                endDate: editingProject.endDate,
                teamSize: editingProject.teamSize
              } : initialFormValues}
              validationSchema={projectValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                      <TextInput name="projectName" label="Project Name" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextInput name="client" label="Client" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput 
                        name="description" 
                        label="Description" 
                        multiline 
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextInput name="projectManager" label="Project Manager" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextInput name="teamSize" label="Team Size" type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SelectInput
                        name="status"
                        label="Status"
                        options={projectStatuses}
                        getOptionLabel={(option) => option.label}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <SelectInput
                        name="priority"
                        label="Priority"
                        options={projectPriorities}
                        getOptionLabel={(option) => option.label}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextInput name="budget" label="Budget ($)" type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextInput name="startDate" label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextInput name="endDate" label="End Date" type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                  </Grid>
                  <DialogActions sx={{ mt: 3 }}>
                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                        setEditingProject(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                      {isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Add')}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the project "{projectToDelete?.projectName}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="textblack">Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
