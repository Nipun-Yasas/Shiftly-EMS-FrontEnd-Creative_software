import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

export default function OrgChart() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 4,
        padding: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 2,
        }}
      >
        <Avatar
          src="/organization/shushena.jpg"
          sx={{
            width: 90,
            height: 90,
            marginBottom: 1,
            border: `3px solid ${theme.palette.primary.main}`,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Sushena Ranatunga
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          CEO
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {[
          { name: "Channa De Silva", role: "Software Engineering Director", image: "/organization/channa.jpg" },
          { name: "Damitha Liyanage", role: "Software Engineering Director", image: "/organization/dmaitha.jpg" },
          { name: "Asma Cader", role: "Director Marketing", image: "/organization/asma.jpg" },
          { name: "Dinithi Abeygunawardena", role: "Head of Human Resources", image: "/organization/dinithi.jpg" },
        ].map((member, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: 1,
            }}
          >
            <Avatar
              src={member.image}
              sx={{
                width: 70,
                height: 70,
                marginBottom: 1,
                border: `2px solid ${theme.palette.divider}`,
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              {member.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                fontSize: "0.8rem",
              }}
            >
              {member.role}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}