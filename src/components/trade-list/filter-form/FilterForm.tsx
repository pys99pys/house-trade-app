import { FC } from "react";
import { FaCheck } from "react-icons/fa";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import { parseToAmountText } from "@/utils/formatter";

import styles from "./FilterForm.module.css";
import useFilterForm from "./useFilterForm";

interface FilterFormProps {}

const FilterForm: FC<FilterFormProps> = () => {
  const { filterForm, count, averageAmount, onChangeApartName, onToggleOnlyBaseSize, onToggleOnlySavedList } =
    useFilterForm();

  return (
    <div className={styles.filterForm}>
      <div className={styles.summaryWrap}>
        <span>
          검색결과: <strong>{count}건</strong>
        </span>
        {averageAmount > 0 && (
          <>
            <span>/</span>
            <span>
              평단가: <strong>{parseToAmountText(averageAmount)}</strong>
            </span>
          </>
        )}
      </div>
      <div className={styles.buttonWrap}>
        <Input size="small" placeholder="아파트명" value={filterForm.apartName} onChange={onChangeApartName} />
        <Button size="small" color={filterForm.onlyBaseSize ? "primary" : "default"} onClick={onToggleOnlyBaseSize}>
          <FaCheck />
          국민 평수
        </Button>
        <Button size="small" color={filterForm.onlySavedList ? "primary" : "default"} onClick={onToggleOnlySavedList}>
          <FaCheck />
          저장 목록
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
