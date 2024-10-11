import { useMemo } from "react";

import { FAVORITE_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { useFavoriteCityCodeListValue, useSetFavoriteCityCodeListState } from "@/stores/favoriteCityCodeListStore";
import { useSetSearchParamSessionState } from "@/stores/searchParamSessionStore";
import { getCityCodeWithCode, getCityNameWithCode } from "@/utils/cityDataUtil";
import { setValue } from "@/utils/localStorage";

interface Return {
  favoriteList: { cityCode: string; label: string }[];
  onClick: (cityCode: string) => void;
  onRemove: (cityCode: string) => void;
}

const useFavoriteList = (): Return => {
  const favoriteCityCodes = useFavoriteCityCodeListValue();
  const setFavoriteCityCodes = useSetFavoriteCityCodeListState();
  const setSearchParamSession = useSetSearchParamSessionState();

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
    setSearchParamSession({ cityCode });
  };

  const onRemove = (cityCode: string) => {
    const afterFavoriteCityCodes = favoriteCityCodes.filter((item) => item !== cityCode);

    setFavoriteCityCodes(afterFavoriteCityCodes);
    setValue(FAVORITE_LIST_STORAGE_KEY, afterFavoriteCityCodes);
  };

  return { favoriteList, onClick, onRemove };
};

export default useFavoriteList;
