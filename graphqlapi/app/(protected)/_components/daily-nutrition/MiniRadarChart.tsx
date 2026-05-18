"use client";

import { useMemo } from "react";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

type Props = {
  comparisons: any[];
};

export default function MiniRadarChart({ comparisons }: Props) {
  const data = useMemo(() => {
    return comparisons
      .filter((x) => x.percentage !== null)
      .slice(0, 6)
      .map((x) => ({
        nutrient: shortLabel(x.nutrientCode),
        percentage: Math.min(Math.round(x.percentage), 150),
      }));
  }, [comparisons]);

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />

          <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 10 }} />

          <Radar
            dataKey="percentage"
            stroke="#16a34a"
            fill="#22c55e"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function shortLabel(code: string) {
  const map: Record<string, string> = {
    protein_g: "P",
    fat_g: "F",
    carbohydrate_g: "C",
    fiber_g: "繊維",
    vitamin_a_ug: "VA",
    vitamin_c_mg: "VC",
  };

  return map[code] ?? code;
}
