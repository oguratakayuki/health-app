"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Email,
  VpnKey,
  VerifiedUser,
  ArrowBack,
} from '@mui/icons-material';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ signup から渡された email を自動セット
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "確認に失敗しました");
      }

      setMessage("確認が完了しました。ログインページへ移動します…");
      setTimeout(() => router.push("/login"), 1500);
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
          <VerifiedUser color="primary" sx={{ fontSize: 32 }} />
          <Typography component="h1" variant="h4" fontWeight="bold">
            確認コード入力
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mb: 1.5 }}
        >
          メールアドレスに送信された確認コードを入力してください
        </Typography>

        {/* 確認コード入力フォーム */}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
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
            helperText="サインアップ時に使用したメールアドレス"
          />

          {/* 確認コードフィールド */}
          <TextField
            margin="dense"
            required
            fullWidth
            id="code"
            label="確認コード"
            name="code"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
            }}
            helperText="6桁の数字で送信された確認コードを入力"
            placeholder="123456"
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
              '確認する'
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
        <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/signup')}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
            }}
          >
            サインアップ画面に戻る
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
