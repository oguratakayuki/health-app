"use client";

import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { Restaurant, Scale } from "@mui/icons-material";

import { INGREDIENT_NUTRIENTS_QUERY } from "@/frontend/graphql/queries/ingredient_nutrients";

export default function IngredientNutrientTable() {
  const { data, loading, error } = useQuery(INGREDIENT_NUTRIENTS_QUERY, {
    variables: { limit: 30 },
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          読み込み中...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        エラー: {error.message}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ヘッダーカード */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Restaurant color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              栄養成分一覧
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            食材別の栄養成分データベース（
            {data?.ingredientNutrients?.length || 0}件表示）
          </Typography>
        </CardContent>
      </Card>

      {/* データテーブル */}
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="栄養成分テーブル">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                食材名
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                栄養素名
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                含有量
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                単位基準
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.ingredientNutrients?.map((item: any) => {
              const amountText = `${item.contentUnitPer || ""}${item.contentUnitPerUnit || ""}あたり ${item.contentQuantity || ""}${item.contentUnit || ""}`;
              return (
                <TableRow
                  key={item.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  {/* 食材名 */}
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Restaurant fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight="medium">
                        {item.ingredient?.name || "データなし"}
                      </Typography>
                    </Box>
                  </TableCell>
                  {/* 栄養素名 */}
                  <TableCell>
                    <Chip
                      label={item.nutrient?.name || "データなし"}
                      variant="outlined"
                      color="secondary"
                      size="medium"
                    />
                  </TableCell>
                  {/* 含有量 */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Scale fontSize="small" color="action" />
                      <Typography variant="body1">
                        {item.contentQuantity || "0"} {item.contentUnit || ""}
                      </Typography>
                    </Box>
                  </TableCell>
                  {/* 単位基準 */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {amountText}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* フッター情報 */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          ※表示件数: {data?.ingredientNutrients?.length || 0}件（最大30件）
        </Typography>
      </Box>
    </Container>
  );
}
