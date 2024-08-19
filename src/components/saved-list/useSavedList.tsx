import { useEffect, useState } from "react";

import { STORAGE_KEY_SAVED_APART_LIST } from "@/constants/storageKeys";
import { SavedItem } from "@/interfaces/TradeItem";
import { getValue } from "@/utils/storage";

const useSavedList = () => {
  const [savedList, setSavedList] = useState<SavedItem[]>(
    getValue(STORAGE_KEY_SAVED_APART_LIST) ?? []
  );

  console.log("savedList: ", savedList);
};

export default useSavedList;
