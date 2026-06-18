"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DISH, UPDATE_DISH } from "@/frontend/graphql/queries/dish";
import {
  GetDishQuery,
  GetDishQueryVariables,
  UpdateDishMutation,
  UpdateDishMutationVariables,
} from "@/frontend/generated/graphql";

import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";

export default function EditDishPage() {
  const router = useRouter();
  const params = useParams();
  // 💡 IDは一貫して文字列型（String）として扱います
  const id = String(params.id);

  /** ───────────────────────────────
   * Dish 基本データの取得
   * ─────────────────────────────── */
  const { data, loading } = useQuery<GetDishQuery, GetDishQueryVariables>(GET_DISH, { 
    variables: { id } 
  });
  const [name, setName] = useState("");

  /** ───────────────────────────────
   * Dish 基本データの更新
   * ─────────────────────────────── */
  const [updateDish, { loading: updating }] = useMutation<
    UpdateDishMutation,
    UpdateDishMutationVariables
  >(UPDATE_DISH, {
    onCompleted: () => router.push("/dishes"),
  });

  // データを取得できたらフォームの初期値にセット
  useEffect(() => {
    if (data?.dish) {
      setName(data.dish.name);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // 💡 根本解決パターンに基づき、input オブジェクトに包んで name を送信
    await updateDish({ 
      variables: { 
        id, 
        input: { name } 
      } 
    });
  };

  // 読み込み中の表示
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* タイトル */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Edit color="primary" />
          <Typography variant="h4">料理を編集</Typography>
        </Box>

        {/* 料理名編集フォーム */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="料理名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={20} /> : <Edit />}
            >
              {updating ? "更新中..." : "更新"}
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
