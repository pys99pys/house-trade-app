import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { APART_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { ApartListItem } from "@/interfaces/ApartList";
import { getValue } from "@/utils/localStorage";

const apartListStore = atom<ApartListItem[]>({
  key: "apartListStore",
  default: getValue(APART_LIST_STORAGE_KEY) ?? [],
});

export const useApartListValue = () => useRecoilValue(apartListStore);
export const useSetApartListState = () => useSetRecoilState(apartListStore);
