import { useMemo } from "react";

import { TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useApartListValue } from "@/stores/apartListStore";
import { useFilterFormValue } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { filterApartListWithCityCode } from "@/utils/apartListUtil";
import { filterItems } from "@/utils/tradeItemUtil";

interface Return {
  tradeList: TradeItem[];
}

const useTradeList = (): Return => {
  const searchParam = useSearchParamValue();
  const filterForm = useFilterFormValue();
  const apartList = useApartListValue();

  const { data } = useFetchTradeListQuery();

  const tradeList = useMemo(
    () =>
      filterItems(data?.list ?? [], {
        apartList: filterApartListWithCityCode(searchParam.cityCode, apartList),
        filterForm,
      }),
    [data, searchParam, filterForm, apartList]
  );

  return { tradeList };
};

export default useTradeList;
