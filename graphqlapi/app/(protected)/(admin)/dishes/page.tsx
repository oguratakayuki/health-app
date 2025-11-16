"use client";

import { useQuery } from "@apollo/client";
import { GET_DISHES } from "@/src/graphql/queries/dish";
import Link from "next/link";

export default function DishListPage() {
  const { data, loading, error } = useQuery(GET_DISHES);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Dishes 一覧</h1>
      <Link href="/dishes/create">新規作成</Link>
      <ul>
        {data.dishes.map((dish: any) => (
          <li key={dish.id}>
            {dish.name} - 
            <Link href={`/dishes/${dish.id}`}>詳細</Link>
            {" | "}
            <Link href={`/dishes/${dish.id}/edit`}>編集</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

