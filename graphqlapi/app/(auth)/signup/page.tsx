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
  Person,
  Email,
  HowToReg,
} from '@mui/icons-material';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "サインアップに失敗しました");
      }

      setMessage("サインアップに成功しました。確認コード入力ページへ移動します…");

      setTimeout(() => {
        router.push(`/confirm?email=${encodeURIComponent(email)}`);
      }, 700);
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
        width: '100vw',
        maxWidth: '100% !important',
        backgroundColor: 'background.default',
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
          width: '95%',
          maxWidth: '500px',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
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
          <HowToReg color="primary" sx={{ fontSize: 32 }} />
          <Typography component="h1" variant="h4" fontWeight="bold">
            サインアップ
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mb: 1.5 }}
        >
          栄養管理アプリのアカウントを作成してください
        </Typography>

        {/* サインアップフォーム */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          {/* 名前フィールド */}
          <TextField
            margin="dense"
            required
            fullWidth
            id="name"
            label="名前"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
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

          {/* メールアドレスフィールド */}
          <TextField
            margin="dense"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 1.5,
            }}
          />
          {/* パスワードフィールド */}
          <TextField
            margin="dense"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="new-password"
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
              'サインアップ'
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
            既にアカウントをお持ちの方は{' '}
            <Link 
              href="/login" 
              underline="hover" 
              fontWeight="bold"
            >
              ログイン
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
