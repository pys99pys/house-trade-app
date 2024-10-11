import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { FilterType } from "@/interfaces/Filter";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useApartListValue } from "@/stores/apartListStore";
import { useFilterFormValue, useSetFilterFormState } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { filterApartListWithCityCode } from "@/utils/apartListUtil";
import { parseToAverageAmountText } from "@/utils/formatter";
import { parseTradeListPageQueryParam } from "@/utils/queryParams";
import { filterItems } from "@/utils/tradeItemUtil";

interface Return {
  filterForm: FilterType;
  count: number;
  averageAmount: number;
  onChangeApartName: (apartName: string) => void;
  onToggleOnlyBaseSize: () => void;
  onToggleOnlySavedList: () => void;
}

const useFilterForm = (): Return => {
  const { data } = useFetchTradeListQuery();
  const params = useSearchParams();
  const param = params?.get("param") ?? "";

  const searchParamValue = useSearchParamValue();
  const filterFormValue = useFilterFormValue();
  const apartListValue = useApartListValue();

  const copiedFilterFormValue = useRef<FilterType>(filterFormValue);

  const setFilterForm = useSetFilterFormState();

  const filteredList = useMemo(
    () =>
      filterItems(data?.list ?? [], {
        apartList: filterApartListWithCityCode(searchParamValue.cityCode, apartListValue),
        filterForm: filterFormValue,
      }),
    [data, searchParamValue, filterFormValue, apartListValue]
  );

  const count = useMemo(() => filteredList.length, [filteredList]);
  const averageAmount = useMemo(() => parseToAverageAmountText(filteredList), [filteredList]);

  const onChangeApartName = (apartName: string) => {
    setFilterForm({ ...filterFormValue, apartName });
  };

  const onToggleOnlyBaseSize = () => {
    setFilterForm({ ...filterFormValue, onlyBaseSize: !filterFormValue.onlyBaseSize });
  };

  const onToggleOnlySavedList = () => {
    setFilterForm({ ...filterFormValue, onlySavedList: !filterFormValue.onlySavedList });
  };

  useEffect(() => {
    const parsedParam = parseTradeListPageQueryParam(param);

    if (parsedParam.apartName) {
      setFilterForm({ ...copiedFilterFormValue.current, apartName: parsedParam.apartName });
    }
  }, [param, setFilterForm]);

  useEffect(() => {
    copiedFilterFormValue.current = filterFormValue;
  }, [filterFormValue]);

  return {
    filterForm: filterFormValue,
    count,
    averageAmount,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useFilterForm;
