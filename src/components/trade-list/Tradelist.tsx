import { FC } from "react";

import { TradeItem } from "@/interfaces/TradeItem";

import styles from "./TradeList.module.css";
import SearchForm from "./search-form/SearchForm";
import TradeListTable from "./trade-list-table/TradeListTable";

interface TradeListProps {
  tradeItems: TradeItem[];
}

const TradeList: FC<TradeListProps> = ({ tradeItems }) => {
  return (
    <div className={styles.tradeList}>
      <div>
        <SearchForm />
      </div>
      <div>
        <TradeListTable tradeItems={tradeItems} />
      </div>
    </div>
  );
};

export default TradeList;
