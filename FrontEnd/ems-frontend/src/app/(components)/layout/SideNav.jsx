"use client";

import React from "react";
import { Drawer, List } from "@mui/material";
import NavItem from "./NavItem";
import { navItems } from "../../(utils)/navigation";

const SideNav = ({ isDrawerOpen }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isDrawerOpen ? 256 : 72,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isDrawerOpen ? 256 : 72,
          boxSizing: "border-box",
          top: 86,
          height: "calc(100% - 86px)",
          borderRight: "1px solid rgb(224, 230, 237)",
          transition: "width 0.2s",
        },
      }}
    >
      <List sx={{ p: 0 }}>
        {navItems.map((item, index) => (
          <NavItem 
            key={index} 
            item={item} 
            isDrawerOpen={isDrawerOpen} 
            index={index} 
          />
        ))}
      </List>
    </Drawer>
  );
};

export default SideNav;