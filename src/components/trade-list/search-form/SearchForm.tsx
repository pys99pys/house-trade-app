import { FC, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Select from "@/components/common/select/Select";
import { ELEMENT_ID_YEAR_MONTH_INPUT } from "@/constants/elementId";
import { SearchFormType } from "@/interfaces/SearchForm";
import { getCityCodeItems, getCityNameItems, getCityNameWithCode, getFirstCityCode } from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";

import styles from "./SearchForm.module.css";
import useSearchForm from "./useSearchForm";

interface SearchFormProps {}

const defaultCityCode = getFirstCityCode();
const defaultYearMonth = getBeforeYearMonth();

const SearchForm: FC<SearchFormProps> = () => {
  const { onChangeCityName, onChangeCityCode, onChangeYearMonth, onRegistFavorite, onClickSearch } = useSearchForm();

  const [form, setForm] = useState<SearchFormType>({
    cityName: getCityNameWithCode(defaultCityCode),
    cityCode: defaultCityCode,
    yearMonth: defaultYearMonth,
  });

  return (
    <>
      <form className={styles.form} onSubmit={onClickSearch}>
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
          <Button color="yellow" onClick={onRegistFavorite}>
            즐겨찾기
          </Button>
        }
      </form>
    </>
  );
};

export default SearchForm;
