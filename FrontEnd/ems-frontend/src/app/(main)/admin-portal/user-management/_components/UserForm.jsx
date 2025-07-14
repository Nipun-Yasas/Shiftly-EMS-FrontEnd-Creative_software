import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as Yup from "yup";

import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";

const roles = [
  { id: 1, name: 'Admin', label: 'Administrator' },
  { id: 2, name: 'Manager', label: 'Manager' },
  { id: 3, name: 'Employee', label: 'Employee' },
  { id: 4, name: 'HR', label: 'Human Resources' },
  { id: 5, name: 'Finance', label: 'Finance' },
  { id: 6, name: 'Supervisor', label: 'Supervisor' },
];


export const userEditValidationSchema = Yup.object({
  userId: Yup.string()
    .min(3, 'User ID must be at least 3 characters')
    .required('User ID is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .optional(),
  roleId: Yup.object().required('Role is required'),
});

export default function UserForm({ isEdit = false, children }) {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0, sm: 2 },
          m: 2,
        }}
      >
        <InputItem>
          <TextInput name="userId" label="User ID" />
        </InputItem>

        <InputItem>
          <TextInput name="username" label="Username" />
        </InputItem>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0, sm: 2 },
          m: 2,
        }}
      >
        <InputItem>
          <TextInput name="email" label="Email" type="email" />
        </InputItem>

        <InputItem>
          <TextInput
            name="password"
            label={isEdit ? "New Password (optional)" : "Password"}
            type="password"
          />
        </InputItem>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0, sm: 2 },
          m: 2,
        }}
      >
        <InputItem>
          <SelectInput
            name="roleId"
            label="User Role"
            options={roles}
            getOptionLabel={(option) => option.label}
          />
        </InputItem>
      </Box>

      {children}
    </Stack>
  );
}