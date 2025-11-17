"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DISH, UPDATE_DISH } from "@/src/graphql/queries/dish";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';

export default function EditDishPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id!;
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Edit color="primary" />
          <Typography variant="h4" component="h1">
            料理を編集
          </Typography>
        </Box>

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
