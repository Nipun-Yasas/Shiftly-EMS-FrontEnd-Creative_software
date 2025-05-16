import { Box, useTheme } from "@mui/material";

const AvailableLeaves = ({ leaves }) => {
  const theme = useTheme();

  return (
    <Box
      className="shadow-lg rounded-xl p-6 w-full"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <h3 className="!text-lg !font-bold !mb-4 px-5">Available Leaves</h3>
      <Box className="flex flex-wrap gap-4 px-5">
        {leaves.map((leave, i) => {
          const bgColor = leave.hexColor;
          const textColor = theme.palette.getContrastText(bgColor);

          return (
            <Box
              key={i}
              className="flex items-center text-sm rounded-xl"
              sx={{
                backgroundColor: bgColor,
                color: textColor,
                px: 2,
                py: 1,
              }}
            >
              <div className="bg-white text-black rounded-xl w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">
                {leave.count}
              </div>
              {leave.type}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AvailableLeaves;
