import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { TRADE_LIST_PATH } from "@/constants/paths";
import {
  STORAGE_KEY_FAVORITE_LIST,
  STORAGE_KEY_SEARCH_FORM,
} from "@/constants/storageKeys";
import { FavoriteItem, SearchFormType } from "@/interfaces/SearchForm";
import {
  getCityCodeWithCode,
  getCityNameWithCode,
  getFirstCityCode,
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

  const defaultCityCode = searchParams.get("cityCode") ?? getFirstCityCode();
  const defaultYearMonth = searchParams.get("yearMonth") ?? getBeforeYearMonth();

  const [favoriteCityCodes, setFavoriteCityCodes] = useState<string[]>(
    getValue(STORAGE_KEY_FAVORITE_LIST) ?? []
  );
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

  const onSubmit = ({ yearMonth, cityCode }: { yearMonth: string; cityCode: string }) => {
    if (
      searchParams.get("yearMonth") === yearMonth &&
      searchParams.get("cityCode") === cityCode
    ) {
      return;
    }

    onLoad();
    setValue(STORAGE_KEY_SEARCH_FORM, { cityCode, yearMonth });
    push(`${TRADE_LIST_PATH}?cityCode=${cityCode}&yearMonth=${yearMonth}`);
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
