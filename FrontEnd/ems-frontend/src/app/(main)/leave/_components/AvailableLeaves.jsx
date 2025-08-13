import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const AvailableLeaves = ({ leaves }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2} px={1}>
        Available Leaves
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, px: 1 }}>
        {leaves.map((leave, i) => {
          const bgColor = leave.hexColor;
          const textColor = theme.palette.getContrastText(bgColor);

          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                backgroundColor: bgColor,
                color: textColor,
                px: 2,
                py: 1,
                minWidth: 120,
                fontWeight: 500,
                borderRadius: 3, // Add rounded corners
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: 2,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1.5,
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: 1,
                }}
              >
                {leave.count}
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {leave.type}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AvailableLeaves;
