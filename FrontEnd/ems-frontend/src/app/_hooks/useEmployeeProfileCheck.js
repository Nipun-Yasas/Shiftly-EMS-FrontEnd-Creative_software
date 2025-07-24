"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../_utils/axiosInstance";
import { API_PATHS } from "../_utils/apiPaths";
import { employeeProfileCache } from "../_utils/employeeProfileCache";

/**
 * Custom hook to check if the current user has an employee profile
 * If not found, redirects to employee update page (except when already on employee pages)
 */
export default function useEmployeeProfileCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const [hasEmployeeProfile, setHasEmployeeProfile] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkEmployeeProfile = async () => {
      // Skip check if no user
      if (!user) {
        setIsChecking(false);
        setShouldRender(true);
        return;
      }

      // Skip check if already on any employee-related page
      // This prevents infinite redirects when users are trying to create/update their profile
      if (pathname.startsWith("/employee")) {
        setIsChecking(false);
        setShouldRender(true);
        setHasEmployeeProfile(true); // Assume true to avoid unnecessary API calls
        // Clear any negative cache when user reaches employee pages
        if (employeeProfileCache.getStatus() === false) {
          employeeProfileCache.clear();
        }
        return;
      }

      // Skip check if user doesn't have a token
      const token = localStorage.getItem("token");
      if (!token) {
        setIsChecking(false);
        setShouldRender(true);
        return;
      }

      // Check cache first for faster response
      const cachedProfileStatus = employeeProfileCache.getStatus();
      if (cachedProfileStatus === true) {
        setHasEmployeeProfile(true);
        setShouldRender(true);
        setIsChecking(false);
        return;
      }

      try {
        const response = await axiosInstance.get(API_PATHS.EMPLOYEE.GET_PROFILE);
        
        if (response.data) {
          setHasEmployeeProfile(true);
          setShouldRender(true);
          // Cache the positive result
          employeeProfileCache.setStatus(true);
        }
      } catch (error) {
        // If 404 or any error, assume no employee profile exists
        if (error.response && error.response.status === 404) {
          console.log("Employee profile not found, redirecting to update page");
        } else {
          console.log("Error checking employee profile, redirecting to update page");
        }
        
        setHasEmployeeProfile(false);
        // Cache the negative result
        employeeProfileCache.setStatus(false);
        
        // Redirect to employee update page if not already on employee pages
        if (!pathname.startsWith("/employee")) {
          router.replace("/employee/update");
        }
        return; // Don't set shouldRender to true
      } finally {
        setIsChecking(false);
      }
    };

    checkEmployeeProfile();
  }, [user, router, pathname]);

  // Additional immediate redirect check for better UX
  useEffect(() => {
    if (user && !pathname.startsWith("/employee")) {
      const token = localStorage.getItem("token");
      if (token) {
        // Check if we have cached info about missing employee profile
        const cachedProfileStatus = employeeProfileCache.getStatus();
        if (cachedProfileStatus === false) {
          router.replace("/employee/update");
          return;
        }
      }
    }
  }, [user, pathname, router]);

  // Function to clear the cache (useful for logout or profile updates)
  const clearProfileCache = () => {
    employeeProfileCache.clear();
  };

  return { isChecking, hasEmployeeProfile, shouldRender, clearProfileCache };
}
