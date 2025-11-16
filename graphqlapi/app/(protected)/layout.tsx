"use client";

import { Box } from '@mui/material';
import Sidebar from './_components/Sidebar';

export default function DashboardLayout({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* サイドバー */}
      <Sidebar />
      {/* メインコンテンツエリア */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
