import { FC, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "@/components/common/button/Button";
import { ELEMENT_ID_YEAR_MONTH_INPUT } from "@/constants/elementId";
import { STORAGE_KEY_FAVORITE_LIST } from "@/constants/storageKeys";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSetSearchParamState } from "@/stores/searchParamStore";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityData";
import { setValue } from "@/utils/localStorage";

import styles from "./FavoriteList.module.css";

interface FavoriteListProps {}

const FavoriteList: FC<FavoriteListProps> = () => {
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

  return (
    <ul className={styles.favoriteList}>
      {favoriteList.map((item) => (
        <Button key={item.cityCode} size="xsmall" onClick={() => onClick(item.cityCode)}>
          {item.label}
          <span
            role="button"
            className={styles.removeIcon}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.cityCode);
            }}
          >
            <FaTimes />
          </span>
        </Button>
      ))}
    </ul>
  );
};

export default FavoriteList;
