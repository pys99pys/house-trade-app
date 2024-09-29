import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const calculationStore = atom<{ tradeListCount: number; averageAmount: number }>({
  key: "calculationStore",
  default: {
    tradeListCount: 0,
    averageAmount: 0,
  },
});

export const useCalculationValue = () => useRecoilValue(calculationStore);
export const useSetCalculation = () => useSetRecoilState(calculationStore);
