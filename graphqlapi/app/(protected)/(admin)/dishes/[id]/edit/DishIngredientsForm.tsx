"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_DISH_INGREDIENTS } from "@/infrastructure/graphql/queries/dishIngredients";

export default function DishIngredientsForm({
  dishId,
  initialItems,
  ingredients,
}: {
  dishId: number;
  initialItems: any[];
  ingredients: any[];
}) {
  const [items, setItems] = useState(initialItems);

  const [updateIngredients, { loading }] = useMutation(UPDATE_DISH_INGREDIENTS);

  const addRow = () => {
    setItems([
      ...items,
      {
        id: undefined,
        ingredient_id: ingredients[0]?.id ?? 1,
        content_quantity: 0,
        content_unit: "g",
      },
    ]);
  };

  const updateRow = (index: number, key: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    setItems(updated);
  };

  const deleteRow = (index: number) => {
    const updated = [...items];
    if (updated[index].id) {
      updated[index]._destroy = true;
    } else {
      updated.splice(index, 1);
    }
    setItems(updated);
  };

  const handleSave = async () => {
    await updateIngredients({
      variables: {
        dishId,
        items: items.map((i) => ({
          id: i.id,
          ingredient_id: Number(i.ingredient_id),
          content_quantity: Number(i.content_quantity),
          content_unit: i.content_unit,
          _destroy: i._destroy ?? false,
        })),
      },
    });

    alert("保存しました！");
  };

  return (
    <div>
      <table className="table-auto w-full border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">食材</th>
            <th className="p-2 border">量</th>
            <th className="p-2 border">単位</th>
            <th className="p-2 border">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr key={idx} className={row._destroy ? "opacity-40" : ""}>
              <td className="p-2 border">
                <select
                  value={row.ingredient_id}
                  onChange={(e) => updateRow(idx, "ingredient_id", e.target.value)}
                  className="border p-1"
                >
                  {ingredients.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-2 border">
                <input
                  type="number"
                  value={row.content_quantity}
                  onChange={(e) =>
                    updateRow(idx, "content_quantity", e.target.value)
                  }
                  className="w-24 border p-1"
                />
              </td>

              <td className="p-2 border">
                <input
                  type="text"
                  value={row.content_unit}
                  onChange={(e) =>
                    updateRow(idx, "content_unit", e.target.value)
                  }
                  className="w-20 border p-1"
                />
              </td>

              <td className="p-2 border">
                {!row._destroy ? (
                  <button
                    onClick={() => deleteRow(idx)}
                    className="text-red-600"
                  >
                    削除
                  </button>
                ) : (
                  <span className="text-gray-500">削除予定</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        行を追加
      </button>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        保存する
      </button>
    </div>
  );
}

