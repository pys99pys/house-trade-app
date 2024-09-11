import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const searchParamStore = atom<{ yearMonth: string; cityCode: string }>({
  key: "searchParamStore",
  default: {
    yearMonth: "",
    cityCode: "",
  },
});

export const useSearchParamValue = () => useRecoilValue(searchParamStore);
export const useSetSearchParamState = () => useSetRecoilState(searchParamStore);
