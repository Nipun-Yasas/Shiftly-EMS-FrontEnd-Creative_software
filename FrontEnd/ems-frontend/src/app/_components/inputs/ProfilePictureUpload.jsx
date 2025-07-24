'use client';

import { useState, useRef, useContext } from "react";
import { Box, Button, Typography, IconButton, Avatar, CircularProgress } from "@mui/material";
import { useField, useFormikContext } from "formik";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserContext } from "../../context/UserContext";
import { 
  saveProfilePicture, 
  getProfilePicture, 
  removeProfilePicture, 
  compressImage, 
  validateImageFile 
} from "../../_utils/profilePictureUtils";

export default function ProfilePictureUpload({
  name,
  label = "Profile Picture",
  currentImage = null,
}) {
  const { setFieldValue, setFieldTouched, touched, errors, values } = useFormikContext();
  const [field] = useField(name);
  const { user } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get saved profile picture from localStorage or use currentImage
  const savedProfilePicture = getProfilePicture(user?.id || user?.username);
  const [preview, setPreview] = useState(savedProfilePicture || currentImage);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      
      try {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          alert(validation.error);
          setIsLoading(false);
          return;
        }

        // Compress image
        const compressedImageData = await compressImage(file, 400, 400, 0.8);
        
        // Update form field
        setFieldValue(name, file);
        setFieldTouched(name, true, false);
        
        // Update preview
        setPreview(compressedImageData);
        
        // Save to localStorage with user-specific key
        if (user?.id || user?.username) {
          saveProfilePicture(compressedImageData, user?.id || user?.username);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemove = () => {
    // Clear form field
    setFieldValue(name, null);
    setFieldTouched(name, true, false);
    
    // Clear preview
    setPreview(null);
    
    // Remove from localStorage
    if (user?.id || user?.username) {
      removeProfilePicture(user?.id || user?.username);
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Profile Picture Display */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={preview}
            alt="Profile Picture"
            sx={{
              width: { xs: 120, sm: 140, md: 160 },
              height: { xs: 120, sm: 140, md: 160 },
              border: "3px solid",
              borderColor: errors[name] && touched[name] ? "error.main" : "primary.main",
              cursor: isLoading ? "default" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
            onClick={!isLoading ? handleClick : undefined}
          >
            {!preview && !isLoading && <PhotoCameraIcon sx={{ fontSize: 40 }} />}
            {isLoading && <CircularProgress size={40} />}
          </Avatar>
          
          {/* Camera overlay for change */}
          {!isLoading && (
            <IconButton
              onClick={handleClick}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "primary.main",
                color: "white",
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                boxShadow: 2,
              }}
              size="small"
            >
              <PhotoCameraIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </IconButton>
          )}

          {/* Remove button if image exists */}
          {preview && !isLoading && (
            <IconButton
              onClick={handleRemove}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "error.main",
                color: "white",
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                "&:hover": {
                  backgroundColor: "error.dark",
                },
                boxShadow: 2,
              }}
              size="small"
            >
              <DeleteIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
          )}
        </Box>

        {/* Label */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: errors[name] && touched[name] ? "error.main" : "text.secondary",
          }}
        >
          {label}
        </Typography>

        {/* Upload Button */}
        <Button
          variant="outlined"
          onClick={handleClick}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
          sx={{
            borderColor: errors[name] && touched[name] ? "error.main" : "primary.main",
            color: errors[name] && touched[name] ? "error.main" : "primary.main",
          }}
        >
          {isLoading ? "Processing..." : preview ? "Change Picture" : "Upload Picture"}
        </Button>

        {/* Error message */}
        {errors[name] && touched[name] && (
          <Typography
            color="error"
            sx={{ fontSize: "0.875rem", textAlign: "center" }}
          >
            {errors[name]}
          </Typography>
        )}

        {/* Help text */}
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            maxWidth: 250,
          }}
        >
          Upload a profile picture (JPG, PNG, GIF). Max size: 5MB
        </Typography>
      </Box>
    </Box>
  );
}
