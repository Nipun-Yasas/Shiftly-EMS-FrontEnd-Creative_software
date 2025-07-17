import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

export default function TeamCard({ team }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        boxShadow: theme.shadows[1],
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          {team.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: 2,
            fontWeight: 500,
          }}
        >
          {team.members} MEMBERS
        </Typography>

        {team.team.slice(0, 5).map((member, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", marginTop: 2 }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                marginRight: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
              >
                {member.name}
              </Typography>
              <Typography variant="body2">{member.role}</Typography>
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <Link
            href={`/organization/${team.name.toLowerCase().replace(/\./g, "")}`}
            passHref
          >
            <Button
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              View More
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
