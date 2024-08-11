import TradeList from "@/components/trade-list/Tradelist";
import { TradeItem } from "@/interfaces/TradeItem";
import { getTradeList } from "@/utils/crawler";

const page = async ({
  searchParams,
}: {
  searchParams: { yearMonth?: string; cityCode?: string };
}) => {
  let count: number = 0;
  let tradeItems: TradeItem[] = [];

  if (searchParams.cityCode && searchParams.yearMonth) {
    const result = await getTradeList({
      area: searchParams.cityCode,
      createDt: searchParams.yearMonth,
    });

    count = result.count;
    tradeItems = result.list;
  }

  return <TradeList count={count} tradeItems={tradeItems} />;
};

export default page;
