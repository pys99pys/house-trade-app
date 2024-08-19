import { useEffect, useState } from "react";

import { STORAGE_KEY_SAVED_APART_LIST } from "@/constants/storageKeys";
import { getValue } from "@/utils/storage";

const useSavedList = () => {
  const [savedList, setSavedList] = useState<string[]>([]);

  const setData = () => {
    const storageData = getValue<string[]>(STORAGE_KEY_SAVED_APART_LIST) ?? [];
    const calculatedData = storageData.reduce(
      (acc, item) => {
        const [cityCode, apartName] = item.split("_");
        const index = acc.findIndex((_item) => _item.cityCode === cityCode);

        console.log("i:", index);

        if (index === -1) {
          acc.push({ cityCode, aparts: [apartName] });
        } else {
          console.log(11, acc[index]);
          // acc[index].aparts = [];
        }

        return acc;
      },
      [] as { cityCode: string; aparts: string[] }[]
    );

    console.log(calculatedData);
  };

  useEffect(() => {
    setData();
  }, []);
};

export default useSavedList;
