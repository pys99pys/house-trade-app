"use client";

import { FC } from "react";

import SearchForm from "@/components/search-form/SearchForm";
import { TradeItem } from "@/interfaces/TradeItem";

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
