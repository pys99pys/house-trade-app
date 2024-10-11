import { useCallback } from "react";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const toastStore = atom<{ key: number; message: string }[]>({
  key: "toastStore",
  default: [],
});

export const useToastValue = () => useRecoilValue(toastStore);
export const useSetToastState = (): ((message: string) => void) => {
  const [state, setState] = useRecoilState(toastStore);

  return useCallback(
    (message: string) => {
      const key = +new Date();
      setState([...state, { key, message }]);

      setTimeout(() => {
        setState((beforeState) => {
          return beforeState.filter((item) => item.key !== key);
        });
      }, 4000);
    },
    [state, setState]
  );
};
