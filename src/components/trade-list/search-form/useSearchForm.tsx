import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST, STORAGE_KEY_SEARCH_FORM } from "@/constants/storageKeys";
import { FavoriteItem, SearchFormType } from "@/interfaces/SearchForm";
import { useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityCodeWithCode, getCityNameWithCode, getFirstCityCode } from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";
import { getValue, setValue } from "@/utils/localStorage";
import { decodeSearchParam } from "@/utils/searchParam";

interface Return {
  form: SearchFormType;
  favoriteList: FavoriteItem[];
  registered: boolean;

  onChangeCityName: (cityName: string) => void;
  onChangeCityCode: (cityCode: string) => void;
  onChangeYearMonth: (yearMonth: string) => void;
  onRegistFavorite: () => void;
  onRemoveFavorite: (cityCode: string) => void;
  onClickSearch: (e?: FormEvent) => void;
  onClickFavorite: (cityCode: string) => void;
}

const defaultCityCode = getFirstCityCode();
const defaultYearMonth = getBeforeYearMonth();

const useSearchForm = (): Return => {
  const setSearchParamState = useSetSearchParamState();
  const params = useSearchParams();

  const [favoriteCityCodes, setFavoriteCityCodes] = useState<string[]>(getValue(STORAGE_KEY_FAVORITE_LIST) ?? []);
  const [form, setForm] = useState<SearchFormType>({
    cityName: getCityNameWithCode(defaultCityCode),
    cityCode: defaultCityCode,
    yearMonth: defaultYearMonth,
  });

  const favoriteList = useMemo(
    () =>
      favoriteCityCodes
        .map((cityCode) => ({
          cityCode,
          label: `${getCityNameWithCode(cityCode)} ${getCityCodeWithCode(cityCode)}`,
        }))
        .sort((a, b) => (a.label > b.label ? 1 : -1)),
    [favoriteCityCodes]
  );

  const registered = useMemo(
    () => favoriteCityCodes.some((item) => item === form.cityCode),
    [favoriteCityCodes, form.cityCode]
  );

  const onChangeCityName = (cityName: string) => setForm({ ...form, cityName });

  const onChangeCityCode = (cityCode: string) => setForm({ ...form, cityCode });

  const onChangeYearMonth = (yearMonth: string) =>
    setForm({
      ...form,
      yearMonth: yearMonth.slice(0, 6).replace(/[^0-9]/g, ""),
    });

  const onRegistFavorite = () => {
    const afterFavoriteCityCodes = [...favoriteCityCodes, form.cityCode];

    setFavoriteCityCodes(afterFavoriteCityCodes);
    setValue(STORAGE_KEY_FAVORITE_LIST, afterFavoriteCityCodes);
  };

  const onRemoveFavorite = (cityCode: string) => {
    const afterFavoriteCityCodes = favoriteCityCodes.filter((item) => item !== cityCode);

    setFavoriteCityCodes(afterFavoriteCityCodes);
    setValue(STORAGE_KEY_FAVORITE_LIST, afterFavoriteCityCodes);
  };

  const onSubmit = useCallback(
    ({ yearMonth, cityCode }: { yearMonth: string; cityCode: string }) => {
      setValue(STORAGE_KEY_SEARCH_FORM, { cityCode, yearMonth });
      setSearchParamState({ cityCode, yearMonth });
    },
    [setSearchParamState]
  );

  const onClickSearch = (e?: FormEvent) => {
    e?.preventDefault();
    onSubmit({ yearMonth: form.yearMonth, cityCode: form.cityCode });
  };

  const onClickFavorite = (cityCode: string) => {
    const cityName = getCityNameWithCode(cityCode);
    const afterForm = { ...form, cityName, cityCode };

    setForm(afterForm);
    onSubmit({ yearMonth: form.yearMonth, cityCode });
  };

  useEffect(() => {
    const queryParams = params?.get("params");
    const decodedParams = queryParams && decodeSearchParam(queryParams);

    if (decodedParams) {
      setForm({
        cityName: getCityNameWithCode(decodedParams.cityCode),
        cityCode: decodedParams.cityCode,
        yearMonth: decodedParams?.yearMonth,
      });

      onSubmit({ cityCode: decodedParams.cityCode, yearMonth: decodedParams?.yearMonth });
    }
  }, [params, onSubmit]);

  return {
    form,
    favoriteList,
    registered,

    onChangeCityName,
    onChangeCityCode,
    onChangeYearMonth,
    onRegistFavorite,
    onRemoveFavorite,
    onClickSearch,
    onClickFavorite,
  };
};

export default useSearchForm;
