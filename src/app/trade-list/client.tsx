"use client";

import { FC, useEffect, useState } from "react";

import TradeList from "@/components/trade-list/Tradelist";
import { TradeItem } from "@/interfaces/TradeItem";

interface ClientProps {
  tradeItems: TradeItem[];
}

const Client: FC<ClientProps> = ({ tradeItems }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return <TradeList tradeItems={tradeItems} />;
};

export default Client;
