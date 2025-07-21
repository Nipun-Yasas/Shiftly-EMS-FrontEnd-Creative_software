"use client";

import React, { useEffect,useContext } from 'react'

import { UserContext } from '../context/UserContext'

import {API_PATHS} from '../_utils/apiPaths'
import axiosInstance  from '../_utils/axiosInstance'

import { useRouter } from "next/navigation";

import next from 'next';

export default function useUserAuth() {

    const {user, updateUser, clearUser} = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        // Only fetch from backend if we don't have user data yet
        if(user) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (token) {
                    // Verify with backend and get latest user data
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_CURRENT_USER);

                    if (isMounted && response.data) {
                        updateUser(response.data);
                    }
                } else {
                    // No token, clear everything and redirect
                    if (isMounted) {
                        clearUser();
                        router.push("/");
                    }
                }
            }
            catch(error){
                console.error("Error fetching user info:", error);
                if(isMounted){
                    // Clear session on error
                    clearUser();
                    localStorage.removeItem("token");
                    router.push("/");
                }
            }
        };
        
        fetchUserInfo();

        return () => {
            isMounted = false;
        };

    }, [user, updateUser, clearUser, router]);

}
