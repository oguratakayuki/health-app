"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_DISH } from "@/src/graphql/queries/dish";
import { useRouter } from "next/navigation";

export default function CreateDishPage() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [createDish] = useMutation(CREATE_DISH, {
    onCompleted: () => router.push("/dishes"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDish({ variables: { name } });
  };

  return (
    <div>
      <h1>Dish 作成</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" />
        <button type="submit">作成</button>
      </form>
    </div>
  );
}

