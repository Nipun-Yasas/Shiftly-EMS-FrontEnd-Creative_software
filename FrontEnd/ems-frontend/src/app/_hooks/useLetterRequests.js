import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../_utils/axiosInstance';
import { API_PATHS } from '../_utils/apiPaths';

export const useLetterRequests = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a letter request (User)
  const createLetterRequest = useCallback(async (employeeId, requestData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        API_PATHS.LETTER.REQUEST.ADD(employeeId),
        requestData
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create letter request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get letter requests by employee ID (User)
  const getLetterRequestsByEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        API_PATHS.LETTER.REQUEST.MY(employeeId)
      );
      setLetterRequests(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch letter requests');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get letter requests for admin's department (Admin)
  const getLetterRequestsForAdmin = useCallback(async (adminUserId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        API_PATHS.LETTER.REQUEST.BY_ADMIN(adminUserId)
      );
      setLetterRequests(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch letter requests for admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all letter requests (Admin)
  const getAllLetterRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(API_PATHS.LETTER.REQUEST.ALL);
      setLetterRequests(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all letter requests');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate letter for a request (Admin)
  const generateLetter = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        API_PATHS.LETTER.REQUEST.GENERATE(requestId)
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate letter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete letter request (User)
  const deleteLetterRequest = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(API_PATHS.LETTER.REQUEST.DELETE(requestId));
      // Remove from local state
      setLetterRequests(prev => prev.filter(request => request.id !== requestId));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete letter request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update letter request status (Admin)
  const updateLetterRequestStatus = useCallback(async (requestId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.LETTER.REQUEST.UPDATE_STATUS(requestId)}?status=${encodeURIComponent(status)}`
      );
      
      // Update local state
      setLetterRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: status }
            : request
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update letter request status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update letter request (User)
  const updateLetterRequest = useCallback(async (requestId, requestData) => {
    setLoading(true);
    setError(null);
    try {
      // Prepare the request data with proper JSON serialization
      const payload = {
        letterType: requestData.letterType,
        fieldsJson: requestData.fields ? JSON.stringify(requestData.fields) : requestData.fieldsJson
      };
      
      const response = await axiosInstance.put(
        API_PATHS.LETTER.REQUEST.UPDATE(requestId),
        payload
      );
      
      // Update local state
      setLetterRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, ...response.data }
            : request
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update letter request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh letter requests based on user role
  const refreshLetterRequests = useCallback(async (user) => {
    if (!user) return;

    const roles = (user.roles || []).map(r => r.toLowerCase());
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');

    try {
      if (isAdmin) {
        if (user.id) {
          await getLetterRequestsForAdmin(user.id);
        } else {
          await getAllLetterRequests();
        }
      } else {
        const employeeId = user.employeeId || user.id;
        if (employeeId) {
          await getLetterRequestsByEmployee(employeeId);
        }
      }
    } catch (err) {
      console.error('Failed to refresh letter requests:', err);
    }
  }, [getLetterRequestsForAdmin, getAllLetterRequests, getLetterRequestsByEmployee]);

  return {
    letterRequests,
    loading,
    error,
    createLetterRequest,
    getLetterRequestsByEmployee,
    getLetterRequestsForAdmin,
    getAllLetterRequests,
    generateLetter,
    deleteLetterRequest,
    updateLetterRequestStatus,
    updateLetterRequest,
    refreshLetterRequests,
    clearError,
  };
};

export default useLetterRequests;
