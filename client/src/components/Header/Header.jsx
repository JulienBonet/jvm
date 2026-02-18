import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useFormat } from '../../context/FormatContext';
import useIsMobile from '../../hooks/useIsMobile';

function Header() {
  const { format, setFormat } = useFormat();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleClose = () => setOpen(false);

  const handleFormatChange = (value) => {
    setFormat(value);
    setOpen(false);
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* LOGO */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <img src="/images/logo.png" alt="Logo" style={{ height: 40 }} />
        </Box>

        {/* BURGER */}
        <IconButton edge="end" color="inherit" onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* DRAWER */}
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box sx={{ width: 260 }} role="presentation">
          <List>
            {isMobile ? (
              /* 📱 MOBILE → FORMAT */
              <>
                <ListItemButton
                  onClick={() => handleFormatChange(12)}
                  sx={{
                    backgroundColor: format === 12 ? 'primary.main' : 'transparent',
                    color: format === 12 ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: format === 12 ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemText primary="33 Tours" />
                </ListItemButton>

                <ListItemButton
                  onClick={() => handleFormatChange(7)}
                  sx={{
                    backgroundColor: format === 7 ? 'primary.main' : 'transparent',
                    color: format === 7 ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: format === 7 ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemText primary="45 Tours" />
                </ListItemButton>
              </>
            ) : (
              /* 💻 DESKTOP → NAVIGATION */
              <>
                <ListItemButton component={NavLink} to="/" onClick={handleClose}>
                  <ListItemText primary="Accueil" />
                </ListItemButton>

                <ListItemButton component={NavLink} to="/artists" onClick={handleClose}>
                  <ListItemText primary="Artists" />
                </ListItemButton>

                <ListItemButton component={NavLink} to="/labels" onClick={handleClose}>
                  <ListItemText primary="Labels" />
                </ListItemButton>
              </>
            )}
          </List>

          <Divider />
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Header;
