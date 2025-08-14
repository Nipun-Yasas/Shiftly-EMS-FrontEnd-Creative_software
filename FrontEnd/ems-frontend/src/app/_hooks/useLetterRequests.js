import { useState, useCallback } from 'react';
import axiosInstance from '../_utils/axiosInstance';
import { API_PATHS } from '../_utils/apiPaths';

export const useLetterRequests = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


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

  
  return {
    letterRequests,
    loading,
    error,
    getLetterRequestsByEmployee,
    generateLetter,
    updateLetterRequestStatus,
    updateLetterRequest,
    clearError,
  };
};

export default useLetterRequests;
