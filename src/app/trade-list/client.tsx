"use client";

import { FC, useEffect, useState } from "react";

import Layout from "@/components/common/layout/Layout";
import TradeList from "@/components/trade-list/Tradelist";
import { TradeItem } from "@/interfaces/TradeItem";

interface ClientProps {
  updatedAt: number;
  tradeItems: TradeItem[];
}

const Client: FC<ClientProps> = ({ updatedAt, tradeItems }) => {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [updatedAt]);

  console.log("updatedAt: ", updatedAt);

  if (!isReady) {
    return null;
  }

  return (
    <Layout>
      <TradeList loading={loading} tradeItems={tradeItems} setLoading={setLoading} />
    </Layout>
  );
};

export default Client;
