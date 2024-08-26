import { useState } from "react";

import { STORAGE_KEY_SAVED_APART_LIST } from "@/constants/storageKeys";
import { SavedApartItem, SavedItem, TradeItem } from "@/interfaces/TradeItem";
import { getValue } from "@/utils/storage";

interface Return {
  savedList: SavedItem[];
  saveItem: (cityCode: string, apartItem: SavedApartItem) => void;
  removeItem: (cityCode: string, apartItem: SavedApartItem) => void;
}

const useSavedList = (): Return => {
  const [savedList, setSavedList] = useState<SavedItem[]>(
    getValue(STORAGE_KEY_SAVED_APART_LIST) ?? []
  );

  const saveItem = (cityCode: string, apartItem: SavedApartItem) => {
    const hasSavedList = savedList.some((item) => item.cityCode === cityCode);
    const targetApartList =
      savedList.find((item) => item.cityCode === cityCode)?.apartList ?? [];
    const afterApartList = [...targetApartList, apartItem];

    setSavedList(
      hasSavedList
        ? savedList.map((item) =>
            item.cityCode === cityCode ? { cityCode, apartList: afterApartList } : item
          )
        : [...savedList, { cityCode, apartList: afterApartList }]
    );
  };

  const removeItem = (cityCode: string, apartItem: SavedApartItem) => {
    const targetApartList =
      savedList.find((item) => item.cityCode === cityCode)?.apartList ?? [];
    const afterApartList = targetApartList.filter(
      (item) => item.address === apartItem.address && item.apartname === apartItem.address
    );

    setSavedList(
      savedList
        .map((item) =>
          item.cityCode === cityCode ? { cityCode, apartList: afterApartList } : item
        )
        .filter((item) => item.apartList.length > 0)
    );
  };

  return { savedList, saveItem, removeItem };
};

export default useSavedList;
