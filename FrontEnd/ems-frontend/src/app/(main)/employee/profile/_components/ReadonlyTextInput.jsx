import { TextField } from "@mui/material";

import InputItem from "../../../../_components/inputs/InputItem";

export default function ReadonlyTextInput({ label, value }){
  return (
    <InputItem>
      <TextField
        label={label}
        value={value || ""}
        fullWidth
        variant="standard"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        
      />
    </InputItem>
  );
};