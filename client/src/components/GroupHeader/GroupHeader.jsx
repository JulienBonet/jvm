/* eslint-disable react/prop-types */
import { Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function GroupHeader({ letter, isOpen, onToggle }) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Typography fontSize={20}>{letter}</Typography>

      <Box
        sx={{
          display: 'inline-flex',
          transition: 'transform 0.25s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <KeyboardArrowDownIcon />
      </Box>
    </Box>
  );
}

export default GroupHeader;
