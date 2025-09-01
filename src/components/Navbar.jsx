import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Typography,
  Button,
  Box,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Divider,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CivicPulse Animated Navbar (No Auth yet)
 * - Modern look with MUI AppBar
 * - Animated active-underline using Framer Motion
 * - Sticky, elevates on scroll
 * - Responsive Drawer on mobile
 * - Route-aware highlighting via useLocation
 */

const links = [
  { label: "Home", to: "/issues", icon: <HomeRoundedIcon fontSize="small" /> },
  // { label: "Report", to: "/report", icon: <ReportProblemRoundedIcon fontSize="small" /> },
  { label: "Dashboard", to: "/dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
];

const authLinks = [
  { label: "Login", to: "/login", icon: <LoginRoundedIcon fontSize="small" /> },
  { label: "Register", to: "/register", icon: <PersonAddAltRoundedIcon fontSize="small" /> },
];

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return (
    <Box component={motion.div} animate={{ y: 0 }} initial={{ y: -24 }}>
      {children({ elevation: trigger ? 6 : 0 })}
    </Box>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const ActiveUnderline = () => (
    <motion.div
      layoutId="nav-underline"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -6,
        height: 3,
        borderRadius: 999,
        background: "currentColor",
        opacity: 0.85,
      }}
    />
  );

  const Brand = () => (
    <Stack direction="row" spacing={1} alignItems="center" component={RouterLink} to="/" style={{ textDecoration: "none" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 6px)", gap: "4px" }}>
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{ width: 6, height: 16 + i * 4, bgcolor: "primary.main", borderRadius: 1 }} />
        ))}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: "text.primary" }}>
        CIVIC-PULSE
      </Typography>
    </Stack>
  );

  const NavButton = ({ to, label, icon }) => {
    const active = pathname === to || (to !== "/" && pathname.startsWith(to));
    return (
      <Box sx={{ position: "relative" }}>
        <Button
          component={RouterLink}
          to={to}
          size="medium"
          startIcon={icon}
          sx={{
            color: active ? "primary.main" : "text.secondary",
            fontWeight: active ? 700 : 500,
            textTransform: "none",
          }}
        >
          {label}
        </Button>
        {active && <ActiveUnderline />}
      </Box>
    );
  };

  return (
    <ElevationScroll>
      {({ elevation }) => (
        <AppBar position="sticky" color="inherit" elevation={elevation} sx={{ backdropFilter: "saturate(180%) blur(8px)", bgcolor: "rgba(255,255,255,0.9)" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ py: 0.5 }}>
              {/* Left: Brand */}
              <Brand />

              {/* Desktop Links */}
              <Stack direction="row" spacing={1.5} sx={{ ml: 4, display: { xs: "none", md: "flex" } }}>
                {links.map((l) => (
                  <NavButton key={l.to} {...l} />
                ))}
              </Stack>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Right: Auth */}
              <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
                {authLinks.map((l) => (
                  <Button key={l.label} component={RouterLink} to={l.to} startIcon={l.icon} variant={l.label === "Register" ? "contained" : "text"} sx={{ textTransform: "none" }}>
                    {l.label}
                  </Button>
                ))}
              </Stack>

              {/* Mobile: Menu Button */}
              <IconButton edge="end" sx={{ ml: 1, display: { xs: "inline-flex", md: "none" } }} onClick={() => setOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            </Toolbar>
          </Container>

          {/* Mobile Drawer */}
          <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 300, p: 2 }} role="presentation">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Menu</Typography>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>
              <Divider sx={{ my: 1 }} />

              <List>
                <AnimatePresence initial={false}>
                  {links.map((l, idx) => (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ListItemButton component={RouterLink} to={l.to} onClick={() => setOpen(false)} selected={pathname === l.to}>
                        {l.icon}
                        <ListItemText primary={l.label} sx={{ ml: 1 }} />
                      </ListItemButton>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>

              <Divider sx={{ my: 1 }} />
              <List>
                {authLinks.map((l) => (
                  <ListItemButton key={l.label} component={RouterLink} to={l.to} onClick={() => setOpen(false)}>
                    {l.icon}
                    <ListItemText primary={l.label} sx={{ ml: 1 }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>
        </AppBar>
      )}
    </ElevationScroll>
  );
}
