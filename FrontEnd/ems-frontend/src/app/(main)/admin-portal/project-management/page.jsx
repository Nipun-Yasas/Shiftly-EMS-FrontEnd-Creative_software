"use client";

import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { API_PATHS } from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";
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
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [searchQuery, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      return {
        projectName: project.projectName || "",
        description: project.description || "",
        department:
          departments.find((d) => d.name === project.department) || null,
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
      console.log("Fetching projects from:", API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS);
      console.log("Backend response:", response.data);
      
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
        
        console.log("Mapped projects:", mappedProjects);
        setProjects(mappedProjects);
      } else {
        console.warn("Invalid response format or no data");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      console.error("Error details:", error.response?.data);
      
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
      console.log("Form values received:", values);
      
      // Map frontend form data to backend DTO format
      const projectData = {
        name: values.projectName,
        description: values.description,
        startDate: values.startDate,
        endDate: values.deadline,
        progress: parseInt(values.progress) || 0,
      };

      // Only include team and department if selected
      if (values.teamName?.name) {
        projectData.teamName = values.teamName.name;
      }
      
      if (values.department?.name) {
        projectData.departmentName = values.department.name;
      }

      console.log("Sending to backend:", projectData);
      
      const response = await axiosInstance.post(API_PATHS.PROJECTS.ADD_PROJECT, projectData);
      console.log("Backend response:", response.data);
      
      showSnackbar("Project created successfully!", "success");
      resetForm();
      setTabValue(0); // Switch back to project list
      fetchProjects(); // Refresh the project list
      
    } catch (error) {
      console.error("Error creating project:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Failed to create project";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please ensure teams and departments exist in the database.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid project data. Please check all required fields.";
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for Edit Project dialog
  const handleEditSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Edit form values:", values);
      console.log("Editing project:", editingProject);
      
      // Map frontend form data to backend DTO format
      const projectData = {
        name: values.projectName,
        description: values.description,
        startDate: values.startDate,
        endDate: values.deadline,
        progress: parseInt(values.progress) || 0,
      };

      // Only include team and department if selected
      if (values.teamName?.name) {
        projectData.teamName = values.teamName.name;
      }
      
      if (values.department?.name) {
        projectData.departmentName = values.department.name;
      }

      console.log("Updating project ID:", editingProject.id);
      console.log("Sending update data:", projectData);
      
      const response = await axiosInstance.put(
        API_PATHS.PROJECTS.UPDATE_PROJECT(editingProject.id),
        projectData
      );
      console.log("Update response:", response.data);
      
      showSnackbar("Project updated successfully!", "success");
      resetForm();
      setEditDialogOpen(false);
      setEditingProject(null);
      fetchProjects(); // Refresh the project list
      
    } catch (error) {
      console.error("Error updating project:", error);
      console.error("Error response:", error.response?.data);
      
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
      console.log("Deleting project ID:", projectToDelete.id);
      
      await axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectToDelete.id));
      
      showSnackbar("Project deleted successfully!", "success");
      
      // Remove from local state immediately for better UX
      setProjects(prevProjects => 
        prevProjects.filter(project => project.id !== projectToDelete.id)
      );
      
      // Also refresh from server to ensure consistency
      fetchProjects();
      
    } catch (error) {
      console.error("Error deleting project:", error);
      console.error("Error response:", error.response?.data);
      
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

  // Filter projects based on search term
  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            projects={filteredProjects}
            loading={loading}
            searchQuery={searchQuery}
            handleSearchChange={(e) => setSearchTerm(e.target.value)}
            onAddProject={handleAddProject}
            onEditProject={handleEdit}
            onDeleteProject={handleDeleteProject}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AddTab
            onSubmit={handleAddSubmit}
            projectStatuses={projectStatuses}
            initialFormValues={initialFormValues}
          />
        </TabPanel>

        <EditDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleEditSubmit}
          editingProject={editingProject}
          projectStatuses={projectStatuses}
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
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
}
