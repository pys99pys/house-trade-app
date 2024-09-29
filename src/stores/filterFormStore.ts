import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { FilterType } from "@/interfaces/Filter";

const filterFormStore = atom<FilterType>({
  key: "filterFormStore",
  default: {
    apartName: "",
    onlyBaseSize: false,
    onlySavedList: false,
  },
});

export const useFilterFormValue = () => useRecoilValue(filterFormStore);
export const useSetFilterFormState = () => useSetRecoilState(filterFormStore);
