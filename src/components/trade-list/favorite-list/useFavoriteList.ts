import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { TRADE_LIST_PATH } from "@/constants/paths";
import { FAVORITE_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityDataUtil";
import { setValue } from "@/utils/localStorage";

interface Return {
  favoriteList: { cityCode: string; label: string }[];
  onClick: (cityCode: string) => void;
  onRemove: (cityCode: string) => void;
}

const useFavoriteList = (): Return => {
  const favoriteCityCodes = useFavoriteCityCodeListValue();

  const navigate = useNavigate();
  const setFavoriteCityCodes = useSetFavoriteCityCodeListState();

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
    navigate(TRADE_LIST_PATH, { state: { cityCode } });
  };

  const onRemove = (cityCode: string) => {
    const afterFavoriteCityCodes = favoriteCityCodes.filter((item) => item !== cityCode);

    setFavoriteCityCodes(afterFavoriteCityCodes);
    setValue(FAVORITE_LIST_STORAGE_KEY, afterFavoriteCityCodes);
  };

  return { favoriteList, onClick, onRemove };
};

export default useFavoriteList;
