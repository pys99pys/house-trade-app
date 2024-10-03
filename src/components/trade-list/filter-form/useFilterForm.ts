import { useMemo } from "react";

import useTradeList from "@/hooks/useTradeList";
import { FilterType } from "@/interfaces/Filter";
import { useFilterFormValue, useSetFilterFormState } from "@/stores/filterFormStore";
import { parseToAverageAmountText } from "@/utils/formatter";

interface Return {
  filterForm: FilterType;
  count: number;
  averageAmount: number;
  onChangeApartName: (apartName: string) => void;
  onToggleOnlyBaseSize: () => void;
  onToggleOnlySavedList: () => void;
}

const useFilterForm = (): Return => {
  const filterForm = useFilterFormValue();
  const setFilterForm = useSetFilterFormState();

  const { tradeList } = useTradeList();

  const count = useMemo(() => tradeList.length, [tradeList]);
  const averageAmount = useMemo(() => parseToAverageAmountText(tradeList), [tradeList]);

  const onChangeApartName = (apartName: string) => {
    setFilterForm({ ...filterForm, apartName });
  };

  const onToggleOnlyBaseSize = () => {
    setFilterForm({ ...filterForm, onlyBaseSize: !filterForm.onlyBaseSize });
  };

  const onToggleOnlySavedList = () => {
    setFilterForm({ ...filterForm, onlySavedList: !filterForm.onlySavedList });
  };

  return {
    filterForm,
    count,
    averageAmount,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useFilterForm;
