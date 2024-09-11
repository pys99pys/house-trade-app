"use client";

import Layout from "@/components/common/layout/Layout";
import SearchForm from "@/components/trade-list/search-form/SearchForm";
import TradeListTable from "@/components/trade-list/trade-list-table/TradeListTable";

import styles from "./page.module.css";

const Page = () => {
  return (
    <Layout>
      <div className={styles.tradeList}>
        <div>
          <SearchForm />
        </div>
        <div>
          <TradeListTable />
        </div>
      </div>
    </Layout>
  );
};

export default Page;
