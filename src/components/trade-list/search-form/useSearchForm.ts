import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { FAVORITE_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { SearchFormType } from "@/interfaces/SearchForm";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityNameWithCode, getFirstCityCode } from "@/utils/cityDataUtil";
import { getBeforeYearMonth } from "@/utils/dateUtil";
import { setValue } from "@/utils/localStorage";
import { parseTradeListPageQueryParam } from "@/utils/queryParams";

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
  const params = useSearchParams();
  const param = params?.get("param") ?? "";
  const favoriteCityCodes = useFavoriteCityCodeListValue();

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
    setValue(FAVORITE_LIST_STORAGE_KEY, afterFavoriteCityCodes);
  };

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    setSearchParam({ cityCode: form.cityCode, yearMonth: form.yearMonth });
  };

  useEffect(() => {
    const parsedParam = parseTradeListPageQueryParam(param);

    if (parsedParam.cityCode) {
      const afterForm = {
        ...copiedForm.current,
        cityCode: parsedParam.cityCode,
        cityName: getCityNameWithCode(parsedParam.cityCode),
      };

      setForm(afterForm);
      setSearchParam({ cityCode: afterForm.cityCode, yearMonth: afterForm.yearMonth });
    }
  }, [param, setSearchParam]);

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
