"use client";  // クライアントコンポーネントとして明示

import DashboardLayout from './DashboardLayout';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';

export default function HomePage() {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          栄養管理アプリへようこそ
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Link href="/ingredient-nutrients" style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <RestaurantIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    栄養成分管理
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    食材別の栄養成分を管理
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Link href="/protected" style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: 'secondary.main', mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    ユーザー情報
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    アカウント情報の確認
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: 'success.main', mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  統計情報
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  栄養データの分析
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
