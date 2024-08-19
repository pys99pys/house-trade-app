import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST } from "@/constants/storageKeys";
import { FavoriteItem, SearchFormType } from "@/interfaces/SearchForm";
import {
  getCityCodeWithCode,
  getCityNameWithCode,
  getFirstCityCode,
  getFirstCityName,
} from "@/utils/cityData";
import { getBeforeYearMonth } from "@/utils/date";
import { getValue, setValue } from "@/utils/storage";

interface Params {
  onLoad: () => void;
}

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

const useSearchForm = ({ onLoad }: Params): Return => {
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const [favoriteCityCodes, setFavoriteCityCodes] = useState<string[]>(
    getValue(STORAGE_KEY_FAVORITE_LIST) ?? []
  );
  const [form, setForm] = useState<SearchFormType>({
    cityName: getFirstCityName(),
    cityCode: getFirstCityCode(),
    yearMonth: getBeforeYearMonth(),
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
    setFavoriteCityCodes([...favoriteCityCodes, form.cityCode]);
  };

  const onRemoveFavorite = (cityCode: string) => {
    setFavoriteCityCodes(favoriteCityCodes.filter((item) => item !== cityCode));
  };

  const onSubmit = ({ yearMonth, cityCode }: { yearMonth: string; cityCode: string }) => {
    if (
      searchParams.get("yearMonth") === yearMonth &&
      searchParams.get("cityCode") === cityCode
    ) {
      return;
    }

    onLoad();
    push(`/trade-list?cityCode=${cityCode}&yearMonth=${yearMonth}`);
  };

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

  useEffect(
    () => setValue(STORAGE_KEY_FAVORITE_LIST, favoriteCityCodes),
    [favoriteCityCodes]
  );

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
