import { FC, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "@/components/common/button/Button";
import { ELEMENT_ID_YEAR_MONTH_INPUT } from "@/constants/elementId";
import { STORAGE_KEY_FAVORITE_LIST } from "@/constants/storageKeys";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityData";
import { setValue } from "@/utils/localStorage";

interface Return {
  favoriteList: { cityCode: string; label: string }[];
  onClick: (cityCode: string) => void;
  onRemove: (cityCode: string) => void;
}

const useFavoriteList = (): Return => {
  const favoriteCityCodes = useFavoriteCityCodeListValue();
  const setFavoriteCityCodes = useSetFavoriteCityCodeListState();
  const setSearchParam = useSetSearchParamState();

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

  const onClick = (cityCode: string) => {
    const yearMonthInput = document.getElementById(ELEMENT_ID_YEAR_MONTH_INPUT) as HTMLInputElement | null;

    if (yearMonthInput) {
      setSearchParam({ cityCode, yearMonth: yearMonthInput.value });
    }
  };

  const onRemove = (cityCode: string) => {
    const afterFavoriteCityCodes = favoriteCityCodes.filter((item) => item !== cityCode);

    setFavoriteCityCodes(afterFavoriteCityCodes);
    setValue(STORAGE_KEY_FAVORITE_LIST, afterFavoriteCityCodes);
  };

  return { favoriteList, onClick, onRemove };
};

export default useFavoriteList;
