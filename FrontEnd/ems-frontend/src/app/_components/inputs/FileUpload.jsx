import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography
} from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function FormikFileUpload({
  name,
  label,
  fileName,
  setFileName,
  preview,
  setPreview,
}) {
  const { setFieldValue, setFieldTouched, touched, errors, values } = useFormikContext();
  const [field] = useField(name);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue(name, file);
      setFieldTouched(name, true, false);
      setFileName(file.name);

      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setPreview({
            type: "image",
            url: reader.result,
          });
        };
      } else if (fileType === "application/pdf") {
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

  // Reset when form resets (optional)
  useEffect(() => {
    if (!values[name]) resetFile();
  }, [values[name]]);

  return (
    <>
      <Box display="flex" justifyContent="center" width="100%">
        {errors[name] && touched[name] && (
          <Typography color="error" fontSize="0.875rem" mt={2} mx={2}>
            {errors[name]}
          </Typography>
        )}
        <Box width="50%">
          <input
            ref={fileInputRef}
            type="file"
            id={name}
            name={name}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <Box textAlign="center" mt={2}>
            <label htmlFor={name}>
              <Button
                color="canclebtn"
                variant="outlined"
                component="span"
                fullWidth
                sx={{
                  borderColor:
                    errors[name] && touched[name]
                      ? "error.main"
                      : "grey.500",
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
    </>
  );
}
