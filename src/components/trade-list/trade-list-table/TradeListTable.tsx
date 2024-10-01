import cx from "classnames";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

import Pagination from "@/components/common/pagination/Pagination";
import { STORAGE_KEY_ORDER } from "@/constants/storageKeys";
import useSavedList from "@/hooks/useSavedList";
import useTradeList from "@/hooks/useTradeList";
import { OrderType } from "@/interfaces/Order";
import { TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useFilterFormValue } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { parseToAmount, parseToAreaSize, parseToFlatSize } from "@/utils/formatter";
import { getValue, setValue } from "@/utils/localStorage";
import { compareSavedApartItem, sliceItems, sortItems } from "@/utils/tradeItem";

import FilterForm from "../filter-form/FilterForm";
import styles from "./TradeListTable.module.css";

interface TradeListTableProps {}

const PER_PAGE = 15;

const TradeListTable: FC<TradeListTableProps> = () => {
  const searchParam = useSearchParamValue();
  const filterForm = useFilterFormValue();

  const { isLoading } = useFetchTradeListQuery();
  const { savedList, saveItem, removeItem } = useSavedList();
  const { tradeList: filteredTradeList } = useTradeList();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(getValue(STORAGE_KEY_ORDER) ?? ["tradeDate", "desc"]);

  const savedApartList = useMemo(
    () => savedList.find((item) => item.cityCode === searchParam.cityCode)?.apartList ?? [],
    [searchParam, savedList]
  );

  const tradeList = useMemo(() => {
    const sortedItems = sortItems(filteredTradeList, order);
    const slicedItems = sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });

    return slicedItems;
  }, [filteredTradeList, order, page]);

  const count = useMemo(() => filteredTradeList.length, [filteredTradeList]);

  const status = useMemo(() => {
    if (isLoading) {
      return "LOADING";
    }

    if (tradeList.length === 0) {
      return "EMPTY";
    }

    return "SUCCESS";
  }, [isLoading, tradeList]);

  const onChangeOrder = (column: OrderType[0]) => {
    const afterOrder: OrderType = [column, order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc"];

    setValue(STORAGE_KEY_ORDER, afterOrder);
    setOrder(afterOrder);
  };

  const onClickList = (tradeItem: { address: TradeItem["address"]; apartName: TradeItem["apartName"] }) => {
    const hasSavedApartList = savedApartList.some((item) => compareSavedApartItem(item, tradeItem));

    if (hasSavedApartList) {
      removeItem(searchParam.cityCode, tradeItem);
    } else {
      saveItem(searchParam.cityCode, tradeItem);
    }
  };

  const onChangePage = (page: number) => setPage(page);

  const createHeaderCell = (key: keyof TradeItem, label: string) => (
    <div className={styles.headerCell}>
      <button className={styles.headerButton} onClick={() => onChangeOrder(key)}>
        {label}
        {order[0] === key && <span className={styles[order[1]]}>▾</span>}
      </button>
    </div>
  );

  const createBodyCell = (label: ReactNode) => <div className={styles.rowCell}>{label}</div>;

  useEffect(() => setPage(1), [searchParam, filterForm]);

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        {createHeaderCell("tradeDate", "거래일")}
        {createHeaderCell("address", "주소지")}
        {createHeaderCell("apartName", "아파트명")}
        {createHeaderCell("size", "평수")}
        {createHeaderCell("tradeAmount", "거래가격")}
        {createHeaderCell("maxTradeAmount", "신고가")}
      </div>

      <div className={styles.body}>
        {status === "LOADING" && <div className={styles.empty}>조회중...</div>}

        {status === "EMPTY" && <div className={styles.empty}>데이터 없음</div>}

        {status === "SUCCESS" && (
          <>
            {tradeList.map((item, i) => (
              <div
                key={i}
                className={cx(styles.row, {
                  [styles.active]: savedApartList.some((savedApartItem) => compareSavedApartItem(item, savedApartItem)),
                })}
                onClick={() => onClickList(item)}
              >
                {createBodyCell(<>{item.tradeDate}</>)}
                {createBodyCell(<>{item.address}</>)}
                {createBodyCell(
                  <>
                    {item.apartName}
                    <small>
                      {(() => {
                        const subTexts: string[] = [];

                        if (item.floor !== null) subTexts.push(`${item.floor}층`);
                        if (item.buildedYear !== null) subTexts.push(`${item.buildedYear}년식`);
                        if (item.householdsNumber !== null) subTexts.push(`${item.householdsNumber}세대`);

                        return subTexts.length > 0 ? `(${subTexts.join("/")})` : "";
                      })()}
                    </small>
                  </>
                )}
                {createBodyCell(
                  item.size && (
                    <>
                      {parseToFlatSize(item.size)}평<small>({parseToAreaSize(item.size)}㎡)</small>
                    </>
                  )
                )}
                {createBodyCell(
                  <span className={cx({ [styles.newRecord]: item.isNewRecord })}>
                    {parseToAmount(item.tradeAmount)}억원{item.isNewRecord && "(신)"}
                  </span>
                )}
                {createBodyCell(item.maxTradeAmount > 0 ? <>{parseToAmount(item.maxTradeAmount)}억원</> : null)}
              </div>
            ))}
          </>
        )}

        {count > PER_PAGE && (
          <div className={styles.pagination}>
            <Pagination per={PER_PAGE} total={count} current={page} onChange={onChangePage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeListTable;
