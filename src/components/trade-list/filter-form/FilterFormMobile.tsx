import { FC } from "react";

import Button from "@/components/common/button/Button";
import Checkbox from "@/components/common/checkbox/Checkbox";
import Input from "@/components/common/input/Input";
import { parseToAmountText } from "@/utils/formatter";

import styles from "./FilterFormMobile.module.css";
import useFilterForm from "./useFilterForm";

interface FilterFormProps {}

const FilterForm: FC<FilterFormProps> = () => {
  const { filterForm, count, averageAmount, onChangeApartName, onToggleOnlyBaseSize, onToggleOnlySavedList } =
    useFilterForm();

  return (
    <div className={styles.filterFormMobile}>
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
        <Checkbox size="small" checked={filterForm.onlyBaseSize} onClick={onToggleOnlyBaseSize}>
          국민 평수
        </Checkbox>
        <Checkbox size="small" checked={filterForm.onlySavedList} onClick={onToggleOnlySavedList}>
          저장 목록
        </Checkbox>
      </div>
      <div className={styles.inputWrap}>
        <Input size="small" placeholder="아파트명" value={filterForm.apartName} onChange={onChangeApartName} />
      </div>
    </div>
  );
};

export default FilterForm;
