"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";

export const useTeams = (departmentId = null) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTeams = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(API_PATHS.TEAMS.GET_ALL_TEAMS);

            // Transform team data to match the expected format
            let teamData = response.data.map(team => ({
                id: team.teamId,  // Map teamId to id
                name: team.name,
                label: team.name, // Use name as label
                departmentId: team.departmentId, // Include department info
                departmentName: team.departmentName
            }));
            
            // Filter teams by department if departmentId is provided
            if (departmentId !== null && departmentId !== undefined) {
                const originalCount = teamData.length;
                teamData = teamData.filter(team => {
                    // Convert both to strings for comparison in case of type mismatch
                    const teamDeptId = String(team.departmentId);
                    const filterDeptId = String(departmentId);
                    return teamDeptId === filterDeptId;
                });

            }

            setTeams(teamData);
        } catch (error) {
            setError(error);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if we have teams endpoint available
        fetchTeams();
    }, [departmentId]); // Re-fetch when departmentId changes

    return {
        teams,
        loading,
        error,
        refetch: fetchTeams
    };
};