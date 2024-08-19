import { FC, useEffect, useState } from "react";

import { TradeItem } from "@/interfaces/TradeItem";

import styles from "./TradeList.module.css";
import SearchForm from "./search-form/SearchForm";
import TradeListTable from "./trade-list-table/TradeListTable";

interface TradeListProps {
  loading: boolean;
  tradeItems: TradeItem[];
  setLoading: (loading: boolean) => void;
}

const TradeList: FC<TradeListProps> = ({ loading, tradeItems, setLoading }) => {
  return (
    <div className={styles.tradeList}>
      <div>
        <SearchForm onLoad={() => setLoading(true)} />
      </div>
      <div>
        <TradeListTable loading={loading} tradeItems={tradeItems} />
      </div>
    </div>
  );
};

export default TradeList;
