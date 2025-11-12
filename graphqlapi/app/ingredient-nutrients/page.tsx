"use client";

import { useQuery, gql } from "@apollo/client";

const GET_INGREDIENT_NUTRIENTS = gql`
  query GetIngredientNutrients($limit: Int) {
    ingredientNutrients(limit: $limit) {
      id
      ingredient {
        name
      }
      nutrient {
        name
      }
      contentQuantity
      contentUnit
      contentUnitPer
      contentUnitPerUnit
    }
  }
`;

export default function IngredientNutrientTable() {
  const { data, loading, error } = useQuery(GET_INGREDIENT_NUTRIENTS, {
    variables: { limit: 30 }
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">成分一覧</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left">食材名</th>
            <th className="border px-3 py-2 text-left">栄養素名</th>
            <th className="border px-3 py-2 text-left">含有量</th>
          </tr>
        </thead>
        <tbody>
          {data.ingredientNutrients.map((item: any) => {
            const amountText = `${item.contentUnitPer}${item.contentUnitPerUnit}あたり${item.contentQuantity}${item.contentUnit}`;
            return (
              <tr key={item.id}>
                <td className="border px-3 py-2">{item.ingredient?.name}</td>
                <td className="border px-3 py-2">{item.nutrient?.name}</td>
                <td className="border px-3 py-2">{amountText}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
