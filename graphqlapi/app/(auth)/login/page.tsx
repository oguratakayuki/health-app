"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Link,
} from '@mui/material';
import {
  Lock,
  Login,
  Person,
} from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "ログインに失敗しました");
      }

      setMessage("ログイン成功！Dashboardへ移動します…");

      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        width: '100vw', // ビューポート幅いっぱいに
        maxWidth: '100% !important', // 最大幅制限を強制解除
        backgroundColor: 'background.default',
        // Containerのスタイルを完全に上書き
        '&.MuiContainer-root': {
          maxWidth: '100% !important',
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          marginLeft: '0 !important',
          marginRight: '0 !important',
        }
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: {
            xs: 3,
            md: 4,
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '95%', // 画面幅の95%を使用
          maxWidth: '500px',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          // モバイルで少しマージンを追加
          margin: {
            xs: 1,
            sm: 2,
          }
        }}
      >
        {/* ヘッダー */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
          }}
        >
          <Login color="primary" sx={{ fontSize: 32 }} />
          <Typography component="h1" variant="h4" fontWeight="bold">
            ログイン
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mb: 1.5 }}
        >
          栄養管理アプリにアクセスするにはログインしてください
        </Typography>

        {/* ログインフォーム */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="dense"
            required
            fullWidth
            id="username"
            label="ユーザー名"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 1.5,
            }}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              mt: 1,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'ログイン'
            )}
          </Button>
        </Box>

        {/* メッセージ表示 */}
        <Box sx={{ width: '100%', mt: 1.5 }}>
          {message && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* フッターリンク */}
        <Box sx={{ mt: 1.5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            アカウントをお持ちでない方は{' '}
            <Link 
              href="/signup" 
              underline="hover" 
              fontWeight="bold"
            >
              新規登録
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
