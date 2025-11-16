"use client";

import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

interface AppBarProps {
  onMenuClick?: () => void;
}

export default function AppBar({ onMenuClick }: AppBarProps) {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircle color="action" />
          <Typography variant="body2" color="text.secondary">
            管理者
          </Typography>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}
