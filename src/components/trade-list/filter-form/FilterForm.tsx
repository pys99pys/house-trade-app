import { FC, useMemo } from "react";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import useTradeList from "@/hooks/useTradeList";
import { useFilterFormValue, useSetFilterFormState } from "@/stores/filterFormStore";
import { parseToAmountText, parseToAverageAmountText } from "@/utils/formatter";

import styles from "./FilterForm.module.css";

interface FilterFormProps {}

const FilterForm: FC<FilterFormProps> = () => {
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

  return (
    <div className={styles.filterForm}>
      <div className={styles.summary}>
        검색결과: <strong>{count}건</strong>
        {averageAmount > 0 && (
          <>
            {" "}
            / 평단가: <strong>{parseToAmountText(averageAmount)}</strong>
          </>
        )}
      </div>

      <div className={styles.buttons}>
        <Input size="small" placeholder="아파트명" value={filterForm.apartName} onChange={onChangeApartName} />
        <Button size="small" color={filterForm.onlyBaseSize ? "primary" : "default"} onClick={onToggleOnlyBaseSize}>
          국민평수
        </Button>
        <Button size="small" color={filterForm.onlySavedList ? "primary" : "default"} onClick={onToggleOnlySavedList}>
          저장 목록
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
