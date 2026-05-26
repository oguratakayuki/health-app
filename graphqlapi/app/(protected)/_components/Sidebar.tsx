// app/(protected)/_components/Sidebar.tsx
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
  Skeleton,
} from "@mui/material";
import {
  Restaurant,
  Person,
  Dashboard,
  AdminPanelSettings,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMe } from "@/frontend/hooks/useMe";

const menuItems = [
  { text: "ダッシュボード", icon: <Dashboard />, path: "/dashboard" },
  { text: "献立管理", icon: <Restaurant />, path: "/meals" },
  { text: "栄養成分管理", icon: <Restaurant />, path: "/ingredient-nutrients" },
  {
    text: "年齢別基準値",
    icon: <Restaurant />,
    path: "/nutrients-intake-standards",
  },
  { text: "ユーザー情報", icon: <Person />, path: "/user" },
  { text: "radar chart", icon: <Restaurant />, path: "/daily-nutrition" },
];

const adminMenuItems = [
  { text: "献立情報", icon: <AdminPanelSettings />, path: "/dishes" },
  { text: "栄養素情報", icon: <AdminPanelSettings />, path: "/nutrients" },
  { text: "食材情報", icon: <AdminPanelSettings />, path: "/ingredients" },
];

const drawerWidth = 240;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, isAdmin } = useMe();

  // ローディング中のスケルトン表示
  if (loading) {
    return (
      <Drawer variant="permanent" anchor="left" sx={{ width: drawerWidth }}>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="100%" height={40} />
        </Box>
        <Divider />
        <List>
          {[1, 2, 3, 4, 5].map((i) => (
            <ListItem key={i}>
              <Skeleton variant="rectangular" width="100%" height={40} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          栄養管理アプリ
        </Typography>
      </Box>
      <Divider />

      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <Link
              href={item.path}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <ListItemButton selected={pathname === item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}

        {/* 管理者メニュー - isAdminで制御 */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Link
                  href={item.path}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <ListItemButton selected={pathname === item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
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
