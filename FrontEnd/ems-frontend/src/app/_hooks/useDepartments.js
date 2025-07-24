"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";

// Fallback departments when backend is not available - matches your backend departments
const FALLBACK_DEPARTMENTS = [
  { id: 4, name: "BOOKINGNORDICS", label: "BOOKINGNORDICS" },
  { id: 1, name: "DIPS", label: "DIPS" },
  { id: 5, name: "LOVOLOD SOLUTION", label: "LOVOLOD SOLUTION" },
  { id: 6, name: "MEDIQ", label: "MEDIQ" },
  { id: 3, name: "ONEFLOW", label: "ONEFLOW" },
  { id: 2, name: "WINT", label: "WINT" },
];

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching departments from:", API_PATHS.DEPARTMENTS.GET_ALL_DEPARTMENTS);
      
      // Check if we have authentication token
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found, using fallback departments");
        setDepartments(FALLBACK_DEPARTMENTS);
        return;
      }
      
      const response = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_ALL_DEPARTMENTS);
      console.log("Departments response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        // Transform department data to match the expected format
        const departmentData = response.data.map(dept => ({
          id: dept.departmentId,  // Use departmentId from backend
          name: dept.name,
          label: dept.name // Use name as label
        }));
        console.log("Transformed departments:", departmentData);
        setDepartments(departmentData);
      } else {
        console.warn("Invalid departments response format:", response.data);
        console.log("Using fallback departments");
        setDepartments(FALLBACK_DEPARTMENTS);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      
      // Check if it's an authentication/authorization error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("Authentication/Authorization error - using fallback departments");
      } else if (error.response?.status === 500) {
        console.warn("Server error - using fallback departments");
      } else {
        console.warn("Network or other error - using fallback departments");
      }
      
      setError(error);
      
      // Use fallback departments in case of error
      console.log("Using fallback departments due to error");
      setDepartments(FALLBACK_DEPARTMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Temporarily skip backend call to avoid 500 errors
    // Use fallback departments directly until backend auth is fixed
    console.log("useDepartments: Using fallback departments (avoiding 500 error)");
    setDepartments(FALLBACK_DEPARTMENTS);
    setLoading(false);
    
    // TODO: Uncomment when backend authentication/authorization is fixed
    // fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments
  };
};
