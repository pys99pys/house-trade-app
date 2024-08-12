import { FC } from "react";

import { TradeItem } from "@/interfaces/TradeItem";

import SearchForm from "./search-form/SearchForm";

interface TradeListProps {
  count: number;
  tradeItems: TradeItem[];
}

const TradeList: FC<TradeListProps> = ({ count, tradeItems }) => {
  return (
    <>
      <SearchForm />

      <div>{JSON.stringify(tradeItems)}</div>
    </>
  );
};

export default TradeList;
