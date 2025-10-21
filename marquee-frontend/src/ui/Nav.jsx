import React from "react";
import {
  AppBar, Toolbar, Box, Stack, Button, IconButton, Link as MuiLink
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const GUTTER = "clamp(16px, 4vw, 40px)";

function MarqueeLogo(props) {
  return (
    <svg width={220} height={50} viewBox="0 0 280 56" fill="none" {...props}>
      <g fill="#F3F4F6">
        <text x="0" y="22" fontFamily="Inter, Arial, sans-serif" fontWeight="500" fontSize="32" letterSpacing="4">MARQUEE</text>
        <rect x="0" y="28" width="185" height="2" />
        <text x="0" y="52" fontFamily="Inter, Arial, sans-serif" fontWeight="500" fontSize="24" letterSpacing="6">NEW YORK</text>
      </g>
    </svg>
  );
}

export default function Nav() {
  const links = [
    { label: "Event Calendar", to: "/" },
    { label: "VIP Reservations", to: "#" },
    { label: "Special Events", to: "#" },
    { label: "Marquee Skydeck at Edge", to: "#" },
  ];

  return (
    <AppBar
      elevation={0}
      color="transparent"
      position="sticky"
      sx={{ top: 0, backdropFilter: "blur(6px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <Box sx={{ width: "100%", px: GUTTER }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 84, md: 84 }, gap: 3 }}>
          <IconButton edge="start" disableRipple sx={{ p: 0 }} component={RouterLink} to="/" aria-label="home">
            <MarqueeLogo />
          </IconButton>

          <Stack direction="row" spacing={3} alignItems="center" sx={{ ml: "auto" }}>
            {links.map((l) => (
              <MuiLink
                key={l.label}
                component={l.to.startsWith("/") ? RouterLink : "a"}
                to={l.to.startsWith("/") ? l.to : undefined}
                href={!l.to.startsWith("/") ? l.to : undefined}
                underline="none"
                color="text.primary"
                sx={{ fontSize: 16, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer",
                  "&:hover": { color: "text.secondary" } }}
              >
                {l.label}
              </MuiLink>
            ))}
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: "text.primary",
                borderColor: "rgba(255,255,255,0.9)",
                borderWidth: 2,
                borderRadius: "6px",
                backgroundColor: "transparent",
                textTransform: "none",
                fontWeight: 500,
                fontSize: 16,
                letterSpacing: 0.2,
                px: 2.25, py: 0.25, minHeight: 32,
                "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.10)" },
                "&:focus-visible": { outline: "2px solid rgba(255,255,255,0.6)", outlineOffset: 2 },
              }}
            >
              Buy Tickets
            </Button>
          </Stack>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
