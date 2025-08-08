"use client";

import { useState, useEffect } from "react";

import { API_PATHS } from "../_utils/apiPaths";
import axiosInstance from "../_utils/axiosInstance";


export const useDesignations = () => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDesignations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(API_PATHS.DESIGNATIONS.GET_ALL);

            if (response.data && Array.isArray(response.data)) {
                const designationData = response.data.map(desig => ({
                    id: desig.id,
                    name: desig.designationName,
                    label: desig.designationName
                }));
                setDesignations(designationData);
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
        fetchDesignations();
    }, []);

    return {
        designations,
        loading,
        error,
        refetch: fetchDesignations
    };
};
