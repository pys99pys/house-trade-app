import cx from "classnames";
import { FC, ReactNode } from "react";

import Loading from "@/components/common/loading/Loading";
import Pagination from "@/components/common/pagination/Pagination";
import { TRADE_TABLE_PER_PAGE } from "@/constants/rules";
import { TradeItem } from "@/interfaces/TradeItem";
import { createApartItemKey } from "@/utils/apartListUtil";
import { parseToAmount, parseToAreaSize, parseToFlatSize } from "@/utils/formatter";

import styles from "./TradeListTable.module.css";
import useTradeListTable from "./useTradeListTable";

interface TradeListTableProps {}

const TradeListTable: FC<TradeListTableProps> = () => {
  const { status, order, count, page, tradeList, apartList, onChangeOrder, onSaveItem, onRemoveItem, onChangePage } =
    useTradeListTable();

  const createHeaderCell = (key: keyof TradeItem, label: string) => (
    <div className={styles.headerCell}>
      <button onClick={() => onChangeOrder([key, order[0] === key ? (order[1] === "asc" ? "desc" : "asc") : "asc"])}>
        <span>{label}</span>
        {order[0] === key && <span className={styles[order[1]]}>▾</span>}
      </button>
    </div>
  );

  const createBodyCell = (label: ReactNode) => <div className={styles.cell}>{label}</div>;

  const createButtonCell = (children: ReactNode) => <div className={styles.buttonCell}>{children}</div>;

  return (
    <div className={styles.tradeListTable}>
      <div className={styles.header}>
        {createHeaderCell("tradeDate", "거래일")}
        {createHeaderCell("address", "주소지")}
        {createHeaderCell("apartName", "아파트명")}
        {createHeaderCell("size", "평수")}
        {createHeaderCell("tradeAmount", "거래가격")}
        {createHeaderCell("maxTradeAmount", "신고가")}
      </div>

      <div className={styles.body}>
        {status === "LOADING" && (
          <div className={styles.loading}>
            <Loading />
          </div>
        )}

        {status === "EMPTY" && <div className={styles.empty}>데이터 없음</div>}

        {status === "SUCCESS" &&
          tradeList.map((item, i) => {
            const isSavedItem = apartList.some((apartItem) => apartItem === createApartItemKey(item));

            return (
              <div key={i} className={cx(styles.row, { [styles.active]: isSavedItem })}>
                {createBodyCell(<>{item.tradeDate}</>)}
                {createBodyCell(<>{item.address}</>)}
                {createBodyCell(
                  <div className={styles.wrap}>
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
                  </div>
                )}
                {createBodyCell(
                  item.size && (
                    <div className={styles.wrap}>
                      {parseToFlatSize(item.size)}평<small>({parseToAreaSize(item.size)}㎡)</small>
                    </div>
                  )
                )}
                {createBodyCell(
                  <span className={cx({ [styles.highlight]: item.isNewRecord })}>
                    {parseToAmount(item.tradeAmount)}억원{item.isNewRecord && "(신)"}
                  </span>
                )}
                {createBodyCell(item.maxTradeAmount > 0 ? <>{parseToAmount(item.maxTradeAmount)}억원</> : null)}
                {createButtonCell(
                  <>
                    {isSavedItem && (
                      <button className={styles.removeButton} onClick={() => onRemoveItem(item)}>
                        삭제
                      </button>
                    )}
                    {!isSavedItem && (
                      <button className={styles.saveButton} onClick={() => onSaveItem(item)}>
                        저장
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>

      {status === "SUCCESS" && count > TRADE_TABLE_PER_PAGE && (
        <div className={styles.pagination}>
          <Pagination per={TRADE_TABLE_PER_PAGE} block={10} total={count} current={page} onChange={onChangePage} />
        </div>
      )}
    </div>
  );
};

export default TradeListTable;
