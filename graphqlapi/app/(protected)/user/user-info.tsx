"use client";

import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Email,
  Person,
  Security,
  CheckCircle,
  AccountCircle,
} from '@mui/icons-material';

export default function UserInfo({ user }: { user: any }) {
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error">
              ユーザー情報を取得できませんでした
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  console.log(user);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ヘッダーカード */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3} mb={2}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
              }}
            >
              <AccountCircle fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                ユーザー情報
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle color="success" fontSize="small" />
                <Typography variant="body1" color="text.secondary">
                  認証済みアカウント
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary">
            このページはログインユーザーのみ閲覧できます。あなたのアカウント情報は安全に管理されています。
          </Typography>
        </CardContent>
      </Card>

      {/* ユーザー情報カード */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {/* セクションヘッダー */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
              アカウント詳細
            </Typography>
            <Divider />
          </Box>

          {/* ユーザー情報リスト */}
          <List sx={{ p: 0 }}>
            {/* メールアドレス */}
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" fontWeight="medium">
                      メールアドレス
                    </Typography>
                    <Chip
                      label="認証済み"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {user.email}
                  </Typography>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* ユーザーID */}
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="ユーザーID (sub)"
                secondary={
                  <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                    {user.sub}
                  </Typography>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* 発行者 */}
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="発行者 (iss)"
                secondary={
                  <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                    {user.iss}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* 追加情報カード */}
      <Paper 
        variant="outlined" 
        sx={{ 
          mt: 3, 
          p: 3, 
          backgroundColor: 'action.hover',
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          <Box component="span" fontWeight="medium">最終更新:</Box> {new Date().toLocaleDateString('ja-JP')}
        </Typography>
      </Paper>
    </Container>
  );
}
