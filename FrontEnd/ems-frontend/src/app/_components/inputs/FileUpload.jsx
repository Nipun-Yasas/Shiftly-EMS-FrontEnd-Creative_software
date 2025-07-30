'use client';

import { useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function FormikFileUpload({
  name,
  label,
  fileName,
  setFileName,
  preview,
  setPreview,
  fileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png", 
  showPreview = true,
}) {
  const { setFieldValue, setFieldTouched, touched, errors, values } =
    useFormikContext();
  const [field] = useField(name);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue(name, file);
      setFieldTouched(name, true, false);
      setFileName(file.name);

      const fileType = file.type;
      if (showPreview && fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPreview({
            type: "image",
            url: reader.result,
          });
        };
      } else if (showPreview && fileType === "application/pdf") {
        const url = URL.createObjectURL(file);
        setPreview({ type: "pdf", url });
      } else {
        setPreview(null);
      }
    }
  };

  const resetFile = () => {
    setFieldValue(name, null);
    setFileName("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!values[name]) resetFile();
  }, [values[name]]);

  return (
    <>
      <Box display="flex" justifyContent="center" width="100%">
        {errors[name] && touched[name] && (
          // Move Box out of Typography
          <Box>
            <Typography color="error" fontSize="0.875rem" mt={2} mx={2}>
              {errors[name]}
            </Typography>
          </Box>
        )}
        <Box sx={{width:{xs:'100%',sm:'50%'}}}>
          <input
            ref={fileInputRef}
            type="file"
            id={name}
            name={name}
            accept={fileTypes}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <Box textAlign="center" mt={2}>
            <label htmlFor={name}>
              <Button
                color="text.secondary"
                variant="outlined"
                component="span"
                startIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                }
                fullWidth
                sx={{
                  borderColor:
                    errors[name] && touched[name] ? "error.main" : "grey.500",
                  px: 2,
                  py: 1.5,
                  textTransform: "none",
                }}
              >
                {label || "Upload File"}
              </Button>
            </label>
          </Box>
        </Box>
      </Box>

      {showPreview && (
        <Box mt={2}>
          {preview ? (
            preview.type === "image" ? (
              <Box
                component="img"
                src={preview.url}
                alt="Preview"
                sx={{ width: "100%", height: 192, objectFit: "cover" }}
              />
            ) : preview.type === "pdf" ? (
              <Box
                component="iframe"
                src={preview.url}
                sx={{
                  width: "100%",
                  height: 192,
                  border: "1px solid #ccc",
                }}
                title="PDF Preview"
              />
            ) : null
          ) : (
            fileName && (
              <Typography fontSize="0.875rem" mt={1}>
                {fileName}
              </Typography>
            )
          )}
        </Box>
      )}
    </>
  );
}
