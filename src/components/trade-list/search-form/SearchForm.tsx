import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Select from "@/components/common/select/Select";
import { ELEMENT_ID_YEAR_MONTH_INPUT } from "@/constants/elementId";
import { STORAGE_KEY_FAVORITE_LIST, STORAGE_KEY_SEARCH_FORM } from "@/constants/storageKeys";
import { SearchFormType } from "@/interfaces/SearchForm";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSearchParamValue, useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityCodeItems, getCityNameItems, getCityNameWithCode, getFirstCityCode } from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";
import { setValue } from "@/utils/localStorage";

import styles from "./SearchForm.module.css";

interface SearchFormProps {}

const defaultCityCode = getFirstCityCode();
const defaultYearMonth = getBeforeYearMonth();

const SearchForm: FC<SearchFormProps> = () => {
  const favoriteCityCodes = useFavoriteCityCodeListValue();
  const searchParam = useSearchParamValue();

  const setFavoriteCityCodes = useSetFavoriteCityCodeListState();
  const setSearchParam = useSetSearchParamState();

  const [form, setForm] = useState<SearchFormType>({
    cityName: getCityNameWithCode(defaultCityCode),
    cityCode: defaultCityCode,
    yearMonth: defaultYearMonth,
  });

  const copiedForm = useRef<SearchFormType>(form);

  const registeredCityCode = useMemo(
    () => favoriteCityCodes.some((cityCode) => cityCode === form.cityCode),
    [form.cityCode, favoriteCityCodes]
  );

  const onChangeCityName = (cityName: string) => setForm({ ...form, cityName });

  const onChangeCityCode = (cityCode: string) => setForm({ ...form, cityCode });

  const onChangeYearMonth = (yearMonth: string) =>
    setForm({
      ...form,
      yearMonth: yearMonth.slice(0, 6).replace(/[^0-9]/g, ""),
    });

  const onClickFavorite = () => {
    const afterFavoriteCityCodes = [...favoriteCityCodes, form.cityCode];

    setFavoriteCityCodes(afterFavoriteCityCodes);
    setValue(STORAGE_KEY_FAVORITE_LIST, afterFavoriteCityCodes);
  };

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    const afterForm = { cityCode: form.cityCode, yearMonth: form.yearMonth };

    setValue(STORAGE_KEY_SEARCH_FORM, afterForm);
    setSearchParam(afterForm);
  };

  useEffect(() => {
    if (searchParam.cityCode) {
      setForm({
        ...copiedForm.current,
        cityName: getCityNameWithCode(searchParam.cityCode),
        cityCode: searchParam.cityCode,
      });
    }
  }, [searchParam]);

  useEffect(() => {
    copiedForm.current = form;
  }, [form]);

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
