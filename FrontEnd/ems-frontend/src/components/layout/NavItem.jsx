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

  // Check if current path matches exactly
  const isExactActive = (link) => pathname === link;
  
  // Check if current path is within this section (for parent highlighting)
  const isSectionActive = () => {
    if (item.hasDropdown && item.dropdownItems) {
      return item.dropdownItems.some(child => pathname.startsWith(child.link));
    }
    return isExactActive(item.link);
  };

  // Auto-expand dropdown when a child is active
  useEffect(() => {
    if (isSectionActive() && item.hasDropdown) {
      setIsOpen(true);
    }
  }, [pathname]);

  const toggleDropdown = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setIsOpen(!isOpen);
  };

  // Get active states
  const isItemActive = item.hasDropdown ? isSectionActive() : isExactActive(item.link);

  return (
    <React.Fragment>
      <ListItem disablePadding sx={{ mb: 1 }}>
        {item.hasDropdown ? (
          <ListItemButton
            sx={{
              borderRadius: 1,
              px: 2,
              py: 1.5,
              bgcolor: isItemActive ? "#e80a4d1a" : "transparent",
              "&:hover": { bgcolor: isItemActive ? "#e80a4d26" : "rgba(0, 0, 0, 0.04)" },
              display: "flex",
              alignItems: "center",
              justifyContent: isDrawerOpen ? "flex-start" : "center",
              gap: isDrawerOpen ? 2 : 0,
            }}
            onClick={toggleDropdown}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0, 
                mr: isDrawerOpen ? 2 : 0,
                color: isItemActive ? "#e80a4d" : "inherit"
              }}
            >
              {item.icon}
            </ListItemIcon>
            {isDrawerOpen && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  color: isItemActive ? "#e80a4d" : "text.primary",
                  variant: "body1",
                  fontWeight: isItemActive ? 600 : 400,
                }}
              />
            )}
            {item.hasDropdown && isDrawerOpen && (
              <IconButton
                edge="end"
                size="small"
                onClick={(event) => toggleDropdown(event)}
                sx={{
                  color: isItemActive ? "#e80a4d" : "inherit"
                }}
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
                bgcolor: isExactActive(item.link) ? "#e80a4d1a" : "transparent",
                "&:hover": { bgcolor: isExactActive(item.link) ? "#e80a4d26" : "rgba(0, 0, 0, 0.04)" },
                display: "flex",
                alignItems: "center",
                justifyContent: isDrawerOpen ? "flex-start" : "center",
                gap: isDrawerOpen ? 2 : 0,
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 0, 
                  mr: isDrawerOpen ? 2 : 0,
                  color: isExactActive(item.link) ? "#e80a4d" : "inherit"
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isDrawerOpen && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color: isExactActive(item.link) ? "#e80a4d" : "text.primary",
                    variant: "body1",
                    fontWeight: isExactActive(item.link) ? 600 : 400,
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
                      py: 1.25,
                      borderRadius: 1,
                      bgcolor: isExactActive(dropdownItem.link) ? " #e80a4d1a" : "transparent",
                      "&:hover": { bgcolor: isExactActive(dropdownItem.link) ? "#e80a4d26" : "rgba(0, 0, 0, 0.04)" },
                      mr: 1,
                    }}
                  >
                    <ListItemText
                      primary={dropdownItem.text}
                      primaryTypographyProps={{
                        color: isExactActive(dropdownItem.link) ? "#e80a4d" : "text.primary",
                        variant: "body2",
                        fontWeight: isExactActive(dropdownItem.link) ? 600 : 400,
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