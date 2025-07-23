"use client";

import { useState, useEffect } from "react";
import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVacancies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.VACANCIES.GET_ALL_VACANCIES);
      const vacancyData = response.data.map(vac => ({
        id: vac.id,
        name: vac.name,
        label: vac.name // Use name as label
      }));
      setVacancies(vacancyData);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      setError(error);
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  return {
    vacancies,
    loading,
    error,
    refetch: fetchVacancies
  };
}; 