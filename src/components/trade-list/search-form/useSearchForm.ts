import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { FAVORITE_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { FilterType } from "@/interfaces/Filter";
import { SearchFormType } from "@/interfaces/SearchForm";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useFilterFormValue, useSetFilterFormState } from "@/stores/filterFormStore";
import { useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityNameWithCode, getFirstCityCode } from "@/utils/cityDataUtil";
import { getBeforeYearMonth } from "@/utils/dateUtil";
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
  const locationState = useLocation().state;
  const favoriteCityCodes = useFavoriteCityCodeListValue();
  const filterForm = useFilterFormValue();

  const setFavoriteCityCodes = useSetFavoriteCityCodeListState();
  const setFilterForm = useSetFilterFormState();
  const setSearchParam = useSetSearchParamState();

  const [form, setForm] = useState<SearchFormType>({
    cityName: getCityNameWithCode(defaultCityCode),
    cityCode: defaultCityCode,
    yearMonth: defaultYearMonth,
  });

  const copiedForm = useRef<SearchFormType>(form);
  const copiedFilterForm = useRef<FilterType>(filterForm);

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
    setValue(FAVORITE_LIST_STORAGE_KEY, afterFavoriteCityCodes);
  };

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setSearchParam({ cityCode: form.cityCode, yearMonth: form.yearMonth });
  };

  useEffect(() => {
    if (locationState?.cityCode) {
      const afterForm = {
        ...copiedForm.current,
        cityCode: locationState.cityCode,
        cityName: getCityNameWithCode(locationState.cityCode),
      };

      setForm(afterForm);
      setSearchParam({ cityCode: afterForm.cityCode, yearMonth: afterForm.yearMonth });
      setFilterForm({ ...copiedFilterForm.current, apartName: "" });
    }
  }, [locationState, setSearchParam, setFilterForm]);

  useEffect(() => {
    copiedForm.current = form;
  }, [form]);

  useEffect(() => {
    copiedFilterForm.current = filterForm;
  }, [filterForm]);

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
