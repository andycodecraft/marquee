// src/pages/SignupPage.jsx
import React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Divider,
  Button,
  InputAdornment,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../api/client";
import { jwtDecode } from "jwt-decode"; // <-- named import
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useNavigate } from "react-router-dom";
import Nav, { GUTTER } from "../ui/Nav";
import { AuthContext } from "../state/AuthContext";

/* Dark theme */
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#E5E7EB" },
    background: { default: "#0f1214", paper: "rgba(21,25,28,0.76)" },
    text: { primary: "#F3F4F6", secondary: "#A1A1AA" },
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  shape: { borderRadius: 1 },
});

/* Section label with asterisk */
function FieldLabel({ children, required, sx }) {
  return (
    <Typography
      variant="subtitle2"
      sx={{ fontWeight: 700, color: "text.primary", ...sx }}
    >
      {children}{" "}
      {required ? (
        <Box component="span" sx={{ color: "#ef4444", fontWeight: 700 }}>
          *
        </Box>
      ) : null}
    </Typography>
  );
}

/* Input styling */
const pillInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.18)", borderRadius: 4 },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.42)" },
    maxHeight: 48,
    px: 1,
  },
  "& .MuiInputLabel-root": { display: "none" }, // we render labels separately
};

export default function SignupPage() {
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthday: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [googleIdToken, setGoogleIdToken] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [alreadyRegistered, setAlreadyRegistered] = React.useState(false); // <--
  const [loginStage, setLoginStage] = React.useState("start");             // start|verify
  const [code, setCode] = React.useState("");
  const { setUser } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const startEmailLogin = async () => {
    try {
      await api("/api/login/email/start", { method: "POST", body: { email: values.email } });
      setLoginStage("verify");
      setServerError("");
      alert("We emailed you a 6-digit code (check spam; in dev it’s in the server log).");
    } catch (e) {
      setServerError(e.message);
    }
  };

  const verifyEmailLogin = async () => {
    try {
      await api("/api/login/email/verify", { method: "POST", body: { email: values.email, code } });
      alert("Logged in!");
      // optionally redirect
    } catch (e) {
      setServerError(e.message);
    }
  };

  const onChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  // GOOGLE LOGIN
  const onGoogleSuccess = (cred) => {
    try {
      setGoogleIdToken(cred?.credential || null);
      const payload = jwtDecode(cred?.credential || "");
      setValues((v) => ({
        ...v,
        firstName: payload.given_name || v.firstName,
        lastName: payload.family_name || v.lastName,
        email: payload.email || v.email,
      }));
    } catch { }
  };
  const onGoogleError = () => console.warn("Google login failed");

  const validate = () => {
    const e = {};
    if (!values.firstName) e.firstName = "Required";
    if (!values.lastName) e.lastName = "Required";
    if (!values.phone) e.phone = "Required";
    if (!values.email) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Invalid email";
    if (!values.birthday) e.birthday = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    setAlreadyRegistered(false);
    if (!validate()) return;

    try {
      setSubmitting(true);
      await api("/api/signup", {
        method: "POST",
        body: { ...values, googleIdToken },
      });
      alert("Thanks! You’re on the list 🎉");
      const { user } = await api("/api/me");
      setUser(user);
      console.log(user)
      setValues({ firstName: "", lastName: "", phone: "", email: "", birthday: "" });
      setGoogleIdToken(null);
      navigate("/", { replace: true });
    } catch (e) {
      if (e.status === 409 && e?.info?.code === "USER_EXISTS") {
        setAlreadyRegistered(true);
        setServerError("");
        alert("You're already registered.");
        // Optionally kick off email-code automatically:
        // await startEmailLogin();
      } else {
        setServerError(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.50), rgba(0,0,0,.65)), url("https://images.unsplash.com/photo-1518972559570-7cc1309f3229?q=80&w=2400&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Nav />

        <Container
          maxWidth="lg"
          disableGutters
          sx={{
            px: GUTTER,
            py: { xs: 6, md: 8 },
            "@media (min-height:900px)": { py: { xs: 8, md: 12 } },
          }}
        >
          {/* Headline */}
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: 24, md: 48 }, fontWeight: 700 }}
            >
              Exclusive Early Access
            </Typography>
            <Typography sx={{ mt: 2 }} color="text.primary">
              Receive a text message when we announce events with first access
              to tickets.
            </Typography>
          </Box>

          {/* Form panel */}
          <Paper
            elevation={0}
            sx={{
              maxWidth: 600,
              mx: "auto",
              p: { xs: 2.25, md: 3.5 },
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Box component="form" onSubmit={submit} noValidate autoComplete="off">
              {/* Google button */}
              <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                <GoogleLogin
                  onSuccess={onGoogleSuccess}
                  onError={onGoogleError}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signup_with"
                />
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.20)", mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  or
                </Typography>
              </Divider>

              {/* Responsive grid */}
              <Box
                sx={{
                  display: "grid",
                  columnGap: { xs: 2, md: 3 },
                  rowGap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                    lg: "repeat(4, 1fr)",
                  },
                  alignItems: "end",
                }}
              >
                <FieldLabel
                  required
                  sx={{
                    gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "1 / span 2" },
                  }}
                >
                  Name
                </FieldLabel>

                <TextField
                  name="firstName"
                  placeholder="First Name"
                  value={values.firstName}
                  onChange={onChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "1 / 2", lg: "1 / span 2" },
                  }}
                  fullWidth
                />
                <TextField
                  name="lastName"
                  placeholder="Last Name"
                  value={values.lastName}
                  onChange={onChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "2 / 3", lg: "3 / span 2" },
                  }}
                  fullWidth
                />

                <FieldLabel
                  required
                  sx={{
                    gridColumn: { xs: "1 / -1", md: "1 / 2", lg: "1 / span 1" },
                  }}
                >
                  Phone Number
                </FieldLabel>
                <FieldLabel
                  required
                  sx={{
                    gridColumn: { xs: "1 / -1", md: "2 / 3", lg: "3 / span 2" },
                  }}
                >
                  Email
                </FieldLabel>

                <TextField
                  name="phone"
                  placeholder="(000) 000-0000"
                  value={values.phone}
                  onChange={onChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "1 / 2", lg: "1 / span 2" },
                  }}
                  fullWidth
                />
                <TextField
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={values.email}
                  onChange={onChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "2 / 3", lg: "3 / span 2" },
                  }}
                  fullWidth
                />

                <FieldLabel
                  required
                  sx={{
                    mt: { xs: 1, md: 0.5 },
                    gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "1 / span 1" },
                    minHeight: 30,
                  }}
                >
                  Birthday
                </FieldLabel>

                <TextField
                  name="birthday"
                  type="date"
                  placeholder="MM/DD/YYYY"
                  InputLabelProps={{ shrink: true }}
                  value={values.birthday}
                  onChange={onChange}
                  error={!!errors.birthday}
                  helperText={errors.birthday}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "1 / 2", lg: "3 / span 2" },
                  }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarTodayOutlinedIcon fontSize="small" sx={{ opacity: 0.9 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FieldLabel
                  sx={{
                    mt: { xs: 1, md: 0.5 },
                    gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "1 / span 1" },
                    minHeight: 30,
                  }}
                >
                  Tiktok
                </FieldLabel>
                <TextField
                  name="tiktok"
                  type="tiktok"
                  placeholder="https://tiktok.com/"
                  value={values.tiktok}
                  onChange={onChange}
                  error={!!errors.tiktok}
                  helperText={errors.tiktok}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "2 / 3", lg: "2 / span 3" },
                  }}
                  fullWidth
                />
                <FieldLabel
                  sx={{
                    mt: { xs: 1, md: 0.5 },
                    gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "1 / span 1" },
                    minHeight: 30,
                  }}
                >
                  Instagram
                </FieldLabel>
                <TextField
                  name="instagram"
                  type="instagram"
                  placeholder="https://instagram.com/"
                  value={values.instagram}
                  onChange={onChange}
                  error={!!errors.instagram}
                  helperText={errors.instagram}
                  sx={{
                    ...pillInputSx,
                    gridColumn: { xs: "1 / -1", md: "2 / 3", lg: "2 / span 3" },
                  }}
                  fullWidth
                />
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    mt: 1,
                    mb: { xs: 1, md: 1.5 },
                  }}
                >
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.20)" }} />
                </Box>
                {serverError && (
                  <Typography color="error" sx={{ mb: 1 }}>
                    {serverError}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    gridColumn: "1 / -1",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 18,
                    letterSpacing: 0.2,
                    borderRadius: 4,
                    bgcolor: "#5B21B6",
                    "&:hover": { bgcolor: "#6D28D9" },
                    py: 1.6,
                    color: "text.primary",
                    maxWidth: 540,
                    width: "100%",
                    justifySelf: "start",
                  }}
                >
                  {submitting ? "Submitting..." : "Sign Up"}
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ gridColumn: "1 / -1", lineHeight: 1.6 }}
                >
                  By clicking the sign up button below, you agree to receive emails and automated
                  marketing text messages about upcoming events from Tao Group Hospitality at the
                  email and cell number listed above. Consent is not a condition of purchase. Reply
                  HELP for help and STOP to cancel. Terms apply.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
