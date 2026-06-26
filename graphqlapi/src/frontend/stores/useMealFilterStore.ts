import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";

interface MealFilterState {
  dateFromStr: string; // ISO形式 (YYYY-MM-DD)
  dateToStr: string; // ISO形式 (YYYY-MM-DD)
  setDateFrom: (dateStr: string) => void;
  setDateTo: (dateStr: string) => void;
  resetFilters: () => void;
}

export const useMealFilterStore = create<MealFilterState>()(
  persist(
    (set) => ({
      // 初期値は現在の月の開始日と終了日
      dateFromStr: dayjs().startOf("month").format("YYYY-MM-DD"),
      dateToStr: dayjs().endOf("month").format("YYYY-MM-DD"),
      setDateFrom: (dateStr) => set({ dateFromStr: dateStr }),
      setDateTo: (dateStr) => set({ dateToStr: dateStr }),
      resetFilters: () =>
        set({
          dateFromStr: dayjs().startOf("month").format("YYYY-MM-DD"),
          dateToStr: dayjs().endOf("month").format("YYYY-MM-DD"),
        }),
    }),
    {
      name: "meal-filter-storage", // LocalStorageのキー名
    },
  ),
);
