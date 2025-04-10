"use client";

import React, { useState, useEffect } from "react";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ item, isDrawerOpen, index }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Check if any dropdown item is active to auto-expand the dropdown
  const isDropdownItemActive = item.hasDropdown && 
    item.dropdownItems.some(dropdownItem => pathname === dropdownItem.link);

  // Helper function to check if an item is active
  const isActive = (link) => {
    // For initial load when pathname is "/" or empty, make dashboard active
    if (!pathname || pathname === "/" || pathname === "") {
      return link === "/dashboard";
    }
    return pathname === link;
  };

  // Auto-expand dropdown if a child item is selected
  useEffect(() => {
    if (isDropdownItemActive) {
      setIsOpen(true);
    }
  }, [isDropdownItemActive, pathname]);

  const toggleDropdown = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <ListItem disablePadding sx={{ mb: 1 }}>
        {item.hasDropdown ? (
          <ListItemButton
            sx={{
              borderRadius: 1,
              px: 2,
              py: 1.5,
              bgcolor: isActive(item.link) || isDropdownItemActive ? "#e80a4d1a" : "transparent",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
              display: "flex",
              alignItems: "center",
              justifyContent: isDrawerOpen ? "flex-start" : "center",
              gap: isDrawerOpen ? 2 : 0,
            }}
            onClick={toggleDropdown}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 2 : 0 }}>
              {item.icon}
            </ListItemIcon>
            {isDrawerOpen && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  color: isActive(item.link) || isDropdownItemActive ? "#e80a4d" : "text.primary",
                  variant: "body1",
                }}
              />
            )}
            {item.hasDropdown && isDrawerOpen && (
              <IconButton
                edge="end"
                size="small"
                onClick={(event) => toggleDropdown(event)}
              >
                <ExpandMoreIcon
                  sx={{
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </IconButton>
            )}
          </ListItemButton>
        ) : (
          <Link href={item.link} passHref style={{ width: "100%" }}>
            <ListItemButton
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1.5,
                bgcolor: isActive(item.link) ? "#e80a4d1a" : "transparent",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                display: "flex",
                alignItems: "center",
                justifyContent: isDrawerOpen ? "flex-start" : "center",
                gap: isDrawerOpen ? 2 : 0,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 2 : 0 }}>
                {item.icon}
              </ListItemIcon>
              {isDrawerOpen && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: isActive(item.link) ? "#e80a4d" : "text.primary",
                    variant: "body1",
                  }}
                />
              )}
            </ListItemButton>
          </Link>
        )}
      </ListItem>

      {/* Dropdown Items */}
      {item.hasDropdown && isDrawerOpen && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }}>
            {item.dropdownItems.map((dropdownItem, i) => (
              <ListItem key={i} disablePadding>
                <Link href={dropdownItem.link} passHref style={{ width: "100%" }}>
                  <ListItemButton
                    sx={{
                      pl: 4,
                      bgcolor: isActive(dropdownItem.link) ? "#e80a4d1a" : "transparent",
                    }}
                  >
                    <ListItemText
                      primary={dropdownItem.text}
                      primaryTypographyProps={{
                        color: isActive(dropdownItem.link) ? "#e80a4d" : "text.primary",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

export default NavItem;