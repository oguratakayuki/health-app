"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Restaurant,
  Person,
  Dashboard,
  AdminPanelSettings,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMe } from '@/hooks/useMe'; // ← 追加

const menuItems = [
  {
    text: 'ダッシュボード',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    text: '栄養成分管理',
    icon: <Restaurant />,
    path: '/ingredient-nutrients',
  },
  {
    text: 'ユーザー情報',
    icon: <Person />,
    path: '/user',
  },
];

// 管理者のみ表示するメニュー
const adminMenuItems = [
  {
    text: '献立情報',
    icon: <AdminPanelSettings />,
    path: '/dishes',
  },
  {
    text: '栄養素情報',
    icon: <AdminPanelSettings />,
    path: '/nutrients',
  },
  {
    text: '食材情報',
    icon: <AdminPanelSettings />,
    path: '/ingredients',
  },
];

const drawerWidth = 240;

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin, loading } = useMe();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* アプリタイトル */}
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            textAlign: 'center'
          }}
        >
          栄養管理アプリ
        </Typography>
      </Box>
      <Divider />

      {/* メニューリスト */}
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
              <ListItemButton
                selected={pathname === item.path}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: pathname === item.path ? 'bold' : 'normal',
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}

        {/* --- 管理者メニュー --- */}
        {!loading && isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }}>
                  <ListItemButton
                    selected={pathname === item.path}
                    sx={{
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: pathname === item.path ? 'white' : 'text.secondary',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: pathname === item.path ? 'bold' : 'normal',
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Drawer>
  );
}
