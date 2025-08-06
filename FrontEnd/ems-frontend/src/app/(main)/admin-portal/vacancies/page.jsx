'use client';

import { useState,useEffect } from 'react';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Formik, Form } from "formik";
import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";
import CustomDataGrid from "../../_components/CustomDataGrid";

import {API_PATHS} from "../../../_utils/apiPaths";
import axiosInstance from "../../../_utils/axiosInstance";

const columns = [
  { field: "id", headerName: "Department Name", width: "150" },
  { field: "name", headerName: "Admin user name", width: "150" },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    headerClassName: "last-column",
    renderCell: (params) => {
      return (
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{ color: "primary.main" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
];


export default function page() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
      });

    const fetchvacancies = async () => {
        setLoading(true);

        try{
            const response = await axiosInstance.get(API_PATHS.VACANCIES.GET_ALL_VACANCIES);
            if(response.data && response.data.length > 0) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Error fetching vacancies:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchvacancies();
    }, [])

  return (
    <Paper elavation={3} sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ p: 3 }}>
            <Formik>
                <Form>
                    <InputItem>
                        <TextInput name="vacancyName" label="Enter Vacancy Name" />
                    </InputItem>
                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                        Add Vacancy
                    </Button>
                </Form>
            </Formik>


        <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Box sx={{ width: { xs: "100%", md: "410px" }, mt: 3 }}>
                    <CustomDataGrid rows={data} columns={columns} />
                  </Box>
                </Box>
        
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  severity={snackbar.severity}
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Box>

    </Paper>
  )
}
