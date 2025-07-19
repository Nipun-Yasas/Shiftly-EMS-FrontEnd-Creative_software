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
          projectName: "E-Commerce Platform",
          description:
            "Development of a modern e-commerce platform with advanced features including payment gateway, inventory management, and user analytics",
          teamName: "Alpha Team",
          startDate: "2024-01-15",
          deadline: "2024-06-30",
          progress: 65,
        },
        {
          id: 2,
          projectName: "Mobile Banking App",
          description:
            "Secure mobile banking application for iOS and Android with biometric authentication and real-time transaction monitoring",
          teamName: "Beta Team",
          startDate: "2024-03-01",
          deadline: "2024-09-15",
          progress: 25,
        },
        {
          id: 3,
          projectName: "Inventory Management System",
          description:
            "Web-based inventory tracking and management system with barcode scanning and automated reorder alerts",
          teamName: "Gamma Team",
          startDate: "2023-08-01",
          deadline: "2023-12-31",
          progress: 100,
        },
        {
          id: 4,
          projectName: "Learning Management System",
          description:
            "Online learning platform with video streaming capabilities, quiz engine, and progress tracking for educational institutions",
          teamName: "Delta Team",
          startDate: "2024-02-01",
          deadline: "2024-08-30",
          progress: 45,
        },
        {
          id: 5,
          projectName: "CRM Dashboard",
          description:
            "Customer relationship management dashboard with sales pipeline tracking, lead management, and reporting analytics",
          teamName: "Epsilon Team",
          startDate: "2024-04-01",
          deadline: "2024-10-15",
          progress: 30,
        },
        {
          id: 6,
          projectName: "Healthcare Portal",
          description:
            "Patient management portal with appointment scheduling, medical records access, and telemedicine integration",
          teamName: "Zeta Team",
          startDate: "2024-01-01",
          deadline: "2024-07-31",
          progress: 80,
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
