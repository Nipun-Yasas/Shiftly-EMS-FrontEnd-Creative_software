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
import AllProjectTab from "./_components/AllProjectTab";
import AddProjectTab from "./_components/AddProjectTab";
import EditProjectDialog from "./_components/EditProjectDialog";
import DeleteConfirmDialog from "./_components/DeleteConfirmDialog";
import TabPanel from "../_components/TabPanel";

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
    client: "",
    projectManager: "",
    status: null,
    startDate: "",
    endDate: "",
    teamSize: "",
  };

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Replace with actual API call when backend is ready
      const response = await axiosInstance.get("/api/projects");
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showSnackbar("Error fetching projects", "error");
      // Set sample data for demo purposes
      setProjects([
        {
          id: 1,
          projectName: "E-Com Platform",
          description:
            "Development of a modern e-commerce platform with advanced features",
          client: "TechCorp Inc.",
          projectManager: "John Smith",
          status: { name: "In Progress", color: "primary" },
          startDate: "2024-01-15",
          endDate: "2024-06-30",
          teamSize: 8,
        },
        {
          id: 2,
          projectName: "Mobile Bank App",
          description: "Secure mobile banking application for iOS and Android",
          client: "National Bank",
          projectManager: "Sarah Johnson",
          status: { name: "Planning", color: "info" },
          startDate: "2024-03-01",
          endDate: "2024-09-15",
          teamSize: 12,
        },
        {
          id: 3,
          projectName: "Inventory Mgt System",
          description: "Web-based inventory tracking and management system",
          client: "RetailMax Ltd.",
          projectManager: "Mike Davis",
          status: { name: "Completed", color: "success" },
          startDate: "2023-08-01",
          endDate: "2023-12-31",
          teamSize: 5,
        },
        {
          id: 4,
          projectName: "Learning Mgt System",
          description:
            "Online learning platform with video streaming capabilities",
          client: "EduTech Solutions",
          projectManager: "Emma Wilson",
          status: { name: "On Hold", color: "warning" },
          startDate: "2024-02-01",
          endDate: "2024-08-30",
          teamSize: 6,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for Add Project tab
  const handleAddSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const projectData = {
        ...values,
        status: values.status?.name || values.status,
        priority: values.priority?.name || values.priority,
      };

      // Add new project
      await axiosInstance.post("/api/projects", projectData);
      showSnackbar("Project added successfully", "success");

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
      showSnackbar("Error adding project", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for Edit Project dialog
  const handleEditSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const projectData = {
        ...values,
        status: values.status?.name || values.status,
        priority: values.priority?.name || values.priority,
      };

      // Update project
      await axiosInstance.put(
        `/api/projects/${editingProject.id}`,
        projectData
      );
      showSnackbar("Project updated successfully", "success");

      resetForm();
      setEditDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      showSnackbar("Error updating project", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await axiosInstance.delete(`/api/projects/${projectToDelete.id}`);
      showSnackbar("Project deleted successfully", "success");
      setProjects(
        projects.filter((project) => project.id !== projectToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
      showSnackbar("Error deleting project", "error");
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
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectManager
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      project.status?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.priority?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Paper elevation={2} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="project management tabs"
        >
          <Tab label="Project List" />
          <Tab label="Add Project" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AllProjectTab
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
          <AddProjectTab
            onSubmit={handleAddSubmit}
            projectStatuses={projectStatuses}
            initialFormValues={initialFormValues}
          />
        </TabPanel>

        {/* Edit Project Dialog */}
        <EditProjectDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleEditSubmit}
          editingProject={editingProject}
          projectStatuses={projectStatuses}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          projectName={projectToDelete?.projectName}
        />

        {/* Snackbar for notifications */}
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
