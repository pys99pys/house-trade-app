import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST, STORAGE_KEY_SEARCH_FORM } from "@/constants/storageKeys";
import { SearchFormType } from "@/interfaces/SearchForm";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSearchParamValue, useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityNameWithCode, getFirstCityCode } from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";
import { setValue } from "@/utils/localStorage";

const defaultCityCode = getFirstCityCode();
const defaultYearMonth = getBeforeYearMonth();

interface Return {
  form: SearchFormType;
  registeredCityCode: boolean;
  onChangeCityName: (cityName: string) => void;
  onChangeCityCode: (cityCode: string) => void;
  onChangeYearMonth: (yearMonth: string) => void;
  onClickFavorite: () => void;
  onSubmit: (e?: FormEvent) => void;
}

const useSearchForm = (): Return => {
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

  return {
    form,
    registeredCityCode,
    onChangeCityName,
    onChangeCityCode,
    onChangeYearMonth,
    onClickFavorite,
    onSubmit,
  };
};

export default useSearchForm;
