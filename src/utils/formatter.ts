export const parseToNumberFormat = (number: number): string =>
  number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

export const parseToFlatSize = (areaSize: number): number => {
  const area = areaSize * 0.3025;
  const addtionalSize = areaSize < 84 ? 8 : 9;

  return Math.floor(area + addtionalSize);
};

export const parseToAreaSize = (originSize: number): number => {
  return Math.round(originSize * 100) / 100;
};

export const parseToAmount = (amount: number): number => amount / 100000000;

export const parseToAverageAmountText = (tradeList: TradeItem[]): number => {
  const averageAmount = tradeList.reduce(
    (acc, item) => acc + Math.floor(item.tradeAmount / parseToFlatSize(item.size)),
    0
  );

  return averageAmount / tradeList.length;
};

export const parseToAmountText = (amount: number): string => {
  let restAmount = amount;
  const amountTextArr: string[] = [];

  if (amount > 100000000) {
    const n = parseInt((amount / 100000000).toString());

    amountTextArr.push(`${n}억`);
    restAmount = -amount - n * 100000000;
  }

  if (restAmount > 0) {
    amountTextArr.push(`${parseToNumberFormat(Math.floor(restAmount / 10000))}만`);
  }

  return `${amountTextArr.join(" ")}원`;
};
