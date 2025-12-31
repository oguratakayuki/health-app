"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DISH, UPDATE_DISH } from "@/frontend/graphql/queries/dish";
import {
  GET_DISH_INGREDIENTS,
  CREATE_DISH_INGREDIENT,
  UPDATE_DISH_INGREDIENT,
  DELETE_DISH_INGREDIENT,
  GET_INGREDIENTS,
} from "@/frontend/graphql/queries/dishIngredients";

import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Edit, ArrowBack, Delete } from "@mui/icons-material";

export default function EditDishPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  /** ───────────────────────────────
   * Dish 基本データ
   * ─────────────────────────────── */
  const { data, loading } = useQuery(GET_DISH, { variables: { id } });
  const [name, setName] = useState("");

  const [updateDish, { loading: updating }] = useMutation(UPDATE_DISH, {
    onCompleted: () => router.push("/dishes"),
  });

  useEffect(() => {
    if (data?.dish) setName(data.dish.name);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDish({ variables: { id, name } });
  };

  /** ───────────────────────────────
   * dish_ingredients
   * ─────────────────────────────── */
  const { data: diData, refetch: refetchDI } = useQuery(GET_DISH_INGREDIENTS, {
    variables: { dishId: id },
  });

  /** ingredients（セレクト用） */
  const { data: ingredientsData } = useQuery(GET_INGREDIENTS);

  const [createDishIngredient] = useMutation(CREATE_DISH_INGREDIENT, {
    onCompleted: () => refetchDI(),
  });
  const [updateDishIngredient] = useMutation(UPDATE_DISH_INGREDIENT, {
    onCompleted: () => refetchDI(),
  });
  const [deleteDishIngredient] = useMutation(DELETE_DISH_INGREDIENT, {
    onCompleted: () => refetchDI(),
  });

  /** 新規追加フォーム */
  const [newIngredientId, setNewIngredientId] = useState<number | "">("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnit, setNewUnit] = useState("");

  /** 追加処理 */
  const handleAdd = async () => {
    if (!newIngredientId || !newQuantity || !newUnit) return;

    await createDishIngredient({
      variables: {
        dishId: id,
        ingredientId: Number(newIngredientId),
        contentQuantity: Number(newQuantity),
        contentUnit: newUnit,
      },
    });

    setNewIngredientId("");
    setNewQuantity("");
    setNewUnit("");
  };

  /** 更新処理 */
  const handleUpdate = async (item: any) => {
    await updateDishIngredient({
      variables: {
        id: item.id,
        contentQuantity: Number(item.contentQuantity),
        contentUnit: item.contentUnit,
      },
    });
  };

  /** 削除処理 */
  const handleDelete = async (itemId: number) => {
    await deleteDishIngredient({ variables: { id: itemId } });
  };

  if (loading || !ingredientsData) {
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

  const dishIngredients = diData?.dishIngredients || [];
  const ingredientList = ingredientsData.ingredients || [];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* タイトル */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Edit color="primary" />
          <Typography variant="h4">料理を編集</Typography>
        </Box>

        {/* 料理名フォーム */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="料理名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <Box display="flex" gap={2} mt={3} mb={5}>
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

        {/* ──────────────────────── */}
        {/* dish_ingredients 一覧    */}
        {/* ──────────────────────── */}
        <Typography variant="h5" gutterBottom>
          食材一覧
        </Typography>

        {dishIngredients.map((item: any) => (
          <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" gap={2} alignItems="center">
              {/* ingredient 名 */}
              <Typography sx={{ width: 150 }}>
                {item.ingredient?.name}
              </Typography>

              {/* quantity */}
              <TextField
                label="量"
                value={item.contentQuantity}
                onChange={(e) => {
                  item.contentQuantity = e.target.value;
                  // 強制再描画
                  setNewQuantity((v) => v);
                }}
                sx={{ width: 120 }}
              />

              {/* unit */}
              <TextField
                label="単位"
                value={item.contentUnit}
                onChange={(e) => {
                  item.contentUnit = e.target.value;
                  setNewUnit((v) => v);
                }}
                sx={{ width: 120 }}
              />

              {/* 更新ボタン */}
              <Button variant="contained" onClick={() => handleUpdate(item)}>
                更新
              </Button>

              {/* 削除ボタン */}
              <IconButton color="error" onClick={() => handleDelete(item.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Paper>
        ))}

        {/* ──────────────────────── */}
        {/* 追加フォーム             */}
        {/* ──────────────────────── */}
        <Typography variant="h5" mt={4} mb={2}>
          食材を追加
        </Typography>

        <Paper sx={{ p: 2 }}>
          <Box display="flex" gap={2} alignItems="center">
            {/* ingredient select */}
            <Select
              value={newIngredientId}
              onChange={(e) => setNewIngredientId(e.target.value as number)}
              displayEmpty
              sx={{ width: 180 }}
            >
              <MenuItem value="">食材を選択</MenuItem>
              {ingredientList.map((ing: any) => (
                <MenuItem key={ing.id} value={ing.id}>
                  {ing.name}
                </MenuItem>
              ))}
            </Select>

            {/* quantity */}
            <TextField
              label="量"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              sx={{ width: 120 }}
            />

            {/* unit */}
            <TextField
              label="単位"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              sx={{ width: 120 }}
            />

            <Button variant="contained" onClick={handleAdd}>
              追加
            </Button>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
}
