import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const searchParamSessionStore = atom<{ cityCode?: string } | null>({
  key: "searchParamSessionStore",
  default: null,
});

export const useSearchParamSessionValue = () => useRecoilValue(searchParamSessionStore);
export const useSetSearchParamSessionState = () => useSetRecoilState(searchParamSessionStore);
