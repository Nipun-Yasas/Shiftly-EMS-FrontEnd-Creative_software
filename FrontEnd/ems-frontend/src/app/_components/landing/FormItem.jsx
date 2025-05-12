import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const FormItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
  },
}));

export default FormItem;