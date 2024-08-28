import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { TRADE_LIST_PATH } from "@/constants/paths";
import { STORAGE_KEY_SEARCH_FORM } from "@/constants/storageKeys";
import useSavedApartList from "@/hooks/useSavedList";
import { SavedApartItem } from "@/interfaces/TradeItem";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";
import { getValue } from "@/utils/storage";

interface Return {
  list: {
    cityCode: string;
    cityName: string;
    apartList: SavedApartItem[];
  }[];
  onClick: (cityCode: string, savedItem: SavedApartItem) => void;
  removeItem: (cityCode: string, savedItem: SavedApartItem) => void;
}

const useSavedList = (): Return => {
  const { push } = useRouter();
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

  const onClick = (cityCode: string, savedItem: SavedApartItem) => {
    const savedSearchForm = getValue<{ yearMonth: string }>(STORAGE_KEY_SEARCH_FORM);

    push(
      `${TRADE_LIST_PATH}?cityCode=${cityCode}&yearMonth=${savedSearchForm?.yearMonth ?? getBeforeYearMonth()}&apartName=${encodeURIComponent(savedItem.apartName)}`
    );
  };

  return { list, onClick, removeItem };
};

export default useSavedList;
