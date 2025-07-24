"use client";

import React, { useState, useEffect, useContext } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
import { UserContext } from "../../../context/UserContext";
import { useDepartments } from "../../../_hooks/useDepartments";
import { useTeams } from "../../../_hooks/useTeams";
import AllTab from "./_components/AllTab";
import AddTab from "./_components/AddTab";
import EditDialog from "./_components/EditDialog";
import DeleteDialog from "./_components/DeleteDialog";
import TabPanel from "../../../_components/main/TabPanel";

const projectStatuses = [
  { id: 1, name: "Planning", label: "Planning", color: "info" },
  { id: 2, name: "In Progress", label: "In Progress", color: "primary" },
  { id: 3, name: "On Hold", label: "On Hold", color: "warning" },
  { id: 4, name: "Completed", label: "Completed", color: "success" },
  { id: 5, name: "Cancelled", label: "Cancelled", color: "error" },
];

export default function ProjectManagementPage() {
  const { user } = useContext(UserContext);
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Use custom hooks for departments and teams
  const { departments, loading: loadingDepartments, error: departmentsError } = useDepartments();
  
  // State for selected department to filter teams
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  
  // Fetch teams based on selected department (or all teams if no department selected)
  const { teams, loading: loadingTeams, error: teamsError } = useTeams(selectedDepartmentId);

  const initialFormValues = {
    projectName: "",
    description: "",
    department: null,
    teamName: null,
    startDate: null,
    deadline: null,
    progress: 0,
  };

  const getEditInitialValues = (project) => {
    if (project) {
      const selectedDept = departments.find((d) => d.name === project.departmentName) || null;
      
      // Set the department ID for team filtering when editing
      if (selectedDept) {
        setSelectedDepartmentId(selectedDept.id);
      }
      
      return {
        projectName: project.projectName || "",
        description: project.description || "",
        department: selectedDept,
        teamName: teams.find((t) => t.name === project.teamName) || null,
        startDate: project.startDate || null,
        deadline: project.deadline || null,
        progress: project.progress || 0,
      };
    }
    return initialFormValues;
  };

  // Fetch projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      
      if (response.data && Array.isArray(response.data)) {
        // Map backend data to frontend format
        const mappedProjects = response.data.map(project => ({
          id: project.projectId,
          projectName: project.name,
          description: project.description,
          teamName: project.teamName || "No Team",
          departmentName: project.departmentName || "No Department",
          startDate: project.startDate,
          deadline: project.endDate,
          progress: project.progress || 0,
        }));
        
        setProjects(mappedProjects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      
      showSnackbar("Failed to fetch projects from server", "error");
      
      // Fallback to sample data for demo
      setProjects([
        {
          id: 1,
          projectName: "Sample E-Commerce Platform",
          description: "Demo project - backend connection failed",
          teamName: "Demo Team",
          startDate: "2024-01-15",
          deadline: "2024-06-30",
          progress: 65,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for Add Project tab
  const handleAddSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      
      // Check if user is available
      if (!user || !user.id) {
        showSnackbar("User not authenticated. Please log in again.", "error");
        setSubmitting(false);
        return;
      }
      
      // More flexible validation - check if department exists and has an id
      let departmentId = null;
      if (values.department) {
        if (typeof values.department === 'object' && values.department.id) {
          departmentId = values.department.id;
        } else if (typeof values.department === 'number') {
          departmentId = values.department;
        }
      }
      
      if (!departmentId) {
        showSnackbar("Please select a department", "error");
        setSubmitting(false);
        return;
      }
      
      // More flexible validation - check if team exists and has an id
      let teamId = null;
      if (values.teamName) {
        if (typeof values.teamName === 'object' && values.teamName.id) {
          teamId = values.teamName.id;
        } else if (typeof values.teamName === 'number') {
          teamId = values.teamName;
        }
      }
      
      if (!teamId) {
        showSnackbar("Please select a team", "error");
        setSubmitting(false);
        return;
      }
      
      // Map frontend form data to backend DTO format
      const projectData = {
        name: values.projectName,
        description: values.description,
        startDate: values.startDate,
        endDate: values.deadline,
        progress: parseInt(values.progress) || 0,
        userId: user.id,
        departmentId: departmentId,
        teamId: teamId,
      };
      
      const response = await axiosInstance.post(API_PATHS.PROJECTS.ADD_PROJECT, projectData);
      
      showSnackbar("Project created successfully!", "success");
      resetForm();
      setTabValue(0); // Switch back to project list
      fetchProjects(); // Refresh the project list
      
    } catch (error) {
      
      let errorMessage = "Failed to create project";
      
      if (error.response?.data) {
        // Check for specific error messages in response
        const responseData = error.response.data;
        
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.details) {
          errorMessage = responseData.details;
        }
        
      }
      
      if (error.response?.status === 500) {
        errorMessage += " (Server Error - Check backend logs)";
      } else if (error.response?.status === 400) {
        errorMessage += " (Bad Request - Check form data)";
      } else if (error.response?.status === 404) {
        errorMessage += " (Not Found - Check API endpoint)";
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for Edit Project dialog
  const handleEditSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      
      // Check if user is available
      if (!user || !user.id) {
        showSnackbar("User not authenticated. Please log in again.", "error");
        setSubmitting(false);
        return;
      }
      
      // Validate required fields
      if (!values.department || !values.department.id) {
        showSnackbar("Please select a department", "error");
        setSubmitting(false);
        return;
      }
      
      if (!values.teamName || !values.teamName.id) {
        showSnackbar("Please select a team", "error");
        setSubmitting(false);
        return;
      }
      
      // Map frontend form data to backend DTO format
      const projectData = {
        name: values.projectName,
        description: values.description,
        startDate: values.startDate,
        endDate: values.deadline,
        progress: parseInt(values.progress) || 0,
        userId: user.id,
        departmentId: values.department.id,
        teamId: values.teamName.id,
      };

      const response = await axiosInstance.put(
        API_PATHS.PROJECTS.UPDATE_PROJECT(editingProject.id),
        projectData);
      
      showSnackbar("Project updated successfully!", "success");
      resetForm();
      setEditDialogOpen(false);
      setEditingProject(null);
      fetchProjects(); // Refresh the project list
      
    } catch (error) {
      
      let errorMessage = "Failed to update project";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please ensure teams and departments exist in the database.";
      } else if (error.response?.status === 404) {
        errorMessage = "Project not found. It may have been deleted.";
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      
      await axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectToDelete.id));
      
      showSnackbar("Project deleted successfully!", "success");
      
      // Remove from local state immediately for better UX
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectToDelete.id)
      );
      
      // Also refresh from server to ensure consistency
      fetchProjects();
      
    } catch (error) {
      
      let errorMessage = "Failed to delete project";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Project not found. It may have been already deleted.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error while deleting project.";
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  // Show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle edit project - opens modal
  const handleEdit = (project) => {
    setEditingProject(project);
    setEditDialogOpen(true);
  };

  // Function to handle department selection change
  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartmentId(departmentId);
  };

  // Handle delete project
  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle add project button click - switches to Add Project tab
  const handleAddProject = () => {
    setTabValue(1); // Switch to Add Project tab
  };


  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{ height: "100%", width: "100%"}}
    >
      <Box sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="project management tabs"
        >
          <Tab label="Project List" />
          <Tab label="Add Project" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AllTab
            projects={projects}
            loading={loading}
            onAddProject={handleAddProject}
            onEditProject={handleEdit}
            onDeleteProject={handleDeleteProject}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Show loading message if departments or teams are still loading */}
          {(loadingDepartments || loadingTeams) && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Loading {loadingDepartments ? 'departments' : ''} {loadingDepartments && loadingTeams ? 'and' : ''} {loadingTeams ? 'teams' : ''}...
            </Alert>
          )}
          
          {/* Show warning if no departments or teams are available */}
          {!loadingDepartments && departments.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No departments available. Please add departments to the system first.
            </Alert>
          )}
          
          {!loadingTeams && teams.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No teams available. Please add teams to the system first.
            </Alert>
          )}
          
          <AddTab
            onSubmit={handleAddSubmit}
            projectStatuses={projectStatuses}
            initialFormValues={initialFormValues}
            departments={departments}
            teams={teams}
            loadingDepartments={loadingDepartments}
            loadingTeams={loadingTeams}
            onDepartmentChange={handleDepartmentChange}
            disabled={loadingDepartments || loadingTeams || departments.length === 0 || teams.length === 0}
          />
        </TabPanel>

        <EditDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingProject(null);
            setSelectedDepartmentId(null); // Reset department filter when closing
          }}
          onSubmit={handleEditSubmit}
          editingProject={editingProject}
          projectStatuses={projectStatuses}
          departments={departments}
          teams={teams}
          loadingDepartments={loadingDepartments}
          loadingTeams={loadingTeams}
          onDepartmentChange={handleDepartmentChange}
          getEditInitialValues={getEditInitialValues}
        />

        <DeleteDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          projectName={projectToDelete?.projectName}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Show error alerts for departments/teams if needed */}
        {departmentsError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Failed to load departments. Some features may not work properly.
          </Alert>
        )}
        
        {teamsError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Failed to load teams. Some features may not work properly.
          </Alert>
        )}
      </Box>
    </Paper>
  );
}
