import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const InputItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: "center",
  width:'100%',
}));

export default InputItem;