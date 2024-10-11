import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { TRADE_LIST_PATH } from "@/constants/paths";
import { useApartListValue } from "@/stores/apartListStore";
import { parseApartItemKey } from "@/utils/apartListUtil";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityDataUtil";

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
}

const useSavedList = (): Return => {
  const navigate = useNavigate();

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

  return { list, onClick };
};

export default useSavedList;
