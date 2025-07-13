"use client";

import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import OrgChart from "./_components/OrgChart";
import TeamCard from "./_components/TeamCard";

const teamData = [
  {
    name: "DIPS",
    members: 20,
    team: [
      { name: "Dianne Russell", role: "Lead UI/UX Designer" },
      { name: "Arlene McCoy", role: "Sr. UI/UX Designer" },
      { name: "Cody Fisher", role: "Sr. UI/UX Designer" },
      { name: "Theresa Webb", role: "UI/UX Designer" },
      { name: "Ronald Richards", role: "UI/UX Designer" },
    ],
  },
  {
    name: "WINT",
    members: 14,
    team: [
      { name: "Darrell Steward", role: "Sr. Sales Manager" },
      { name: "Kristin Watson", role: "Sr. Sales Manager" },
      { name: "Courtney Henry", role: "BDM" },
      { name: "Kathryn Murphy", role: "BDM" },
      { name: "Albert Flores", role: "Sales" },
    ],
  },
  {
    name: "ONEFLOW",
    members: 18,
    team: [
      { name: "Leslie Alexander", role: "Sr. Project Manager" },
      { name: "Ronald Richards", role: "Sr. Project Manager" },
      { name: "Savannah Nguyen", role: "Project Manager" },
      { name: "Eleanor Pena", role: "Project Manager" },
      { name: "Esther Howard", role: "Project Manager" },
    ],
  },
  {
    name: "BOOKNORDICS.COM",
    members: 10,
    team: [
      { name: "Wade Warren", role: "Sr. Marketing Manager" },
      { name: "Brooklyn Simmons", role: "Sr. Marketing Manager" },
      { name: "Kristin Watson", role: "Marketing Coordinator" },
      { name: "Jacob Jones", role: "Marketing Coordinator" },
      { name: "Cody Fisher", role: "Marketing" },
    ],
  },
  {
    name: "LOVOLD SOLUTION",
    members: 20,
    team: [
      { name: "Dianne Russell", role: "Lead UI/UX Designer" },
      { name: "Arlene McCoy", role: "Sr. UI/UX Designer" },
      { name: "Cody Fisher", role: "Sr. UI/UX Designer" },
      { name: "Theresa Webb", role: "UI/UX Designer" },
      { name: "Ronald Richards", role: "UI/UX Designer" },
    ],
  },
  {
    name: "MEDIQ",
    members: 10,
    team: [
      { name: "Wade Warren", role: "Sr. Marketing Manager" },
      { name: "Brooklyn Simmons", role: "Sr. Marketing Manager" },
      { name: "Kristin Watson", role: "Marketing Coordinator" },
      { name: "Jacob Jones", role: "Marketing Coordinator" },
      { name: "Cody Fisher", role: "Marketing" },
    ],
  },
];

export default function Organization() {
  return (
    <Paper
      elevation={2}
      square={false}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ minHeight: "100vh" }}>
        <OrgChart />

        <Grid
          container
          spacing={6}
          sx={{ display: "flex", justifyContent: "center", mb: 3 }}
        >
          {teamData.map((team, index) => (
            <Grid item key={index}>
              <TeamCard team={team} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
