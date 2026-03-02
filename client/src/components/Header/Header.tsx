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
import { useFormat } from '../../context/FormatContext.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import type { UserFormat } from '../../context/FormatContext.js';

function Header() {
  const { selectedFormat, setSelectedFormat } = useFormat();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleClose = () => setOpen(false);

  const handleFormatChange = (value: UserFormat): void => {
    setSelectedFormat(value);
    setOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'var(--color-01)',
      }}
    >
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
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            height: 'auto', // prend seulement la hauteur du contenu
            minHeight: 100, // optionnel : un minimum
            mt: 8, // optionnel : décale depuis le top si tu veux
          },
        }}
      >
        <Box sx={{ width: 260 }} role="presentation">
          <List>
            {isMobile ? (
              /* 📱 MOBILE → FORMAT */
              <>
                <ListItemButton
                  onClick={() => handleFormatChange('LP')}
                  sx={{
                    backgroundColor: selectedFormat === 'LP' ? 'primary.main' : 'transparent',
                    color: selectedFormat === 'LP' ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor: selectedFormat === 'LP' ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary="33 Tours"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => handleFormatChange('SINGLE')}
                  sx={{
                    backgroundColor: selectedFormat === 'SINGLE' ? 'primary.main' : 'transparent',
                    color: selectedFormat === 'SINGLE' ? 'white' : 'inherit',
                    '&:hover': {
                      backgroundColor:
                        selectedFormat === 'SINGLE' ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary="45 Tours"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
              </>
            ) : (
              /* 💻 DESKTOP → NAVIGATION */
              <>
                <ListItemButton
                  component={NavLink}
                  to="/"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Releases"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  component={NavLink}
                  to="/artists"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Artists"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  component={NavLink}
                  to="/labels"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Labels"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin/artists"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Admin_artists"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin/labels"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Admin_labels"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin/genres"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Admin_genres"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/admin/styles"
                  onClick={handleClose}
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary="Admin_styles"
                    primaryTypographyProps={{
                      sx: { fontFamily: 'var(--font-01)', fontSize: '1.1rem', fontWeight: 500 },
                    }}
                  />
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
