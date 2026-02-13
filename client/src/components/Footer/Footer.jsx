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
      <Typography variant="body2">© {new Date().getFullYear()} Ma discothèque vinyle</Typography>
    </Box>
  );
}

export default Footer;
