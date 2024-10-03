import { FC } from "react";

import FavoriteList from "@/components/trade-list/favorite-list/FavoriteList";
import FilterForm from "@/components/trade-list/filter-form/FilterForm";
import FilterFormMobile from "@/components/trade-list/filter-form/FilterFormMobile";
import SearchForm from "@/components/trade-list/search-form/SearchForm";
import TradeListTable from "@/components/trade-list/trade-list-table/TradeListTable";

import styles from "./TradeList.module.css";
import SearchFormMobile from "./search-form/SearchFormMobile";

interface TradeListProps {}

const TradeList: FC<TradeListProps> = () => {
  const isPc = window.innerWidth > 640;

  const createPcComponent = () => {
    return (
      <div className={styles.tradeListPc}>
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

  const createMobileComponent = () => {
    return (
      <div className={styles.tradeListMobile}>
        <SearchFormMobile />
        <div className={styles.favoriteList}>
          <FavoriteList />
        </div>
        <div className={styles.filterForm}>
          <FilterFormMobile />
        </div>
      </div>
    );
  };

  return isPc ? createPcComponent() : createMobileComponent();
};

export default TradeList;
