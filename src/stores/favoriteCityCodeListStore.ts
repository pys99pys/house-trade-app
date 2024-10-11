import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { FAVORITE_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { getValue } from "@/utils/localStorage";

const favoriteCityCodeListStore = atom<string[]>({
  key: "favoriteListStore",
  default: getValue(FAVORITE_LIST_STORAGE_KEY) ?? [],
});

export const useFavoriteCityCodeListValue = () => useRecoilValue(favoriteCityCodeListStore);
export const useSetFavoriteCityCodeListState = () => useSetRecoilState(favoriteCityCodeListStore);
