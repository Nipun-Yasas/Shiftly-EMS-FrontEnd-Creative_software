"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_ALL);

      const departmentData = response.data.map(dept => ({
        id: dept.departmentId,
        name: dept.departmentName,
        label: dept.departmentName
      }));
      setDepartments(departmentData);
    } catch (error) {
      setError(error);
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
