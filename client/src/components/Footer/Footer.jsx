import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 'auto', // pousse le footer en bas
        textAlign: 'center',
        borderTop: '1px solid #ccc',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="body2" sx={{ fontFamily: 'var(--font-01)' }}>
        © {new Date().getFullYear()} | Julius Vinyl Manager
      </Typography>
    </Box>
  );
}

export default Footer;
