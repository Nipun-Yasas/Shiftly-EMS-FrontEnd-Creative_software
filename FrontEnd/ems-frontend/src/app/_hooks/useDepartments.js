"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_ALL_DEPARTMENTS);

      // Transform department data to match the expected format
      const departmentData = response.data.map(dept => ({
        id: dept.departmentId,  // Map departmentId to id
        name: dept.name,
        label: dept.name // Use name as label
      }));
      setDepartments(departmentData);
    } catch (error) {
      setError(error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments
  };
};
