import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST } from "@/constants/storageKeys";
import { SearchFormType } from "@/interfaces/SearchForm";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSearchParamSessionValue } from "@/stores/searchParamSessionStore";
import { useSetSearchParamState } from "@/stores/searchParamStore";
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
  const searchParamSession = useSearchParamSessionValue();

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

    setSearchParam({ cityCode: form.cityCode, yearMonth: form.yearMonth });
  };

  useEffect(() => {
    if (searchParamSession) {
      const afterForm = {
        ...copiedForm.current,
        ...(searchParamSession.cityCode && {
          cityCode: searchParamSession.cityCode,
          cityName: getCityNameWithCode(searchParamSession.cityCode),
        }),
      };

      setForm(afterForm);
      setSearchParam({ cityCode: afterForm.cityCode, yearMonth: afterForm.yearMonth });
    }
  }, [searchParamSession, setSearchParam]);

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
