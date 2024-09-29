import { useMemo } from "react";

import useSavedList from "@/hooks/useSavedList";
import { TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useFilterFormValue } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { filterItems } from "@/utils/tradeItem";

interface Return {
  tradeList: TradeItem[];
}

const useTradeList = (): Return => {
  const searchParam = useSearchParamValue();
  const filterForm = useFilterFormValue();

  const { data } = useFetchTradeListQuery();
  const { savedList } = useSavedList();

  const savedApartList = useMemo(
    () => savedList.find((item) => item.cityCode === searchParam.cityCode)?.apartList ?? [],
    [searchParam, savedList]
  );

  const tradeList = useMemo(
    () => filterItems(data?.list ?? [], { savedApartList, filterForm }),
    [data, savedApartList, filterForm]
  );

  return { tradeList };
};

export default useTradeList;
