import { FC } from "react";

import { TradeItem } from "@/interfaces/TradeItem";

import SearchForm from "./search-form/SearchForm";

interface TradeListProps {
  count: number;
  tradeItems: TradeItem[];
}

const TradeList: FC<TradeListProps> = ({ count, tradeItems }) => {
  return (
    <div>
      <SearchForm />

      <div>{JSON.stringify(tradeItems)}</div>
    </div>
  );
};

export default TradeList;
