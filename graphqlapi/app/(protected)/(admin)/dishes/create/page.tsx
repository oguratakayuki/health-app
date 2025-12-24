"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_DISH } from "@/infrastructure/graphql/queries/dish";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';

export default function CreateDishPage() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [createDish, { loading }] = useMutation(CREATE_DISH, {
    onCompleted: () => router.push("/dishes"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDish({ variables: { name } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Add color="primary" />
          <Typography variant="h4" component="h1">
            料理を作成
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="料理名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：カレーライス"
            margin="normal"
            required
          />
          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Add />}
            >
              {loading ? "作成中..." : "作成"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push("/dishes")}
              startIcon={<ArrowBack />}
            >
              キャンセル
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
