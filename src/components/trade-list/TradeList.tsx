import { FC } from "react";

import FavoriteList from "@/components/trade-list/favorite-list/FavoriteList";
import FilterForm from "@/components/trade-list/filter-form/FilterForm";
import SearchForm from "@/components/trade-list/search-form/SearchForm";
import TradeListTable from "@/components/trade-list/trade-list-table/TradeListTable";

import styles from "./TradeList.module.css";

interface TradeListProps {}

const TradeList: FC<TradeListProps> = () => {
  return (
    <div className={styles.tradeList}>
      <SearchForm />
      <div className={styles.favoriteList}>
        <FavoriteList />
      </div>
      <div className={styles.filterForm}>
        <FilterForm />
      </div>
      <div className={styles.tradeList}>
        <TradeListTable />
      </div>
    </div>
  );
};

export default TradeList;
