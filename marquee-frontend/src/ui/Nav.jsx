import React from "react";
import {
  AppBar, Toolbar, Box, Stack, Button, IconButton, Link as MuiLink
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const GUTTER = "clamp(16px, 4vw, 40px)";
const LOGO_URL =
  "https://images.squarespace-cdn.com/content/v1/66c78be8680dbf3f0637d706/a4ddbd6d-fa30-453e-97d5-9cca7fa4774b/Untitled+%28500+x+200+px%29+%281%29.png?format=1500w";

function MarqueeLogo(props) {
  return (
    <Box
      component="img"
      src={LOGO_URL}
      alt="Marquee New York"
      loading="eager"
      decoding="async"
      sx={{
        height: { xs: 40, md: 48 }, // tweak size here
        width: "auto",
        display: "block",
      }}
      {...props}
    />
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
              Become a member
            </Button>
          </Stack>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
