import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_FAVORITE_LIST } from "@/constants/storageKeys";
import useDidMount from "@/hooks/useDidMount";
import useMounted from "@/hooks/useMounted";
import { FavoriteItem, SearchFormType } from "@/interfaces/SearchForm";
import {
  getCityCodeWithCode,
  getCityNameWithCode,
  getFirstCityCode,
  getFirstCityName,
} from "@/utils/cityDatas";
import { getBeforeYearMonth } from "@/utils/date";
import { getValue, setValue } from "@/utils/storage";

interface Return {
  form: SearchFormType;
  favoriteList: FavoriteItem[];
  registered: boolean;
  onChangeCityName: (cityName: string) => void;
  onChangeCityCode: (cityCode: string) => void;
  onChangeYearMonth: (yearMonth: string) => void;
  onRegistFavorite: () => void;
  onRemoveFavorite: () => void;
  onClickSearch: (e?: FormEvent) => void;
  onClickFavorite: (cityCode: string) => void;
}

const useSearchForm = (): Return => {
  const isMounted = useMounted();
  const { push } = useRouter();

  const [favoriteCityCodes, setFavoriteCityCodes] = useState<string[]>([]);
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

  const setDefaultFavoriteCityCodes = () => {
    const savedFavoriteCotyCodes = getValue<string[]>(STORAGE_KEY_FAVORITE_LIST);

    if (savedFavoriteCotyCodes) {
      setFavoriteCityCodes(savedFavoriteCotyCodes);
    }
  };

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

  const onRemoveFavorite = () => {
    setFavoriteCityCodes(favoriteCityCodes.filter((item) => item !== form.cityCode));
  };

  const onSubmit = ({ yearMonth, cityCode }: { yearMonth: string; cityCode: string }) => {
    push(`/trade-list?form=${JSON.stringify({ yearMonth, cityCode })}`);
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

  useDidMount(setDefaultFavoriteCityCodes);

  useEffect(() => {
    if (isMounted) {
      setValue(STORAGE_KEY_FAVORITE_LIST, favoriteCityCodes);
    }
  }, [favoriteCityCodes, isMounted]);

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
