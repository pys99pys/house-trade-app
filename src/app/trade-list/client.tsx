"use client";

import { FC } from "react";

import TradeList from "@/components/trade-list/Tradelist";
import { TradeItem } from "@/interfaces/TradeItem";

interface clientProps {
  count: number;
  tradeItems: TradeItem[];
}

const client: FC<clientProps> = ({ count, tradeItems }) => {
  return <TradeList count={count} tradeItems={tradeItems} />;
};

export default client;
