import { FC } from "react";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import MonthPicker from "@/components/common/month-picker/MonthPicker";
import Select from "@/components/common/select/Select";
import { ELEMENT_ID_YEAR_MONTH_INPUT } from "@/constants/elementId";
import { getCityCodeItems, getCityNameItems } from "@/utils/cityData";

import styles from "./SearchFormMobile.module.css";
import useSearchForm from "./useSearchForm";

interface SearchFormMobileProps {}

const SearchFormMobile: FC<SearchFormMobileProps> = () => {
  const { form, registeredCityCode, onChangeCityName, onChangeCityCode, onChangeYearMonth, onClickFavorite, onSubmit } =
    useSearchForm();

  return (
    <form className={styles.searchFormMobile} onSubmit={onSubmit}>
      <div className={styles.selectWrap}>
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
      </div>
      <div className={styles.monthPickerWrap}>
        <MonthPicker value={form.yearMonth} onChange={onChangeYearMonth} />
      </div>
      <div className={styles.buttonWrap}>
        <Button type="submit" color="primary">
          검색
        </Button>
        {!registeredCityCode && (
          <Button color="yellow" onClick={onClickFavorite}>
            즐겨찾기
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchFormMobile;
