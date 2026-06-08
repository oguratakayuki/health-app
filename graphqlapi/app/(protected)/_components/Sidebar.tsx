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
  Button,
} from "@mui/material";
import {
  Restaurant,
  Person,
  Dashboard,
  AdminPanelSettings,
  Logout,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/frontend/auth/hooks/useAuth";

const menuItems = [
  { text: "ダッシュボード", icon: <Dashboard />, path: "/dashboard" },
  { text: "献立", icon: <Restaurant />, path: "/meals" },
  { text: "ユーザー情報", icon: <Person />, path: "/user" },
  { text: "統計情報", icon: <Restaurant />, path: "/daily-nutrition" },
];

const adminMenuItems = [
  { text: "料理", icon: <AdminPanelSettings />, path: "/dishes" },
  { text: "食材", icon: <AdminPanelSettings />, path: "/ingredients" },
  { text: "栄養素", icon: <AdminPanelSettings />, path: "/nutrients" },
  {
    text: "食材栄養成分",
    icon: <Restaurant />,
    path: "/ingredient-nutrients",
  },
  {
    text: "栄養素摂取基準値",
    icon: <Restaurant />,
    path: "/nutrients-intake-standards",
  },
];

const drawerWidth = 240;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAuth(); // useAuth に変更

  const handleLogout = async () => {
    try {
      await logout(); // AuthProvider の logout メソッドを使用
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
          display: "flex",
          flexDirection: "column",
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

      <List sx={{ p: 1, flexGrow: 1 }}>
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

      {/* ログアウトボタン */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            py: 1,
          }}
        >
          ログアウト
        </Button>
      </Box>
    </Drawer>
  );
}
