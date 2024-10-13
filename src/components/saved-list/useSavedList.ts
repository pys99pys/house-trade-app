import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { TRADE_LIST_PATH } from "@/constants/paths";
import { APART_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { useApartListValue, useSetApartListState } from "@/stores/apartListStore";
import { useSetToastState } from "@/stores/toastStore";
import {
  createApartItemKey,
  createApartList,
  filterApartListWithCityCode,
  parseApartItemKey,
} from "@/utils/apartListUtil";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityDataUtil";
import { setValue } from "@/utils/localStorage";

interface Item {
  address: string;
  apartName: string;
}

interface Return {
  list: {
    cityCode: string;
    label: string;
    items: Item[];
  }[];
  onClick: (cityCode: string, item: Item) => void;
  onRemove: (cityCode: string, item: Item) => void;
}

const useSavedList = (): Return => {
  const navigate = useNavigate();
  const setToast = useSetToastState();
  const setApartList = useSetApartListState();

  const apartList = useApartListValue();

  const list = useMemo(() => {
    return apartList
      .map((item) => ({
        cityCode: item.cityCode,
        label: `${getCityNameWithCode(item.cityCode)} ${getCityCodeWithCode(item.cityCode)}`,
        items: item.items.map((_item) => parseApartItemKey(_item)).sort((a, b) => (a.apartName > b.apartName ? 1 : -1)),
      }))
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }, [apartList]);

  const onClick = (cityCode: string, item: Item) => {
    navigate(TRADE_LIST_PATH, { state: { cityCode, apartName: item.apartName } });
  };

  const onRemove = (cityCode: string, item: Item) => {
    const apartItemKey = createApartItemKey({
      address: item.address,
      apartName: item.apartName,
    });
    const filteredApartList = filterApartListWithCityCode(cityCode, apartList);
    const afterApartItems = filteredApartList.filter((item) => item !== apartItemKey);
    const afterApartList = createApartList(apartList, {
      cityCode: cityCode,
      items: afterApartItems,
    });

    setApartList(afterApartList);
    setValue(APART_LIST_STORAGE_KEY, afterApartList);
  };

  return { list, onClick, onRemove };
};

export default useSavedList;
