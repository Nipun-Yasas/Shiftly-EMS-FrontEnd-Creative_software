"use client";

import React,{createContext,useState,useEffect} from "react";

export const UserContext = createContext();

const UserProvider = ({children})=>{
    const [user,setUser] = useState(null);

    // Initialize user from localStorage on startup
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    const updateUser = (userData)=>{
        setUser(userData);
        // Also store in localStorage for persistence
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        }
    };

    const clearUser = ()=>{
        setUser(null);
        // Also clear from localStorage
        localStorage.removeItem("user");
    };

    return(
        <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
        }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;