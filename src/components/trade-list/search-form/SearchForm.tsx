import { FC } from "react";

import Button from "@/components/common/button/Button";
import MonthPicker from "@/components/common/month-picker/MonthPicker";
import Select from "@/components/common/select/Select";
import { getCityCodeItems, getCityNameItems } from "@/utils/cityDataUtil";

import styles from "./SearchForm.module.css";
import useSearchForm from "./useSearchForm";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = () => {
  const { form, registeredCityCode, onChangeCityName, onChangeCityCode, onChangeYearMonth, onClickFavorite, onSubmit } =
    useSearchForm();

  return (
    <>
      <form className={styles.searchForm} onSubmit={onSubmit}>
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
        <MonthPicker value={form.yearMonth} onChange={onChangeYearMonth} />
        <Button type="submit" color="primary">
          검색
        </Button>
        {!registeredCityCode && (
          <Button color="yellow" onClick={onClickFavorite}>
            즐겨찾기
          </Button>
        )}
      </form>
    </>
  );
};

export default SearchForm;
