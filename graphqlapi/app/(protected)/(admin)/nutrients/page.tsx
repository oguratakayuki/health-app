"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_NUTRIENTS, CREATE_NUTRIENT, UPDATE_NUTRIENT, DELETE_NUTRIENT } from "@/infrastructure/graphql/queries/nutrient";
import {
  Container, Box, TextField, Button, List, ListItem, ListItemText, IconButton
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function NutrientAdminPage() {
  const { data, loading, refetch } = useQuery(GET_NUTRIENTS);
  const [createNutrient] = useMutation(CREATE_NUTRIENT, { onCompleted: () => refetch() });
  const [updateNutrient] = useMutation(UPDATE_NUTRIENT, { onCompleted: () => refetch() });
  const [deleteNutrient] = useMutation(DELETE_NUTRIENT, { onCompleted: () => refetch() });

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  if (loading) return <div>Loading...</div>;
  const list = data?.prismaNutrients || [];

  const handleCreate = async () => {
    if (!name) return;
    await createNutrient({ variables: { name } });
    setName("");
  };

  const startEdit = (item: any) => {
    setEditingId(Number(item.id));
    setEditingName(item.name || "");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await updateNutrient({ variables: { id: editingId, name: editingName } });
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("削除していいですか？")) return;
    await deleteNutrient({ variables: { id } });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={3}>
        <TextField label="栄養素名" value={name} onChange={(e) => setName(e.target.value)} />
        <Button variant="contained" onClick={handleCreate} sx={{ ml: 2 }}>追加</Button>
      </Box>

      <List>
        {list.map((item: any) => (
          <ListItem key={item.id} secondaryAction={
            <>
              <IconButton edge="end" onClick={() => startEdit(item)}><Edit /></IconButton>
              <IconButton edge="end" onClick={() => handleDelete(Number(item.id))}><Delete /></IconButton>
            </>
          }>
            <ListItemText primary={item.name} secondary={`id: ${item.id}`} />
          </ListItem>
        ))}
      </List>

      {editingId && (
        <Box mt={3}>
          <TextField label="編集" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
          <Button variant="contained" onClick={handleUpdate} sx={{ ml: 2 }}>更新</Button>
        </Box>
      )}
    </Container>
  );
}

