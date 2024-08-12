import { TradeItem } from "@/interfaces/TradeItem";
import { getTradeList } from "@/utils/crawler";

import Client from "./client";

const page = async ({
  searchParams,
}: {
  searchParams: { cityCode?: string; yearMonth?: string };
}) => {
  let count = 0;
  let tradeItems: TradeItem[] = [];

  if (searchParams.cityCode && searchParams.yearMonth) {
    const result = await getTradeList({
      area: searchParams.cityCode,
      createDt: searchParams.yearMonth,
    });

    count = result.count;
    tradeItems = result.list;
  }

  return <Client count={count} tradeItems={tradeItems} />;
};

export default page;
