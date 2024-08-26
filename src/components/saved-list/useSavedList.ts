import { useEffect, useMemo, useState } from "react";

import useSavedApartList from "@/hooks/useSavedList";
import { SavedApartItem } from "@/interfaces/TradeItem";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityData";

interface Return {
  list: {
    cityCode: string;
    cityName: string;
    apartList: SavedApartItem[];
  }[];
  removeItem: (cityCode: string, savedItem: SavedApartItem) => void;
}

const useSavedList = (): Return => {
  const { savedList, removeItem } = useSavedApartList();

  const list = useMemo(
    () =>
      savedList
        .map((item) => ({
          cityCode: item.cityCode,
          cityName: `${getCityNameWithCode(item.cityCode)} ${getCityCodeWithCode(item.cityCode)}`,
          apartList: item.apartList.sort((a, b) => (a.apartName > b.apartName ? 1 : -1)),
        }))
        .sort((a, b) => (a.cityName > b.cityName ? 1 : -1)),
    [savedList]
  );

  return { list, removeItem };
};

export default useSavedList;
