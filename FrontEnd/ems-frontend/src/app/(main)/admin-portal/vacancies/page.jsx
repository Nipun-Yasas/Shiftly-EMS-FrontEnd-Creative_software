'use client';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { Formik, Form } from "formik";
import InputItem from "@/app/_components/inputs/InputItem";
import TextInput from "@/app/_components/inputs/TextInput";

export default function page() {
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
        </Box>
      
    </Paper>
  )
}
