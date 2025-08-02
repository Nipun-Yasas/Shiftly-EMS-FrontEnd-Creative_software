"use client";

import {useEffect,useState} from 'react'

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { Formik, Form } from "formik";
import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";
import CustomDataGrid from "../../_components/CustomDataGrid";
import axiosInstance from "@/app/_utils/axiosInstance";
import { API_PATHS } from "@/app/_utils/apiPaths";

const columns = [
    {field:'departmentname',headerName:"Department Name",width:'150'},
    {field:'adminname',headerName:'Admin Name',width:'150'}
]

export default function page() {
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState([]);
    const rows = []

    const fetchDepartments = async () => {
        setLoading(true);
        try{
            const response = await axiosInstance.get(API_PATHS.DEPARTMENTS.GET_ALL_DEPARTMENTS);

        }
        catch(error){
            setData([])
        }
        finally{

        }
    }

  return (
    <Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Formik>
          <Form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0, sm: 2 },
              }}
            >
                <InputItem><TextInput
                  name="departmentname"
                  label="Enter department name"
                /></InputItem>
                
                <Box>
                    
                <Button variant='contained'>Add</Button>
                </Box>
            </Box>
          </Form>
        </Formik>
        <Box sx={{p:2,mt:3}}>
            
        <CustomDataGrid rows={rows} columns={columns}/>
        </Box>
      </Box>
    </Paper>
  );
}
