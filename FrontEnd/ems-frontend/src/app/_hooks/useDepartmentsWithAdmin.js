"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";


export const useDepartmentsWithAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartmentsWithAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found, using fallback departments");
        return;
      }
      
      const response = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_DEPARTMENTS_WITH_ADMIN);

      if (response.data && Array.isArray(response.data)) {
        // Transform department data to match the expected format
        const departmentData = response.data.map(dept => ({
          id: dept.departmentId,  // Use departmentId from backend
          name: dept.departmentName,
          adminid:dept.adminId,
          label: dept.departmentName // Use name as label
        }));
        setDepartments(departmentData);
      } else {
        console.warn("Invalid departments response format:", response.data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartmentsWithAdmin
  };
};
