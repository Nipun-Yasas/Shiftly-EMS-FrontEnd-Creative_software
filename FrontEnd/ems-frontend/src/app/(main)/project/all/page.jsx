"use client";

import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Card } from "@mui/material";
import { CardMedia } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";

const demoProjects = [
  {
    id: 1,
    title: "Empowering Norway’s largest e-health solutions provider",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project1.jpg",
    logo: "/images/dips_logo.png",
  },
  {
    id: 2,
    title: "Streamlining Healthcare Operations Across Multiple Countries with IFS APP10",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project2.jpg",
    logo: "/images/mediq_logo.png",
  },
  {
    id: 3,
    title: "A seamless IFS cloud upgrade for TV Industries",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project3.jpg",
    logo: "/images/m_logo.png",
  },
  {
    id: 4,
    title: "Building a Scalable Multi-System Travel Booking Platform for the Nordics",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project4.jpg",
    logo: "/images/booknordics_logo.png",
  },
  {
    id: 5,
    title: "Empowering Norway’s largest e-health solutions provider",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project1.jpg",
    logo: "/images/dips_logo.png",
  },
  {
    id: 6,
    title: "Streamlining Healthcare Operations Across Multiple Countries with IFS APP10",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project2.jpg",
    logo: "/images/mediq_logo.png",
  },
];

export default function AllProjects() {
  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        height: '100%',
        width: '100%',
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 3,
        }}
      >
        {demoProjects.map((project) => (
          <Card
            key={project.id}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6,
              },
              overflow: 'hidden',
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={project.imageUrl}
              alt="Project"
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={project.logo} alt="Logo" style={{ height: 20 }} />
              </Box>
              <Typography variant="body1" fontWeight="medium">
                {project.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <strong>Created:</strong> {project.createdDate}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <strong>Project Status:</strong>{" "}
                <Typography component="span" color="success.main" fontWeight="medium">
                  {project.status}
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                <strong>Software Engineering Director:</strong> {project.director}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Paper>
  );
}