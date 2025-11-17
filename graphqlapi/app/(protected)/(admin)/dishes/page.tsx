"use client";

import { useQuery } from "@apollo/client";
import { GET_DISHES } from "@/src/graphql/queries/dish";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Restaurant } from '@mui/icons-material';

export default function DishListPage() {
  const { data, loading, error } = useQuery(GET_DISHES);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error: {error.message}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Restaurant color="primary" />
        <Typography variant="h4" component="h1">
          料理 一覧
        </Typography>
      </Box>

      <Box mb={3}>
        <Link href="/dishes/create" style={{ textDecoration: 'none' }}>
          <Button variant="contained" startIcon={<Add />}>
            新規作成
          </Button>
        </Link>
      </Box>

      <List>
        {data.dishes.map((dish: any) => (
          <ListItem key={dish.id} divider>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="body1">{dish.name}</Typography>
              <Box display="flex" gap={1}>
                <Link href={`/dishes/${dish.id}`}>
                  <Button variant="outlined" size="small">
                    詳細
                  </Button>
                </Link>
                <Link href={`/dishes/${dish.id}/edit`}>
                  <Button variant="outlined" size="small">
                    編集
                  </Button>
                </Link>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
