import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const DRAWER_WIDTH = 240;

function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon><ChatIcon /></ListItemIcon>
            <ListItemText primary="Chat" />
          </ListItem>
          <ListItem button component={Link} to="/usage">
            <ListItemIcon><BarChartIcon /></ListItemIcon>
            <ListItemText primary="API Usage" />
          </ListItem>
          <ListItem button component={Link} to="/settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 