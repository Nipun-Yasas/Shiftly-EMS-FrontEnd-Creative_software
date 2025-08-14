import Box from "@mui/material/Box";
import Image from "next/image";

export default function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        px: { md: 2, xs: 0 },
        gap: { md: 2, xs: 0 },
      }}
    >
      <Image
        src="/shiftlyLogo.svg"
        alt="Company Logo"
        width={100}
        height={100}
      />
    </Box>
  );
}
