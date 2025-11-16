"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DISH, UPDATE_DISH } from "@/src/graphql/queries/dish";
import { useRouter, useParams } from "next/navigation";

export default function EditDishPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id!;
  const { data, loading } = useQuery(GET_DISH, { variables: { id } });
  const [name, setName] = useState("");
  const [updateDish] = useMutation(UPDATE_DISH, {
    onCompleted: () => router.push("/dishes"),
  });

  useEffect(() => {
    if (data?.dish) setName(data.dish.name);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDish({ variables: { id, name } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Dish</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">更新</button>
      </form>
    </div>
  );
}

