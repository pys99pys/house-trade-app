import { FC, FormEvent, useState } from "react";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Select from "@/components/common/select/Select";
import { ELEMENT_ID_YEAR_MONTH_INPUT } from "@/constants/elementId";
import { STORAGE_KEY_SEARCH_FORM } from "@/constants/storageKeys";
import { SearchFormType } from "@/interfaces/SearchForm";
import { useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityCodeItems, getCityNameItems, getCityNameWithCode, getFirstCityCode } from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";
import { setValue } from "@/utils/localStorage";

import styles from "./SearchForm.module.css";

interface SearchFormProps {}

const defaultCityCode = getFirstCityCode();
const defaultYearMonth = getBeforeYearMonth();

const SearchForm: FC<SearchFormProps> = () => {
  const setSearchParam = useSetSearchParamState();

  const [form, setForm] = useState<SearchFormType>({
    cityName: getCityNameWithCode(defaultCityCode),
    cityCode: defaultCityCode,
    yearMonth: defaultYearMonth,
  });

  const onChangeCityName = (cityName: string) => setForm({ ...form, cityName });

  const onChangeCityCode = (cityCode: string) => setForm({ ...form, cityCode });

  const onChangeYearMonth = (yearMonth: string) =>
    setForm({
      ...form,
      yearMonth: yearMonth.slice(0, 6).replace(/[^0-9]/g, ""),
    });

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    const afterForm = { cityCode: form.cityCode, yearMonth: form.yearMonth };

    setValue(STORAGE_KEY_SEARCH_FORM, afterForm);
    setSearchParam(afterForm);
  };

  return (
    <>
      <form className={styles.form} onSubmit={onSubmit}>
        <Select value={form.cityName} onChange={onChangeCityName}>
          {getCityNameItems().map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </Select>
        <Select value={form.cityCode} onChange={onChangeCityCode}>
          {getCityCodeItems(form.cityName).map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </Select>
        <Input id={ELEMENT_ID_YEAR_MONTH_INPUT} value={form.yearMonth} onChange={onChangeYearMonth} />
        <Button type="submit" color="primary">
          검색
        </Button>
        {
          <Button color="yellow" onClick={() => alert("구현중")}>
            즐겨찾기
          </Button>
        }
      </form>
    </>
  );
};

export default SearchForm;
