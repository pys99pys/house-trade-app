import { TradeItem } from "@/interfaces/TradeItem";
import { getTradeList } from "@/utils/crawler";

import Client from "./client";

const parseFormParams = (
  formParams?: string
): { cityCode?: string; yearMonth?: string } => {
  try {
    if (!formParams) {
      throw undefined;
    }

    const parsedFormParams = JSON.parse(formParams);

    return {
      cityCode: parsedFormParams.cityCode,
      yearMonth: parsedFormParams.yearMonth,
    };
  } catch {
    return { cityCode: "", yearMonth: "" };
  }
};

const page = async ({ searchParams }: { searchParams: { form?: string } }) => {
  let count = 0;
  let tradeItems: TradeItem[] = [];

  const { cityCode, yearMonth } = parseFormParams(searchParams.form);

  if (cityCode && yearMonth) {
    const result = await getTradeList({
      area: cityCode,
      createDt: yearMonth,
    });

    count = result.count;
    tradeItems = result.list;
  }

  return <Client count={count} tradeItems={tradeItems} />;
};

export default page;
