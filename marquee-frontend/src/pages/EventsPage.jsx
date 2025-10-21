import React from "react";
import {
  ThemeProvider, createTheme, CssBaseline, Container, Box, Grid, Typography,
  Link as MuiLink, Stack, Divider, Card, CardMedia, Button
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Nav, { GUTTER } from "../ui/Nav";

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#E5E7EB" }, secondary: { main: "#9CA3AF" },
    background: { default: "#0f1214", paper: "#15191c" }, text: { primary: "#F3F4F6", secondary: "#A1A1AA" } },
  typography: {
    fontFamily: ["Inter","system-ui","-apple-system","Segoe UI","Roboto","Helvetica","Arial","sans-serif"].join(","),
    h2: { fontSize: 48, fontWeight: 700, letterSpacing: 0.2 }, subtitle2: { letterSpacing: 2, textTransform: "uppercase" },
  },
  shape: { borderRadius: 20 },
});

const events = [
  { id: 1, title: "Tiësto", date: new Date("2025-10-16"), weekday: "Thursday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1757536832674_v1f4b95tl.jpg" },
  { id: 2, title: "Kölsch", date: new Date("2025-10-17"), weekday: "Friday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1757534106761_iogfhglrr.jpg" },
  { id: 3, title: "Chris Lorenzo", date: new Date("2025-10-18"), weekday: "Saturday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/10/251022_Marquee_Spade_1080x1350.jpg" },
  { id: 4, title: "Spade", date: new Date("2025-10-22"), weekday: "Wednesday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1758082624143_v4vmwcq27.jpg" },
  { id: 5, title: "Dimitri Vegas", date: new Date("2025-10-23"), weekday: "Thursday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1757534240664_wdj1rgf90.jpg" },
  { id: 6, title: "Francis Mercier", date: new Date("2025-10-25"), weekday: "Saturday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1758551061860_67td9w7g8.jpg" },
  { id: 7, title: "Kaskade", date: new Date("2025-10-30"), weekday: "Thursday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1758551384283_xhss0dard.jpg" },
  { id: 8, title: "Max Styler", date: new Date("2025-10-31"), weekday: "Friday", venue: "Marquee New York", image: "https://taogroup.com/wp-content/uploads/2025/09/image_1758085477434_lvqxsddwv.jpg" },
];

const monthDay = (d) => ({ month: d.toLocaleString("en-US",{month:"short"}), day: d.getDate() });

function SectionHeader() {
  return (
    <Box sx={{ mt: { xs: 4, md: 8 }, mb: 2 }}>
      <Typography variant="h2">Upcoming Events</Typography>
      <MuiLink component={RouterLink} to="/signup" underline="hover" color="primary"
        sx={{ display: "inline-block", fontSize: 18, mt: 3, fontWeight: 600 }}>
        Sign up for exclusive access to tickets.
      </MuiLink>
    </Box>
  );
}

function EventCard({ event }) {
  const { month, day } = monthDay(event.date);
  const actionButtonSx = {
    textTransform: "none", fontWeight: 800, fontSize: 16, letterSpacing: 0.2, minHeight: 44,
    borderRadius: "6px", borderWidth: 2, borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.9)", color: "text.primary", backgroundColor: "transparent",
    "&:hover": { borderColor: "#fff", backgroundColor: "#fff", color: "#111" },
  };

  return (
    <Box>
      <Card sx={{
        position: "relative", overflow: "hidden", bgcolor: "background.paper", borderRadius: 1,
        boxShadow: "0 10px 30px rgba(0,0,0,.3)",
        "& .overlay": { opacity: 0, pointerEvents: "none", transition: "opacity .28s ease" },
        "&:hover .overlay": { opacity: 1, pointerEvents: "auto" },
        "& .actions": {
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, calc(-50% + 14px))", opacity: 0,
          transition: "transform .38s cubic-bezier(.2,.8,.2,1), opacity .38s ease",
          width: "min(460px, 70%)",
        },
        "&:hover .actions": { transform: "translate(-50%, -50%)", opacity: 1 },
        "& .actions > *:nth-of-type(2)": { transitionDelay: "60ms" },
      }}>
        <CardMedia component="img" src={event.image} alt={event.title}
          sx={{ width:"100%", height:"clamp(320px, 34vw, 440px)", objectFit:"cover",
          filter:"grayscale(100%) contrast(105%)" }} />
        <Box className="overlay" sx={{ position:"absolute", inset:0, bgcolor:"rgba(0,0,0,.45)" }} />
        <Stack className="actions" spacing={2}>
          <Button fullWidth variant="outlined" sx={actionButtonSx}>Buy Tickets</Button>
          <Button fullWidth variant="outlined" sx={actionButtonSx}>VIP Reservations</Button>
        </Stack>
      </Card>

      <Grid container spacing={2} sx={{ pt: 2 }} alignItems="center">
        <Grid item>
          <Box sx={{ textAlign:"center", minWidth:56 }}>
            <Typography variant="subtitle2" color="text.secondary">{month}</Typography>
            <Typography variant="h4" sx={{ lineHeight:1, fontWeight:800 }}>{day}</Typography>
            <Typography variant="caption" color="text.secondary">{event.weekday}</Typography>
          </Box>
        </Grid>
        <Grid item xs>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight:700 }}>{event.title}</Typography>
            <Typography variant="body2" color="text.secondary">{event.venue}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function EventsPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Nav />
        <Container maxWidth="xl" disableGutters sx={{ pb: 8 }}>
          <Box sx={{ px: GUTTER }}>
            <SectionHeader />
            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 3 }} />
            <Box sx={{
              display: "grid", gap: { xs: 2, md: 4 },
              gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }
            }}>
              {events.map((ev) => (
                <Box key={ev.id}><EventCard event={ev} /></Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
