"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_INGREDIENTS,
  CREATE_INGREDIENT,
  UPDATE_INGREDIENT,
  DELETE_INGREDIENT,
} from "@/src/graphql/queries/ingredient";
import {
  Container,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function IngredientAdminPage() {
  const { data, loading, refetch } = useQuery(GET_INGREDIENTS);
  const [createIngredient] = useMutation(CREATE_INGREDIENT, {
    onCompleted: () => refetch(),
  });
  const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
    onCompleted: () => refetch(),
  });
  const [deleteIngredient] = useMutation(DELETE_INGREDIENT, {
    onCompleted: () => refetch(),
  });

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  if (loading) return <div>Loading...</div>;
  const list = data?.ingredients || [];

  // 作成
  const handleCreate = async () => {
    if (!name) return;
    await createIngredient({ variables: { name } });
    setName("");
  };

  // 編集開始
  const startEdit = (item: any) => {
    setEditingId(Number(item.id));
    setEditingName(item.name || "");
  };

  // 更新
  const handleUpdate = async () => {
    if (!editingId) return;
    await updateIngredient({
      variables: { id: editingId, name: editingName },
    });
    setEditingId(null);
    setEditingName("");
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm("削除していいですか？")) return;
    await deleteIngredient({ variables: { id } });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 追加フォーム */}
      <Box mb={3}>
        <TextField
          label="材料名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreate} sx={{ ml: 2 }}>
          追加
        </Button>
      </Box>

      {/* 一覧 */}
      <List>
        {list.map((item: any) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => startEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(Number(item.id))}
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={item.name}
              secondary={`id: ${item.id}`}
            />
          </ListItem>
        ))}
      </List>

      {/* 編集フォーム */}
      {editingId && (
        <Box mt={3}>
          <TextField
            label="編集"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdate} sx={{ ml: 2 }}>
            更新
          </Button>
        </Box>
      )}
    </Container>
  );
}

