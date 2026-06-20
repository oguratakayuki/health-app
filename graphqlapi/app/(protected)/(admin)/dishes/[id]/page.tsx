"use client";

import { useQuery } from "@apollo/client";
import { GET_DISH } from "@/frontend/graphql/queries/dish";
import {
  GetDishQuery,
  GetDishQueryVariables,
} from "@/frontend/generated/graphql";

import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack, Edit, Restaurant } from "@mui/icons-material";

export default function DishDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  /** ───────────────────────────────
   * Dish データの取得
   * ─────────────────────────────── */
  const { data, loading, error } = useQuery<
    GetDishQuery,
    GetDishQueryVariables
  >(GET_DISH, {
    variables: { id },
  });

  // 日付フォーマット用のヘルパー
  const formatDate = (dateString: any) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 読み込み中
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

  // エラー、またはデータが存在しない場合
  if (error || !data?.dish) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error" variant="h6">
            料理データが見つかりませんでした。
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/dishes")}
            sx={{ mt: 2 }}
          >
            一覧に戻る
          </Button>
        </Paper>
      </Container>
    );
  }

  const { dish } = data;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* ヘッダーエリア */}
        <Box
          display="flex"
          justifyContent="between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={4}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Restaurant color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4">料理の詳細</Typography>
          </Box>
          {/* アクションボタン */}
          <Box display="flex" gap={2} ml="auto">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => router.push(`/dishes/${id}/edit`)}
            >
              編集する
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push("/dishes")}
            >
              一覧に戻る
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* データ表示エリア */}
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              システムID
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "monospace",
                bgcolor: "grey.100",
                p: 1,
                borderRadius: 1,
                display: "inline-block",
              }}
            >
              {dish.id}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              料理名
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {dish.name}
            </Typography>
          </Box>

          <Box display="flex" gap={4} flexWrap="wrap">
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                登録日時
              </Typography>
              <Typography variant="body2">
                {formatDate(dish.createdAt)}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                最終更新日時
              </Typography>
              <Typography variant="body2">
                {formatDate(dish.updatedAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
