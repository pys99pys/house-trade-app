import { TradeItem } from "@/interfaces/TradeItem";
import { getTradeList } from "@/utils/crawler";

import Client from "./client";

interface Params {
  searchParams: { cityCode?: string; yearMonth?: string };
}

const Page = async ({ searchParams }: Params) => {
  let tradeItems: TradeItem[] = [];

  if (searchParams.cityCode && searchParams.yearMonth) {
    const result = await getTradeList({
      area: searchParams.cityCode,
      createDt: searchParams.yearMonth,
    });

    tradeItems = result.list;
  }

  return <Client updatedAt={+new Date()} tradeItems={tradeItems} />;
};

export default Page;
