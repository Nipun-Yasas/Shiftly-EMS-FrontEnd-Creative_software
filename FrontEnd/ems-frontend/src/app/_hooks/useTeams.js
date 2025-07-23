"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching teams from:", API_PATHS.TEAMS.GET_ALL_TEAMS);
      const response = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);
      
      console.log("Raw teams response:", response.data);
      
      // Transform team data to match the expected format
      const teamData = response.data.map(team => ({
        id: team.teamId,  // Map teamId to id
        name: team.name,
        label: team.name, // Use name as label
        departmentId: team.departmentId, // Include department info
        departmentName: team.departmentName
      }));
      
      console.log("Transformed teams:", teamData);
      setTeams(teamData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError(error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams
  };
};