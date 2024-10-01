import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { STORAGE_KEY_FAVORITE_LIST } from "@/constants/storageKeys";
import { getValue } from "@/utils/localStorage";

const favoriteCityCodeListStore = atom<string[]>({
  key: "favoriteListStore",
  default: getValue(STORAGE_KEY_FAVORITE_LIST) ?? [],
});

export const useFavoriteCityCodeListValue = () => useRecoilValue(favoriteCityCodeListStore);
export const useSetFavoriteCityCodeListState = () => useSetRecoilState(favoriteCityCodeListStore);
