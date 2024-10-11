import { useMemo } from "react";

import { TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useApartListValue } from "@/stores/apartListStore";
import { useFilterFormValue } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { filterItems } from "@/utils/tradeItemUtil";

interface Return {
  tradeList: TradeItem[];
}

const useTradeList = (): Return => {
  const searchParam = useSearchParamValue();
  const filterForm = useFilterFormValue();
  const apartList = useApartListValue();

  const { data } = useFetchTradeListQuery();

  const filteredApartList = useMemo(
    () => apartList.find((item) => item.cityCode === searchParam.cityCode)?.items ?? [],
    [searchParam.cityCode, apartList]
  );

  const tradeList = useMemo(
    () => filterItems(data?.list ?? [], { apartList: filteredApartList, filterForm }),
    [data, filterForm]
  );

  return { tradeList };
};

export default useTradeList;
